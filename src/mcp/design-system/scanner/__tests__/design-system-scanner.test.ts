import { describe, it, expect, vi, beforeEach } from "vitest";
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

describe("DesignSystemScanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // デフォルトで空配列を返す
    mockFigma.getLocalPaintStyles.mockReturnValue([]);
    mockFigma.getLocalTextStyles.mockReturnValue([]);
    mockFigma.getLocalEffectStyles.mockReturnValue([]);
    mockFigma.getLocalGridStyles.mockReturnValue([]);
    mockFigma.root.findAllWithCriteria.mockReturnValue([]);
  });

  describe("scan", () => {
    it("空のデザインシステムを返す（スタイル・コンポーネントがない場合）", async () => {
      const scanner = DesignSystemScanner.create();
      const result = await scanner.scan();

      expect(result.styles).toEqual([]);
      expect(result.components).toEqual([]);
      expect(result.scannedAt).toBeInstanceOf(Date);
    });

    it("ペイントスタイルをスキャンする", async () => {
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
      const result = await scanner.scan();

      expect(result.styles).toHaveLength(1);
      expect(result.styles[0]).toMatchObject({
        name: "Primary/Blue",
        type: "PAINT",
        description: "Primary blue color",
      });
    });

    it("テキストスタイルをスキャンする", async () => {
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
      const result = await scanner.scan();

      expect(result.styles).toHaveLength(1);
      expect(result.styles[0]).toMatchObject({
        name: "Heading/H1",
        type: "TEXT",
        fontFamily: "Inter",
        fontSize: 32,
      });
    });

    it("エフェクトスタイルをスキャンする", async () => {
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
      const result = await scanner.scan();

      expect(result.styles).toHaveLength(1);
      expect(result.styles[0]).toMatchObject({
        name: "Shadow/Medium",
        type: "EFFECT",
      });
    });

    it("コンポーネントをスキャンする", async () => {
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
      const result = await scanner.scan();

      expect(result.components).toHaveLength(1);
      expect(result.components[0]).toMatchObject({
        name: "Button/Primary",
        description: "Primary button component",
      });
      expect(result.components[0].properties).toHaveLength(2);
    });

    it("複数のスタイルとコンポーネントをスキャンする", async () => {
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
      const result = await scanner.scan();

      expect(result.styles).toHaveLength(3);
      expect(result.components).toHaveLength(1);
    });
  });

  describe("scanStyles", () => {
    it("スタイルのみをスキャンする", async () => {
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
      const styles = await scanner.scanStyles();

      expect(styles).toHaveLength(1);
      expect(styles[0].name).toBe("Color/Red");
    });
  });

  describe("scanComponents", () => {
    it("コンポーネントのみをスキャンする", async () => {
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
      const components = await scanner.scanComponents();

      expect(components).toHaveLength(1);
      expect(components[0].name).toBe("Icon/Arrow");
    });
  });

  describe("findStyleByName", () => {
    it("名前でスタイルを検索する", async () => {
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
      const style = scanner.findStyleByName("Primary/Blue");

      expect(style).toBeDefined();
      expect(style?.name).toBe("Primary/Blue");
    });

    it("存在しない名前の場合undefinedを返す", async () => {
      mockFigma.getLocalPaintStyles.mockReturnValue([]);

      const scanner = DesignSystemScanner.create();
      await scanner.scan();
      const style = scanner.findStyleByName("NonExistent");

      expect(style).toBeUndefined();
    });
  });

  describe("findComponentByName", () => {
    it("名前でコンポーネントを検索する", async () => {
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
      const component = scanner.findComponentByName("Button/Primary");

      expect(component).toBeDefined();
      expect(component?.name).toBe("Button/Primary");
    });
  });

  describe("getStylesByType", () => {
    it("タイプでスタイルをフィルタリングする", async () => {
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

      const paintStyles = scanner.getStylesByType("PAINT");
      const textStyles = scanner.getStylesByType("TEXT");

      expect(paintStyles).toHaveLength(1);
      expect(textStyles).toHaveLength(1);
      expect(paintStyles[0].type).toBe("PAINT");
      expect(textStyles[0].type).toBe("TEXT");
    });
  });
});
