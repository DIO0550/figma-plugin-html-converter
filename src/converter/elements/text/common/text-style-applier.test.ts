import { describe, it, expect } from "vitest";
import { applyTextStyles } from "./text-style-applier";
import type { TextStyle } from "../../../models/figma-node";

describe("applyTextStyles", () => {
  const createBaseStyle = (): TextStyle => ({
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: 400,
    lineHeight: {
      unit: "PIXELS",
      value: 24,
    },
    letterSpacing: 0,
    textAlign: "LEFT",
    verticalAlign: "TOP",
  });

  describe("font-size", () => {
    it("should apply font-size from styles", () => {
      const baseStyle = createBaseStyle();
      const styles = { "font-size": "18px" };

      const result = applyTextStyles(baseStyle, styles);

      expect(result.fontSize).toBe(18);
    });

    it("should keep original fontSize if not specified", () => {
      const baseStyle = createBaseStyle();
      const styles = {};

      const result = applyTextStyles(baseStyle, styles);

      expect(result.fontSize).toBe(16);
    });
  });

  describe("font-weight", () => {
    it("should apply font-weight from styles", () => {
      const baseStyle = createBaseStyle();
      const styles = { "font-weight": "700" };

      const result = applyTextStyles(baseStyle, styles);

      expect(result.fontWeight).toBe(700);
    });

    it("should keep original fontWeight if not specified", () => {
      const baseStyle = createBaseStyle();
      const styles = {};

      const result = applyTextStyles(baseStyle, styles);

      expect(result.fontWeight).toBe(400);
    });
  });

  describe("font-style", () => {
    it("should apply font-style italic from styles", () => {
      const baseStyle = createBaseStyle();
      const styles = { "font-style": "italic" };

      const result = applyTextStyles(baseStyle, styles);

      expect(result.fontStyle).toBe("italic");
    });

    it("should not modify fontStyle if not specified", () => {
      const baseStyle = createBaseStyle();
      const styles = {};

      const result = applyTextStyles(baseStyle, styles);

      expect(result.fontStyle).toBeUndefined();
    });
  });

  describe("font-family", () => {
    it("should apply font-family from styles", () => {
      const baseStyle = createBaseStyle();
      const styles = { "font-family": "Arial" };

      const result = applyTextStyles(baseStyle, styles);

      expect(result.fontFamily).toBe("Arial");
    });

    it("should keep original fontFamily if not specified", () => {
      const baseStyle = createBaseStyle();
      const styles = {};

      const result = applyTextStyles(baseStyle, styles);

      expect(result.fontFamily).toBe("Inter");
    });
  });

  describe("color", () => {
    it("should apply color from RGB styles", () => {
      const baseStyle = createBaseStyle();
      const styles = { color: "rgb(255, 0, 0)" };

      const result = applyTextStyles(baseStyle, styles);

      expect(result.fills).toBeDefined();
      expect(result.fills?.[0].color.r).toBe(1);
      expect(result.fills?.[0].color.g).toBe(0);
      expect(result.fills?.[0].color.b).toBe(0);
    });

    it("should apply color from hex styles", () => {
      const baseStyle = createBaseStyle();
      const styles = { color: "#0000FF" };

      const result = applyTextStyles(baseStyle, styles);

      expect(result.fills).toBeDefined();
      expect(result.fills?.[0].color.r).toBe(0);
      expect(result.fills?.[0].color.g).toBe(0);
      expect(result.fills?.[0].color.b).toBe(1);
    });

    it("should not modify fills if color not specified", () => {
      const baseStyle = createBaseStyle();
      const styles = {};

      const result = applyTextStyles(baseStyle, styles);

      expect(result.fills).toBeUndefined();
    });
  });

  describe("text-decoration", () => {
    it("should apply underline text-decoration", () => {
      const baseStyle = createBaseStyle();
      const styles = { "text-decoration": "underline" };

      const result = applyTextStyles(baseStyle, styles);

      expect(result.textDecoration).toBe("UNDERLINE");
    });

    it("should apply line-through text-decoration", () => {
      const baseStyle = createBaseStyle();
      const styles = { "text-decoration": "line-through" };

      const result = applyTextStyles(baseStyle, styles);

      expect(result.textDecoration).toBe("STRIKETHROUGH");
    });

    it("should remove text-decoration if set to none", () => {
      const baseStyle: TextStyle = {
        ...createBaseStyle(),
        textDecoration: "UNDERLINE",
      };
      const styles = { "text-decoration": "none" };

      const result = applyTextStyles(baseStyle, styles);

      expect(result.textDecoration).toBeUndefined();
    });

    it("should not modify textDecoration if not specified", () => {
      const baseStyle = createBaseStyle();
      const styles = {};

      const result = applyTextStyles(baseStyle, styles);

      expect(result.textDecoration).toBeUndefined();
    });
  });

  describe("multiple properties", () => {
    it("should apply multiple style properties", () => {
      const baseStyle = createBaseStyle();
      const styles = {
        "font-size": "20px",
        "font-weight": "600",
        color: "rgb(0, 255, 0)",
        "text-decoration": "underline",
      };

      const result = applyTextStyles(baseStyle, styles);

      expect(result.fontSize).toBe(20);
      expect(result.fontWeight).toBe(600);
      expect(result.fills?.[0].color.g).toBe(1);
      expect(result.textDecoration).toBe("UNDERLINE");
    });

    it("should preserve base style properties not in styles", () => {
      const baseStyle = createBaseStyle();
      const styles = { "font-size": "18px" };

      const result = applyTextStyles(baseStyle, styles);

      expect(result.fontFamily).toBe("Inter");
      expect(result.fontWeight).toBe(400);
      expect(result.lineHeight).toEqual({
        unit: "PIXELS",
        value: 24,
      });
    });
  });
});
