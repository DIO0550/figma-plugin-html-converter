import { describe, it, expect } from "vitest";
import { HeaderElement } from "../header-element";
import type { HeaderElement as HeaderElementType } from "../header-element";

describe("HeaderElement.toFigmaNode", () => {
  it("should create basic header Figma node", () => {
    const element: HeaderElementType = {
      type: "element",
      tagName: "header",
      attributes: {},
    };

    const figmaNode = HeaderElement.toFigmaNode(element);

    expect(figmaNode).toEqual({
      type: "FRAME",
      name: "header",
      layoutMode: "HORIZONTAL",
      layoutSizingVertical: "HUG",
      layoutSizingHorizontal: "FIXED",
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      itemSpacing: 0,
    });
  });

  it("should include id in name", () => {
    const element: HeaderElementType = {
      type: "element",
      tagName: "header",
      attributes: { id: "page-header" },
    };

    const figmaNode = HeaderElement.toFigmaNode(element);

    expect(figmaNode.name).toBe("header#page-header");
  });

  it("should include className in name", () => {
    const element: HeaderElementType = {
      type: "element",
      tagName: "header",
      attributes: { className: "site-header sticky" },
    };

    const figmaNode = HeaderElement.toFigmaNode(element);

    expect(figmaNode.name).toBe("header.site-header.sticky");
  });

  it("should include both id and className in name", () => {
    const element: HeaderElementType = {
      type: "element",
      tagName: "header",
      attributes: {
        id: "main-header",
        className: "header primary",
      },
    };

    const figmaNode = HeaderElement.toFigmaNode(element);

    expect(figmaNode.name).toBe("header#main-header.header.primary");
  });

  describe("Flexbox styles", () => {
    it("should handle display: flex with row direction", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style: "display: flex; flex-direction: row;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.layoutMode).toBe("HORIZONTAL");
    });

    it("should handle display: flex with column direction", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style: "display: flex; flex-direction: column;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.layoutMode).toBe("VERTICAL");
    });

    it("should handle justify-content", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style: "display: flex; justify-content: space-between;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.primaryAxisAlignItems).toBe("SPACE_BETWEEN");
    });

    it("should handle align-items", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style: "display: flex; align-items: center;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.counterAxisAlignItems).toBe("CENTER");
    });
  });

  describe("Padding styles", () => {
    it("should handle uniform padding", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style: "padding: 20px;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.paddingTop).toBe(20);
      expect(figmaNode.paddingRight).toBe(20);
      expect(figmaNode.paddingBottom).toBe(20);
      expect(figmaNode.paddingLeft).toBe(20);
    });

    it("should handle individual padding values", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style:
            "padding-top: 10px; padding-right: 20px; padding-bottom: 30px; padding-left: 40px;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.paddingTop).toBe(10);
      expect(figmaNode.paddingRight).toBe(20);
      expect(figmaNode.paddingBottom).toBe(30);
      expect(figmaNode.paddingLeft).toBe(40);
    });
  });

  describe("Gap styles", () => {
    it("should handle gap property", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style: "gap: 16px;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.itemSpacing).toBe(16);
    });
  });

  describe("Background color", () => {
    it("should handle hex background color", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style: "background-color: #ff0000;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.fills).toEqual([
        {
          type: "SOLID",
          color: { r: 1, g: 0, b: 0 },
          opacity: 1,
        },
      ]);
    });

    it("should handle short hex color", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style: "background-color: #f00;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.fills).toEqual([
        {
          type: "SOLID",
          color: { r: 1, g: 0, b: 0 },
          opacity: 1,
        },
      ]);
    });

    it("should handle named colors", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style: "background-color: black;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.fills).toEqual([
        {
          type: "SOLID",
          color: { r: 0, g: 0, b: 0 },
          opacity: 1,
        },
      ]);
    });
  });

  describe("Size styles", () => {
    it("should handle width", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style: "width: 500px;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.width).toBe(500);
      expect(figmaNode.layoutSizingHorizontal).toBe("FIXED");
    });

    it("should handle height", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style: "height: 100px;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.height).toBe(100);
      expect(figmaNode.layoutSizingVertical).toBe("FIXED");
    });

    it("should handle min/max dimensions", () => {
      const element: HeaderElementType = {
        type: "element",
        tagName: "header",
        attributes: {
          style:
            "min-width: 200px; max-width: 800px; min-height: 60px; max-height: 150px;",
        },
      };

      const figmaNode = HeaderElement.toFigmaNode(element);

      expect(figmaNode.minWidth).toBe(200);
      expect(figmaNode.maxWidth).toBe(800);
      expect(figmaNode.minHeight).toBe(60);
      expect(figmaNode.maxHeight).toBe(150);
    });
  });

  it("should handle complex combination of styles", () => {
    const element: HeaderElementType = {
      type: "element",
      tagName: "header",
      attributes: {
        id: "site-header",
        className: "header sticky",
        style:
          "display: flex; justify-content: space-between; align-items: center; background-color: #333333; padding: 20px; gap: 16px; height: 80px;",
      },
    };

    const figmaNode = HeaderElement.toFigmaNode(element);

    expect(figmaNode).toMatchObject({
      type: "FRAME",
      name: "header#site-header.header.sticky",
      layoutMode: "HORIZONTAL",
      primaryAxisAlignItems: "SPACE_BETWEEN",
      counterAxisAlignItems: "CENTER",
      paddingTop: 20,
      paddingRight: 20,
      paddingBottom: 20,
      paddingLeft: 20,
      itemSpacing: 16,
      height: 80,
      layoutSizingVertical: "FIXED",
      fills: [
        {
          type: "SOLID",
          color: { r: 0.2, g: 0.2, b: 0.2 },
          opacity: 1,
        },
      ],
    });
  });
});
