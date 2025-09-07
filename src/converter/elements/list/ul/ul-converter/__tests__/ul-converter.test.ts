import { describe, it, expect, beforeEach } from "vitest";
import { UlConverter } from "../ul-converter";
import { createUlElement } from "../../ul-element/ul-element.factory";

describe("UlConverter", () => {
  let converter: UlConverter;

  beforeEach(() => {
    converter = new UlConverter();
  });

  describe("toFigmaNode", () => {
    it("should convert ul element to Figma frame node", () => {
      const element = createUlElement();
      const node = converter.toFigmaNode(element);

      expect(node.type).toBe("FRAME");
      expect(node.name).toBe("ul");
      expect(node.layoutMode).toBe("VERTICAL");
      expect(node.layoutSizingHorizontal).toBe("HUG");
      expect(node.layoutSizingVertical).toBe("HUG");
    });

    it("should apply default padding for list", () => {
      const element = createUlElement();
      const node = converter.toFigmaNode(element);

      expect(node.paddingLeft).toBe(40); // Default list padding
      expect(node.paddingTop).toBe(16);
      expect(node.paddingBottom).toBe(16);
    });

    it("should apply custom styles", () => {
      const element = createUlElement({
        style: "padding-left: 60px; margin-top: 20px",
      });
      const node = converter.toFigmaNode(element);

      expect(node.paddingLeft).toBe(60);
    });

    it("should set item spacing", () => {
      const element = createUlElement();
      const node = converter.toFigmaNode(element);

      expect(node.itemSpacing).toBe(8); // Default spacing between list items
    });
  });

  describe("mapToFigma", () => {
    it("should map HTML string to Figma node", () => {
      const html = '<ul class="my-list"><li>Item 1</li><li>Item 2</li></ul>';
      const result = converter.mapToFigma(html);

      expect(result.type).toBe("FRAME");
      expect(result.name).toBe("ul");
      expect(result.layoutMode).toBe("VERTICAL");
    });

    it("should handle nested lists", () => {
      const html = `
        <ul>
          <li>Item 1</li>
          <li>
            Item 2
            <ul>
              <li>Nested 1</li>
              <li>Nested 2</li>
            </ul>
          </li>
        </ul>
      `;
      const result = converter.mapToFigma(html);

      expect(result.type).toBe("FRAME");
      expect(result.name).toBe("ul");
    });

    it("should handle empty list", () => {
      const html = "<ul></ul>";
      const result = converter.mapToFigma(html);

      expect(result.type).toBe("FRAME");
      expect(result.children).toEqual([]);
    });
  });
});
