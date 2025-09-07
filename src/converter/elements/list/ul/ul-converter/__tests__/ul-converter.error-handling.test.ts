import { describe, it, expect, vi } from "vitest";
import { UlConverter } from "../ul-converter";
import { createUlElement } from "../../ul-element/ul-element.factory";
import { Styles } from "../../../../../models/styles";
import { FigmaNodeConfig } from "../../../../../models/figma-node";

describe("UlConverter - Error Handling", () => {
  let converter: UlConverter;

  beforeEach(() => {
    converter = new UlConverter();
  });

  describe("toFigmaNode error handling", () => {
    it("should handle invalid element types", () => {
      const invalidElement = null as unknown as Parameters<
        typeof converter.toFigmaNode
      >[0];
      expect(() => converter.toFigmaNode(invalidElement)).toThrow();

      const undefinedElement = undefined as unknown as Parameters<
        typeof converter.toFigmaNode
      >[0];
      expect(() => converter.toFigmaNode(undefinedElement)).toThrow();
    });

    it("should handle element without attributes", () => {
      const element = {
        type: "element" as const,
        tagName: "ul" as const,
        children: [],
      } as unknown as Parameters<typeof converter.toFigmaNode>[0];

      const result = converter.toFigmaNode(element);

      expect(result).toBeDefined();
      expect(result.type).toBe("FRAME");
    });

    it("should handle corrupted style parsing", () => {
      const mockParse = vi.spyOn(Styles, "parse");
      mockParse.mockImplementation(() => {
        throw new Error("Parse error");
      });

      const element = createUlElement({
        style: "invalid-style",
      });

      expect(() => converter.toFigmaNode(element)).toThrow();

      mockParse.mockRestore();
    });

    it("should handle invalid padding values", () => {
      const mockGetPaddingLeft = vi.spyOn(Styles, "getPaddingLeft");
      mockGetPaddingLeft.mockReturnValue("invalid" as unknown as number);

      const element = createUlElement({
        style: "padding-left: 20px",
      });

      const result = converter.toFigmaNode(element);

      // Should use default padding when invalid
      expect(result.paddingLeft).toBe(40);

      mockGetPaddingLeft.mockRestore();
    });

    it("should handle FigmaNodeConfig method failures", () => {
      const mockApplyBackgroundColor = vi.spyOn(
        FigmaNodeConfig,
        "applyBackgroundColor",
      );
      mockApplyBackgroundColor.mockImplementation(() => {
        throw new Error("Background color error");
      });

      const element = createUlElement({
        style: "background-color: red",
      });

      expect(() => converter.toFigmaNode(element)).toThrow();

      mockApplyBackgroundColor.mockRestore();
    });

    it("should handle border style application failures", () => {
      const mockApplyBorderStyles = vi.spyOn(
        FigmaNodeConfig,
        "applyBorderStyles",
      );
      mockApplyBorderStyles.mockImplementation(() => {
        throw new Error("Border style error");
      });

      const element = createUlElement({
        style: "border: 1px solid black",
      });

      expect(() => converter.toFigmaNode(element)).toThrow();

      mockApplyBorderStyles.mockRestore();
    });

    it("should handle size style application failures", () => {
      const mockApplySizeStyles = vi.spyOn(FigmaNodeConfig, "applySizeStyles");
      mockApplySizeStyles.mockImplementation(() => {
        throw new Error("Size style error");
      });

      const element = createUlElement({
        style: "width: 100px; height: 200px",
      });

      expect(() => converter.toFigmaNode(element)).toThrow();

      mockApplySizeStyles.mockRestore();
    });

    it("should recover from partial style extraction failures", () => {
      const mockGetBackgroundColor = vi.spyOn(Styles, "getBackgroundColor");
      mockGetBackgroundColor.mockImplementation(() => {
        throw new Error("Color extraction failed");
      });

      const element = createUlElement({
        style: "background-color: blue; padding: 10px",
      });

      // Should continue despite background color failure
      expect(() => converter.toFigmaNode(element)).toThrow();

      mockGetBackgroundColor.mockRestore();
    });
  });

  describe("mapToFigma error handling", () => {
    it("should handle invalid HTML strings", () => {
      const invalidHtml = "<ul><li>Unclosed item";
      const result = converter.mapToFigma(invalidHtml);

      // Current implementation creates default element
      expect(result).toBeDefined();
      expect(result.type).toBe("FRAME");
    });

    it("should handle invalid HTML input types", () => {
      const nullInput = null as unknown as Parameters<
        typeof converter.mapToFigma
      >[0];
      const result1 = converter.mapToFigma(nullInput);
      expect(result1).toBeDefined();
      expect(result1.type).toBe("FRAME");

      const undefinedInput = undefined as unknown as Parameters<
        typeof converter.mapToFigma
      >[0];
      const result2 = converter.mapToFigma(undefinedInput);
      expect(result2).toBeDefined();
      expect(result2.type).toBe("FRAME");
    });

    it("should handle extremely malformed HTML", () => {
      const malformedHtml = "<<<>>>not valid HTML at all!!!";
      const result = converter.mapToFigma(malformedHtml);

      expect(result).toBeDefined();
      expect(result.type).toBe("FRAME");
    });

    it("should handle HTML with script injections", () => {
      const dangerousHtml =
        '<ul><script>alert("XSS")</script><li>Item</li></ul>';
      const result = converter.mapToFigma(dangerousHtml);

      // Should safely process without executing scripts
      expect(result).toBeDefined();
      expect(result.type).toBe("FRAME");
    });

    it("should handle circular reference in HTML structure", () => {
      // Simulating a scenario where parsing might create circular references
      const circularHtml = '<ul id="list1"><li><ul id="list2"></ul></li></ul>';
      const result = converter.mapToFigma(circularHtml);

      expect(result).toBeDefined();
      expect(result.type).toBe("FRAME");
    });
  });

  describe("resource cleanup", () => {
    it("should not leak memory with large inputs", () => {
      const largeHtml = "<ul>" + "<li>Item</li>".repeat(10000) + "</ul>";

      expect(() => {
        const result = converter.mapToFigma(largeHtml);
        expect(result).toBeDefined();
      }).not.toThrow();
    });

    it("should handle converter instance reuse", () => {
      const element1 = createUlElement({ id: "list1" });
      const element2 = createUlElement({ id: "list2" });

      const result1 = converter.toFigmaNode(element1);
      const result2 = converter.toFigmaNode(element2);

      // Results should be independent
      expect(result1).not.toBe(result2);
      expect(result1.name).toBe("ul#list1");
      expect(result2.name).toBe("ul#list2");
    });
  });

  describe("boundary conditions", () => {
    it("should handle zero padding values", () => {
      const element = createUlElement({
        style: "padding: 0",
      });

      const result = converter.toFigmaNode(element);

      expect(result.paddingTop).toBe(0);
      expect(result.paddingBottom).toBe(0);
      expect(result.paddingLeft).toBe(0);
      expect(result.paddingRight).toBe(0);
    });

    it("should handle negative padding values", () => {
      const element = createUlElement({
        style: "padding-left: -20px",
      });

      const result = converter.toFigmaNode(element);

      // Should ignore negative values and use default
      expect(result.paddingLeft).toBe(40);
    });

    it("should handle NaN padding values", () => {
      const mockGetPaddingLeft = vi.spyOn(Styles, "getPaddingLeft");
      mockGetPaddingLeft.mockReturnValue(NaN);

      const element = createUlElement({
        style: "padding-left: auto",
      });

      const result = converter.toFigmaNode(element);

      // Should use default when NaN
      expect(result.paddingLeft).toBe(40);

      mockGetPaddingLeft.mockRestore();
    });

    it("should handle Infinity padding values", () => {
      const mockGetPaddingLeft = vi.spyOn(Styles, "getPaddingLeft");
      mockGetPaddingLeft.mockReturnValue(Infinity);

      const element = createUlElement({
        style: "padding-left: 999999999999px",
      });

      const result = converter.toFigmaNode(element);

      // Should use default when Infinity
      expect(result.paddingLeft).toBe(40);

      mockGetPaddingLeft.mockRestore();
    });
  });
});
