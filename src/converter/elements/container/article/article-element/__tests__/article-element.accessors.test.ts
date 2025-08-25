import { describe, it, expect } from "vitest";
import { ArticleElement } from "../article-element";
import type { ArticleElement as ArticleElementType } from "../article-element";

describe("ArticleElement - Accessors", () => {
  describe("getId", () => {
    it("should return id when present", () => {
      const element: ArticleElementType = {
        type: "element",
        tagName: "article",
        attributes: { id: "article-123" },
        children: [],
      };

      expect(ArticleElement.getId(element)).toBe("article-123");
    });

    it("should return undefined when id is not present", () => {
      const element: ArticleElementType = {
        type: "element",
        tagName: "article",
        attributes: {},
        children: [],
      };

      expect(ArticleElement.getId(element)).toBeUndefined();
    });
  });

  describe("getClassName", () => {
    it("should return className when present", () => {
      const element: ArticleElementType = {
        type: "element",
        tagName: "article",
        attributes: { className: "blog-post featured" },
        children: [],
      };

      expect(ArticleElement.getClassName(element)).toBe("blog-post featured");
    });

    it("should return undefined when className is not present", () => {
      const element: ArticleElementType = {
        type: "element",
        tagName: "article",
        attributes: {},
        children: [],
      };

      expect(ArticleElement.getClassName(element)).toBeUndefined();
    });
  });

  describe("getStyle", () => {
    it("should return style when present", () => {
      const element: ArticleElementType = {
        type: "element",
        tagName: "article",
        attributes: { style: "padding: 20px; margin: 10px;" },
        children: [],
      };

      expect(ArticleElement.getStyle(element)).toBe(
        "padding: 20px; margin: 10px;",
      );
    });

    it("should return undefined when style is not present", () => {
      const element: ArticleElementType = {
        type: "element",
        tagName: "article",
        attributes: {},
        children: [],
      };

      expect(ArticleElement.getStyle(element)).toBeUndefined();
    });
  });

  describe("getAttribute", () => {
    it("should return specific attribute value", () => {
      const element: ArticleElementType = {
        type: "element",
        tagName: "article",
        attributes: {
          "data-article-id": "12345",
          "aria-label": "メイン記事",
          role: "article",
        },
        children: [],
      };

      expect(ArticleElement.getAttribute(element, "data-article-id")).toBe(
        "12345",
      );
      expect(ArticleElement.getAttribute(element, "aria-label")).toBe(
        "メイン記事",
      );
      expect(ArticleElement.getAttribute(element, "role")).toBe("article");
    });

    it("should return undefined for non-existent attribute", () => {
      const element: ArticleElementType = {
        type: "element",
        tagName: "article",
        attributes: { id: "test" },
        children: [],
      };

      expect(
        ArticleElement.getAttribute(element, "data-missing"),
      ).toBeUndefined();
    });

    it("should handle boolean attributes", () => {
      const element: ArticleElementType = {
        type: "element",
        tagName: "article",
        attributes: {
          hidden: true,
          contentEditable: "true",
        },
        children: [],
      };

      expect(ArticleElement.getAttribute(element, "hidden")).toBe(true);
      expect(ArticleElement.getAttribute(element, "contentEditable")).toBe(
        "true",
      );
    });

    it("should handle numeric attributes", () => {
      const element: ArticleElementType = {
        type: "element",
        tagName: "article",
        attributes: {
          tabIndex: 0,
        },
        children: [],
      };

      expect(ArticleElement.getAttribute(element, "tabIndex")).toBe(0);
    });
  });

  describe("getChildren", () => {
    it("should return children array", () => {
      const children = [
        { type: "text" as const, content: "Text content" },
        {
          type: "element" as const,
          tagName: "p",
          attributes: {},
          children: [],
        },
      ];

      const element: ArticleElementType = {
        type: "element",
        tagName: "article",
        attributes: {},
        children,
      };

      expect(ArticleElement.getChildren(element)).toBe(children);
    });

    it("should return empty array when no children", () => {
      const element: ArticleElementType = {
        type: "element",
        tagName: "article",
        attributes: {},
        children: [],
      };

      expect(ArticleElement.getChildren(element)).toEqual([]);
    });

    it("should return undefined when children is undefined", () => {
      const element: ArticleElementType = {
        type: "element",
        tagName: "article",
        attributes: {},
      };

      expect(ArticleElement.getChildren(element)).toBeUndefined();
    });
  });

  describe("hasAttribute", () => {
    it("should return true when attribute exists", () => {
      const element: ArticleElementType = {
        type: "element",
        tagName: "article",
        attributes: {
          id: "test",
          className: "article",
          "data-custom": "value",
        },
        children: [],
      };

      expect(ArticleElement.hasAttribute(element, "id")).toBe(true);
      expect(ArticleElement.hasAttribute(element, "className")).toBe(true);
      expect(ArticleElement.hasAttribute(element, "data-custom")).toBe(true);
    });

    it("should return false when attribute does not exist", () => {
      const element: ArticleElementType = {
        type: "element",
        tagName: "article",
        attributes: { id: "test" },
        children: [],
      };

      expect(ArticleElement.hasAttribute(element, "className")).toBe(false);
      expect(ArticleElement.hasAttribute(element, "style")).toBe(false);
    });

    it("should return false for empty attributes", () => {
      const element: ArticleElementType = {
        type: "element",
        tagName: "article",
        attributes: {},
        children: [],
      };

      expect(ArticleElement.hasAttribute(element, "id")).toBe(false);
    });
  });
});
