import { test, expect, vi, beforeEach } from "vitest";
import { DesignSystemScanner } from "../design-system-scanner";

// Figma APIのモック型定義
interface MockPaintStyle {
  id: string;
  name: string;
  description: string;
  key: string;
  paints: readonly Paint[];
  type: "PAINT";
}

interface MockTextStyle {
  id: string;
  name: string;
  description: string;
  key: string;
  fontName: { family: string; style: string };
  fontSize: number;
  lineHeight: { value: number; unit: string } | { unit: "AUTO" };
  letterSpacing: { value: number; unit: string };
  type: "TEXT";
}

interface MockEffectStyle {
  id: string;
  name: string;
  description: string;
  key: string;
  effects: readonly Effect[];
  type: "EFFECT";
}

interface MockComponent {
  id: string;
  name: string;
  description: string;
  key: string;
  componentPropertyDefinitions?: Record<
    string,
    {
      type: "BOOLEAN" | "TEXT" | "INSTANCE_SWAP" | "VARIANT";
      defaultValue?: string | boolean;
    }
  >;
}

// グローバルfigmaオブジェクトのモック
const mockFigma = {
  getLocalPaintStyles: vi.fn(),
  getLocalTextStyles: vi.fn(),
  getLocalEffectStyles: vi.fn(),
  getLocalGridStyles: vi.fn(),
  root: {
    findAllWithCriteria: vi.fn(),
  },
};

// グローバルにfigmaをセット
vi.stubGlobal("figma", mockFigma);

beforeEach(() => {
  vi.clearAllMocks();
  // デフォルトで空配列を返す
  mockFigma.getLocalPaintStyles.mockReturnValue([]);
  mockFigma.getLocalTextStyles.mockReturnValue([]);
  mockFigma.getLocalEffectStyles.mockReturnValue([]);
  mockFigma.getLocalGridStyles.mockReturnValue([]);
  mockFigma.root.findAllWithCriteria.mockReturnValue([]);
});

test("DesignSystemScanner.scan - スタイルやコンポーネントが存在しない - 空のデザインシステムを返す", async () => {
  // Arrange
  const scanner = DesignSystemScanner.create();

  // Act
  const result = await scanner.scan();

  // Assert
  expect(result.styles).toEqual([]);
  expect(result.components).toEqual([]);
  expect(result.scannedAt).toBeInstanceOf(Date);
});

test("DesignSystemScanner.scan - ペイントスタイルが存在する - ペイントスタイルをスキャンする", async () => {
  // Arrange
  const mockPaintStyles: MockPaintStyle[] = [
    {
      id: "S:paint1",
      name: "Primary/Blue",
      description: "Primary blue color",
      key: "paint-key-1",
      paints: [
        { type: "SOLID", color: { r: 0, g: 0.4, b: 1 }, opacity: 1 },
      ],
      type: "PAINT",
    },
  ];
  mockFigma.getLocalPaintStyles.mockReturnValue(mockPaintStyles);
  const scanner = DesignSystemScanner.create();

  // Act
  const result = await scanner.scan();

  // Assert
  expect(result.styles).toHaveLength(1);
  expect(result.styles[0]).toMatchObject({
    name: "Primary/Blue",
    type: "PAINT",
    description: "Primary blue color",
  });
});

test("DesignSystemScanner.scan - テキストスタイルが存在する - テキストスタイルをスキャンする", async () => {
  // Arrange
  const mockTextStyles: MockTextStyle[] = [
    {
      id: "S:text1",
      name: "Heading/H1",
      description: "Main heading",
      key: "text-key-1",
      fontName: { family: "Inter", style: "Bold" },
      fontSize: 32,
      lineHeight: { value: 40, unit: "PIXELS" },
      letterSpacing: { value: 0, unit: "PIXELS" },
      type: "TEXT",
    },
  ];
  mockFigma.getLocalTextStyles.mockReturnValue(mockTextStyles);
  const scanner = DesignSystemScanner.create();

  // Act
  const result = await scanner.scan();

  // Assert
  expect(result.styles).toHaveLength(1);
  expect(result.styles[0]).toMatchObject({
    name: "Heading/H1",
    type: "TEXT",
    fontFamily: "Inter",
    fontSize: 32,
  });
});

