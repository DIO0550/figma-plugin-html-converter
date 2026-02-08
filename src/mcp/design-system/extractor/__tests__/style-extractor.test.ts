import { test, expect } from "vitest";
import { StyleExtractor } from "../style-extractor";
import type {
  PaintStyleInfo,
  TextStyleInfo,
  EffectStyleInfo,
  DesignSystemStyle,
} from "../../types";
import { createDesignSystemStyleId } from "../../types";

const createMockPaintStyle = (
  overrides: Partial<PaintStyleInfo> = {},
): PaintStyleInfo => ({
  id: createDesignSystemStyleId("S:paint1"),
  name: "Primary/Blue",
  type: "PAINT",
  key: "paint-key-1",
  paints: [{ type: "SOLID", color: { r: 0, g: 0.4, b: 1 }, opacity: 1 }],
  ...overrides,
});

const createMockTextStyle = (
  overrides: Partial<TextStyleInfo> = {},
): TextStyleInfo => ({
  id: createDesignSystemStyleId("S:text1"),
  name: "Heading/H1",
  type: "TEXT",
  key: "text-key-1",
  fontFamily: "Inter",
  fontSize: 32,
  fontWeight: 700,
  lineHeight: 40,
  letterSpacing: 0,
  ...overrides,
});

const createMockEffectStyle = (
  overrides: Partial<EffectStyleInfo> = {},
): EffectStyleInfo => ({
  id: createDesignSystemStyleId("S:effect1"),
  name: "Shadow/Medium",
  type: "EFFECT",
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
  ...overrides,
});

test("StyleExtractor.extractColorInfo - ソリッドカラーのペイントスタイル - カラー情報を抽出できる", () => {
  // Arrange
  const style = createMockPaintStyle({
    paints: [{ type: "SOLID", color: { r: 1, g: 0, b: 0 }, opacity: 1 }],
  });
  const extractor = StyleExtractor.create();

  // Act
  const colorInfo = extractor.extractColorInfo(style);

  // Assert
  expect(colorInfo).toEqual({
    type: "solid",
    hex: "#ff0000",
    rgb: { r: 255, g: 0, b: 0 },
    opacity: 1,
  });
});

test("StyleExtractor.extractColorInfo - 透明度付きカラー - 透明度を含むカラー情報を抽出できる", () => {
  // Arrange
  const style = createMockPaintStyle({
    paints: [{ type: "SOLID", color: { r: 0, g: 0, b: 1 }, opacity: 0.5 }],
  });
  const extractor = StyleExtractor.create();

  // Act
  const colorInfo = extractor.extractColorInfo(style);

  // Assert
  expect(colorInfo?.opacity).toBe(0.5);
});

test("StyleExtractor.extractColorInfo - グラデーションペイント - グラデーション情報を抽出できる", () => {
  // Arrange
  const style = createMockPaintStyle({
    paints: [
      {
        type: "GRADIENT_LINEAR",
        gradientStops: [
          { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
          { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } },
        ],
        gradientTransform: [
          [1, 0, 0],
          [0, 1, 0],
        ],
      },
    ],
  });
  const extractor = StyleExtractor.create();

  // Act
  const colorInfo = extractor.extractColorInfo(style);

  // Assert
  expect(colorInfo?.type).toBe("gradient");
});

test("StyleExtractor.extractColorInfo - 空のペイント配列 - nullを返す", () => {
  // Arrange
  const style = createMockPaintStyle({ paints: [] });
  const extractor = StyleExtractor.create();

  // Act
  const colorInfo = extractor.extractColorInfo(style);

  // Assert
  expect(colorInfo).toBeNull();
});

test("StyleExtractor.extractTypographyInfo - テキストスタイル - タイポグラフィ情報を抽出できる", () => {
  // Arrange
  const style = createMockTextStyle();
  const extractor = StyleExtractor.create();

  // Act
  const typographyInfo = extractor.extractTypographyInfo(style);

  // Assert
  expect(typographyInfo).toEqual({
    fontFamily: "Inter",
    fontSize: 32,
    fontWeight: 700,
    lineHeight: 40,
    letterSpacing: 0,
    cssValue: "700 32px/40px Inter",
  });
});

test("StyleExtractor.extractTypographyInfo - AUTO行高さ - normalとして出力する", () => {
  // Arrange
  const style = createMockTextStyle({ lineHeight: "AUTO" });
  const extractor = StyleExtractor.create();

  // Act
  const typographyInfo = extractor.extractTypographyInfo(style);

  // Assert
  expect(typographyInfo.cssValue).toBe("700 32px/normal Inter");
});

test("StyleExtractor.extractEffectInfo - ドロップシャドウエフェクト - エフェクト情報を抽出できる", () => {
  // Arrange
  const style = createMockEffectStyle();
  const extractor = StyleExtractor.create();

  // Act
  const effectInfo = extractor.extractEffectInfo(style);

  // Assert
  expect(effectInfo).toHaveLength(1);
  expect(effectInfo[0]).toMatchObject({
    type: "drop-shadow",
    offsetX: 0,
    offsetY: 4,
    blurRadius: 8,
  });
});

