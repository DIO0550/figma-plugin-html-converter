import { describe, it, expect } from "vitest";
import { createUlElement } from "../ul-element.factory";
import { UlElement } from "../ul-element";

describe("UlElement - Edge Cases", () => {
  describe("malformed input handling", () => {
    it("should handle empty style string", () => {
      const element = createUlElement({
        style: "",
      });

      expect(element.attributes?.style).toBe("");
      expect(UlElement.isUlElement(element)).toBe(true);
    });

    it("should handle style string with only whitespace", () => {
      const element = createUlElement({
        style: "   ",
      });

      expect(element.attributes?.style).toBe("   ");
    });

    it("should handle malformed style strings", () => {
      const element = createUlElement({
        style: "invalid::style;;format;;;",
      });

      expect(element.attributes?.style).toBe("invalid::style;;format;;;");
      // The element should still be valid
      expect(UlElement.isUlElement(element)).toBe(true);
    });

    it("should handle style with missing values", () => {
      const element = createUlElement({
        style: "padding-left:;margin-top:20px;color:",
      });

      expect(element.attributes?.style).toBe(
        "padding-left:;margin-top:20px;color:",
      );
    });

    it("should handle style with duplicate properties", () => {
      const element = createUlElement({
        style: "padding: 10px; padding: 20px; padding: 30px",
      });

      // Should preserve the string as-is
      expect(element.attributes?.style).toBe(
        "padding: 10px; padding: 20px; padding: 30px",
      );
    });
  });

  describe("extreme values", () => {
    it("should handle very long class names", () => {
      const longClassName = "a".repeat(1000);
      const element = createUlElement({
        className: longClassName,
      });

      expect(element.attributes?.className).toBe(longClassName);
    });

    it("should handle very long id", () => {
      const longId = "id-" + "x".repeat(500);
      const element = createUlElement({
        id: longId,
      });

      expect(element.attributes?.id).toBe(longId);
    });

    it("should handle extremely long style string", () => {
      const properties = [];
      for (let i = 0; i < 100; i++) {
        properties.push(`property-${i}: value-${i}`);
      }
      const longStyle = properties.join("; ");

      const element = createUlElement({
        style: longStyle,
      });

      expect(element.attributes?.style).toBe(longStyle);
    });
  });

  describe("special characters", () => {
    it("should handle special characters in className", () => {
      const element = createUlElement({
        className: "class-with-émojis-😀-and-特殊文字",
      });

      expect(element.attributes?.className).toBe(
        "class-with-émojis-😀-and-特殊文字",
      );
    });

    it("should handle special characters in id", () => {
      const element = createUlElement({
        id: "id_with!@#$%^&*()",
      });

      expect(element.attributes?.id).toBe("id_with!@#$%^&*()");
    });

    it("should handle escaped characters in style", () => {
      const element = createUlElement({
        style: "content: '\\\"quoted\\\"'; font-family: \\'Arial\\'",
      });

      expect(element.attributes?.style).toBe(
        "content: '\\\"quoted\\\"'; font-family: \\'Arial\\'",
      );
    });
  });

  describe("null and undefined handling", () => {
    it("should handle undefined attributes gracefully", () => {
      const element = createUlElement({
        id: undefined,
        className: undefined,
        style: undefined,
      });

      expect(element.attributes?.id).toBeUndefined();
      expect(element.attributes?.className).toBeUndefined();
      expect(element.attributes?.style).toBeUndefined();
    });

    it("should handle mixed valid and invalid attributes", () => {
      const element = createUlElement({
        id: "valid-id",
        className: undefined,
        style: "",
        type: "disc",
      });

      expect(element.attributes?.id).toBe("valid-id");
      expect(element.attributes?.className).toBeUndefined();
      expect(element.attributes?.style).toBe("");
      expect(element.attributes?.type).toBe("disc");
    });
  });

  describe("children handling", () => {
    it("should handle empty children array", () => {
      const element = createUlElement({}, []);

      expect(element.children).toEqual([]);
    });

    it("should handle large number of children", () => {
      const children = Array(1000)
        .fill(null)
        .map((_, i) => ({
          type: "element" as const,
          tagName: "li",
          attributes: { id: `item-${i}` },
          children: [],
        }));

      const element = createUlElement({}, children);

      expect(element.children).toHaveLength(1000);
      expect(element.children[0].attributes?.id).toBe("item-0");
      expect(element.children[999].attributes?.id).toBe("item-999");
    });
  });
});