test("DesignSystemScanner.scan - エフェクトスタイルが存在する - エフェクトスタイルをスキャンする", async () => {
  // Arrange
  const mockEffectStyles: MockEffectStyle[] = [
    {
      id: "S:effect1",
      name: "Shadow/Medium",
      description: "Medium shadow",
      key: "effect-key-1",
      effects: [
        {
          type: "DROP_SHADOW",
          color: { r: 0, g: 0, b: 0, a: 0.25 },
          offset: { x: 0, y: 4 },
          radius: 8,
          spread: 0,
          visible: true,
          blendMode: "NORMAL",
        },
      ],
      type: "EFFECT",
    },
  ];
  mockFigma.getLocalEffectStyles.mockReturnValue(mockEffectStyles);
  const scanner = DesignSystemScanner.create();

  // Act
  const result = await scanner.scan();

  // Assert
  expect(result.styles).toHaveLength(1);
  expect(result.styles[0]).toMatchObject({
    name: "Shadow/Medium",
    type: "EFFECT",
  });
});

test("DesignSystemScanner.scan - コンポーネントが存在する - コンポーネントをスキャンする", async () => {
  // Arrange
  const mockComponents: MockComponent[] = [
    {
      id: "C:component1",
      name: "Button/Primary",
      description: "Primary button component",
      key: "component-key-1",
      componentPropertyDefinitions: {
        label: { type: "TEXT", defaultValue: "Button" },
        disabled: { type: "BOOLEAN", defaultValue: false },
      },
    },
  ];
  mockFigma.root.findAllWithCriteria.mockReturnValue(mockComponents);
  const scanner = DesignSystemScanner.create();

  // Act
  const result = await scanner.scan();

  // Assert
  expect(result.components).toHaveLength(1);
  expect(result.components[0]).toMatchObject({
    name: "Button/Primary",
    description: "Primary button component",
  });
  expect(result.components[0].properties).toHaveLength(2);
});

test("DesignSystemScanner.scan - 複数のスタイルとコンポーネントが存在する - 全てをスキャンする", async () => {
  // Arrange
  const mockPaintStyles: MockPaintStyle[] = [
    {
      id: "S:paint1",
      name: "Primary/Blue",
      description: "",
      key: "key1",
      paints: [],
      type: "PAINT",
    },
    {
      id: "S:paint2",
      name: "Secondary/Gray",
      description: "",
      key: "key2",
      paints: [],
      type: "PAINT",
    },
  ];
  const mockTextStyles: MockTextStyle[] = [
    {
      id: "S:text1",
      name: "Body/Regular",
      description: "",
      key: "key3",
      fontName: { family: "Inter", style: "Regular" },
      fontSize: 16,
      lineHeight: { unit: "AUTO" },
      letterSpacing: { value: 0, unit: "PIXELS" },
      type: "TEXT",
    },
  ];
  const mockComponents: MockComponent[] = [
    {
      id: "C:comp1",
      name: "Card",
      description: "",
      key: "key4",
    },
  ];
  mockFigma.getLocalPaintStyles.mockReturnValue(mockPaintStyles);
  mockFigma.getLocalTextStyles.mockReturnValue(mockTextStyles);
  mockFigma.root.findAllWithCriteria.mockReturnValue(mockComponents);
  const scanner = DesignSystemScanner.create();

  // Act
  const result = await scanner.scan();

  // Assert
  expect(result.styles).toHaveLength(3);
  expect(result.components).toHaveLength(1);
});

test("DesignSystemScanner.scanStyles - スタイルが存在する - スタイルのみをスキャンする", async () => {
  // Arrange
  const mockPaintStyles: MockPaintStyle[] = [
    {
      id: "S:paint1",
      name: "Color/Red",
      description: "",
      key: "key1",
      paints: [],
      type: "PAINT",
    },
  ];
  mockFigma.getLocalPaintStyles.mockReturnValue(mockPaintStyles);
  const scanner = DesignSystemScanner.create();

  // Act
  const styles = await scanner.scanStyles();

  // Assert
  expect(styles).toHaveLength(1);
  expect(styles[0].name).toBe("Color/Red");
});

test("DesignSystemScanner.scanComponents - コンポーネントが存在する - コンポーネントのみをスキャンする", async () => {
  // Arrange
  const mockComponents: MockComponent[] = [
    {
      id: "C:comp1",
      name: "Icon/Arrow",
      description: "",
      key: "key1",
    },
  ];
  mockFigma.root.findAllWithCriteria.mockReturnValue(mockComponents);
  const scanner = DesignSystemScanner.create();

  // Act
  const components = await scanner.scanComponents();

  // Assert
  expect(components).toHaveLength(1);
  expect(components[0].name).toBe("Icon/Arrow");
});

