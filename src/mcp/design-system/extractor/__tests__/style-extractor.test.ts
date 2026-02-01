import { describe, it, expect } from "vitest";
import { StyleExtractor } from "../style-extractor";
import type {
  PaintStyleInfo,
  TextStyleInfo,
  EffectStyleInfo,
  DesignSystemStyle,
} from "../../types";
import { createDesignSystemStyleId } from "../../types";

describe("StyleExtractor", () => {
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

  describe("extractColorInfo", () => {
    it("should extract color info from solid color", () => {
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

    it("should extract color with opacity", () => {
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

    it("should extract gradient info from gradient paint", () => {
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

    it("should return null for empty paints", () => {
      // Arrange
      const style = createMockPaintStyle({ paints: [] });
      const extractor = StyleExtractor.create();

      // Act
      const colorInfo = extractor.extractColorInfo(style);

      // Assert
      expect(colorInfo).toBeNull();
    });
  });

  describe("extractTypographyInfo", () => {
    it("should extract typography info from text style", () => {
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

    it("should use normal for AUTO lineHeight", () => {
      // Arrange
      const style = createMockTextStyle({ lineHeight: "AUTO" });
      const extractor = StyleExtractor.create();

      // Act
      const typographyInfo = extractor.extractTypographyInfo(style);

      // Assert
      expect(typographyInfo.cssValue).toBe("700 32px/normal Inter");
    });
  });

  describe("extractEffectInfo", () => {
    it("should extract effect info from drop shadow", () => {
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

    it("should extract multiple effects", () => {
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

    it("should skip invisible effects", () => {
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
  });

  describe("categorizeStyles", () => {
    it("should categorize styles by type", () => {
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
  });

  describe("findMatchingStyle", () => {
    it("should find styles by name pattern", () => {
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

    it("should search case-insensitively", () => {
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
  });

  describe("toCssProperties", () => {
    it("should convert paint style to CSS properties", () => {
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

    it("should convert text style to CSS properties", () => {
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

    it("should convert effect style to CSS properties", () => {
      // Arrange
      const style = createMockEffectStyle();
      const extractor = StyleExtractor.create();

      // Act
      const cssProps = extractor.toCssProperties(style);

      // Assert
      expect(cssProps).toHaveProperty("box-shadow");
    });
  });
});