test("StyleExtractor.extractEffectInfo - 複数のエフェクト - すべてのエフェクト情報を抽出できる", () => {
  // Arrange
  const style = createMockEffectStyle({
    effects: [
      {
        type: "DROP_SHADOW",
        color: { r: 0, g: 0, b: 0, a: 0.1 },
        offset: { x: 0, y: 2 },
        radius: 4,
        spread: 0,
        visible: true,
        blendMode: "NORMAL",
      },
      {
        type: "DROP_SHADOW",
        color: { r: 0, g: 0, b: 0, a: 0.2 },
        offset: { x: 0, y: 8 },
        radius: 16,
        spread: 0,
        visible: true,
        blendMode: "NORMAL",
      },
    ],
  });
  const extractor = StyleExtractor.create();

  // Act
  const effectInfo = extractor.extractEffectInfo(style);

  // Assert
  expect(effectInfo).toHaveLength(2);
});

test("StyleExtractor.extractEffectInfo - 非表示のエフェクト - 非表示エフェクトをスキップする", () => {
  // Arrange
  const style = createMockEffectStyle({
    effects: [
      {
        type: "DROP_SHADOW",
        color: { r: 0, g: 0, b: 0, a: 0.1 },
        offset: { x: 0, y: 2 },
        radius: 4,
        spread: 0,
        visible: false,
        blendMode: "NORMAL",
      },
    ],
  });
  const extractor = StyleExtractor.create();

  // Act
  const effectInfo = extractor.extractEffectInfo(style);

  // Assert
  expect(effectInfo).toHaveLength(0);
});

test("StyleExtractor.categorizeStyles - 複数タイプのスタイル - タイプ別に分類できる", () => {
  // Arrange
  const styles: DesignSystemStyle[] = [
    createMockPaintStyle({ name: "Colors/Primary" }),
    createMockPaintStyle({
      id: createDesignSystemStyleId("S:paint2"),
      name: "Colors/Secondary",
    }),
    createMockTextStyle({ name: "Typography/Heading" }),
    createMockEffectStyle({ name: "Effects/Shadow" }),
  ];
  const extractor = StyleExtractor.create();

  // Act
  const categorized = extractor.categorizeStyles(styles);

  // Assert
  expect(categorized.paint).toHaveLength(2);
  expect(categorized.text).toHaveLength(1);
  expect(categorized.effect).toHaveLength(1);
  expect(categorized.grid).toHaveLength(0);
});

test("StyleExtractor.findMatchingStyles - 名前パターンでの検索 - マッチするスタイルを見つけられる", () => {
  // Arrange
  const styles: DesignSystemStyle[] = [
    createMockPaintStyle({ name: "Colors/Primary/Blue" }),
    createMockPaintStyle({
      id: createDesignSystemStyleId("S:paint2"),
      name: "Colors/Primary/Red",
    }),
    createMockPaintStyle({
      id: createDesignSystemStyleId("S:paint3"),
      name: "Colors/Secondary/Gray",
    }),
  ];
  const extractor = StyleExtractor.create();

  // Act
  const matches = extractor.findMatchingStyles(styles, "Primary");

  // Assert
  expect(matches).toHaveLength(2);
  expect(matches.every((s) => s.name.includes("Primary"))).toBe(true);
});

test("StyleExtractor.findMatchingStyles - 大文字小文字を区別しない検索 - 大文字小文字に関わらず検索できる", () => {
  // Arrange
  const styles: DesignSystemStyle[] = [
    createMockPaintStyle({ name: "Colors/PRIMARY/Blue" }),
  ];
  const extractor = StyleExtractor.create();

  // Act
  const matches = extractor.findMatchingStyles(styles, "primary");

  // Assert
  expect(matches).toHaveLength(1);
});

test("StyleExtractor.toCssProperties - ペイントスタイル - CSSプロパティに変換できる", () => {
  // Arrange
  const style = createMockPaintStyle({
    paints: [{ type: "SOLID", color: { r: 1, g: 0, b: 0 }, opacity: 1 }],
  });
  const extractor = StyleExtractor.create();

  // Act
  const cssProps = extractor.toCssProperties(style);

  // Assert
  expect(cssProps).toHaveProperty("background-color");
  expect(cssProps["background-color"]).toBe("#ff0000");
});

test("StyleExtractor.toCssProperties - テキストスタイル - CSSプロパティに変換できる", () => {
  // Arrange
  const style = createMockTextStyle();
  const extractor = StyleExtractor.create();

  // Act
  const cssProps = extractor.toCssProperties(style);

  // Assert
  expect(cssProps).toHaveProperty("font-family");
  expect(cssProps).toHaveProperty("font-size");
  expect(cssProps).toHaveProperty("font-weight");
  expect(cssProps["font-family"]).toBe("Inter");
  expect(cssProps["font-size"]).toBe("32px");
});

test("StyleExtractor.toCssProperties - エフェクトスタイル - CSSプロパティに変換できる", () => {
  // Arrange
  const style = createMockEffectStyle();
  const extractor = StyleExtractor.create();

  // Act
  const cssProps = extractor.toCssProperties(style);

  // Assert
  expect(cssProps).toHaveProperty("box-shadow");
});