test("DesignSystemScanner.findStyleByName - 対象のスタイルが存在する - スタイルを見つける", async () => {
  // Arrange
  const mockPaintStyles: MockPaintStyle[] = [
    {
      id: "S:paint1",
      name: "Primary/Blue",
      description: "",
      key: "key1",
      paints: [],
      type: "PAINT",
    },
    {
      id: "S:paint2",
      name: "Secondary/Gray",
      description: "",
      key: "key2",
      paints: [],
      type: "PAINT",
    },
  ];
  mockFigma.getLocalPaintStyles.mockReturnValue(mockPaintStyles);
  const scanner = DesignSystemScanner.create();
  await scanner.scan();

  // Act
  const style = scanner.findStyleByName("Primary/Blue");

  // Assert
  expect(style).toBeDefined();
  expect(style?.name).toBe("Primary/Blue");
});

test("DesignSystemScanner.findStyleByName - 対象のスタイルが存在しない - undefinedを返す", async () => {
  // Arrange
  mockFigma.getLocalPaintStyles.mockReturnValue([]);
  const scanner = DesignSystemScanner.create();
  await scanner.scan();

  // Act
  const style = scanner.findStyleByName("NonExistent");

  // Assert
  expect(style).toBeUndefined();
});

test("DesignSystemScanner.findComponentByName - 対象のコンポーネントが存在する - コンポーネントを見つける", async () => {
  // Arrange
  const mockComponents: MockComponent[] = [
    {
      id: "C:comp1",
      name: "Button/Primary",
      description: "",
      key: "key1",
    },
  ];
  mockFigma.root.findAllWithCriteria.mockReturnValue(mockComponents);
  const scanner = DesignSystemScanner.create();
  await scanner.scan();

  // Act
  const component = scanner.findComponentByName("Button/Primary");

  // Assert
  expect(component).toBeDefined();
  expect(component?.name).toBe("Button/Primary");
});

test("DesignSystemScanner.getStylesByType - 複数の種類のスタイルが存在する - 指定した種類のスタイルをフィルタする", async () => {
  // Arrange
  const mockPaintStyles: MockPaintStyle[] = [
    {
      id: "S:paint1",
      name: "Color/Blue",
      description: "",
      key: "key1",
      paints: [],
      type: "PAINT",
    },
  ];
  const mockTextStyles: MockTextStyle[] = [
    {
      id: "S:text1",
      name: "Heading/H1",
      description: "",
      key: "key2",
      fontName: { family: "Inter", style: "Bold" },
      fontSize: 32,
      lineHeight: { unit: "AUTO" },
      letterSpacing: { value: 0, unit: "PIXELS" },
      type: "TEXT",
    },
  ];
  mockFigma.getLocalPaintStyles.mockReturnValue(mockPaintStyles);
  mockFigma.getLocalTextStyles.mockReturnValue(mockTextStyles);
  const scanner = DesignSystemScanner.create();
  await scanner.scan();

  // Act
  const paintStyles = scanner.getStylesByType("PAINT");
  const textStyles = scanner.getStylesByType("TEXT");

  // Assert
  expect(paintStyles).toHaveLength(1);
  expect(textStyles).toHaveLength(1);
  expect(paintStyles[0].type).toBe("PAINT");
  expect(textStyles[0].type).toBe("TEXT");
});

test("DesignSystemScanner.clearCache - キャッシュが存在する - キャッシュされたデザインシステムをクリアする", async () => {
  // Arrange
  const scanner = DesignSystemScanner.create();
  await scanner.scan();
  expect(scanner.getCachedDesignSystem()).not.toBeNull();

  // Act
  scanner.clearCache();

  // Assert
  expect(scanner.getCachedDesignSystem()).toBeNull();
});

test("DesignSystemScanner.clearCache - キャッシュをクリア後にfindStyleByNameを実行 - undefinedを返す", async () => {
  // Arrange
  const mockPaintStyles: MockPaintStyle[] = [
    {
      id: "S:paint1",
      name: "Primary/Blue",
      description: "",
      key: "key1",
      paints: [],
      type: "PAINT",
    },
  ];
  mockFigma.getLocalPaintStyles.mockReturnValue(mockPaintStyles);
  const scanner = DesignSystemScanner.create();
  await scanner.scan();

  // Act
  scanner.clearCache();
  const style = scanner.findStyleByName("Primary/Blue");

  // Assert
  expect(style).toBeUndefined();
});
