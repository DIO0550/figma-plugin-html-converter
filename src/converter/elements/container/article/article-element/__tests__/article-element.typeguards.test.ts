import { describe, it, expect } from "vitest";
import { ArticleElement } from "../article-element";
import type { ArticleElement as ArticleElementType } from "../article-element";

describe("ArticleElement - Type Guards", () => {
  describe("isArticleElement", () => {
    it("should return true for valid article element", () => {
      const element: ArticleElementType = {
        type: "element",
        tagName: "article",
        attributes: {},
        children: [],
      };

      expect(ArticleElement.isArticleElement(element)).toBe(true);
    });

    it("should return true for article element with attributes", () => {
      const element: ArticleElementType = {
        type: "element",
        tagName: "article",
        attributes: {
          id: "main-article",
          className: "content",
          style: "padding: 20px;",
        },
        children: [],
      };

      expect(ArticleElement.isArticleElement(element)).toBe(true);
    });

    it("should return true for article element with children", () => {
      const element: ArticleElementType = {
        type: "element",
        tagName: "article",
        attributes: {},
        children: [
          {
            type: "text",
            content: "Article content",
          },
        ],
      };

      expect(ArticleElement.isArticleElement(element)).toBe(true);
    });

    it("should return false for null", () => {
      expect(ArticleElement.isArticleElement(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(ArticleElement.isArticleElement(undefined)).toBe(false);
    });

    it("should return false for non-object", () => {
      expect(ArticleElement.isArticleElement("article")).toBe(false);
      expect(ArticleElement.isArticleElement(123)).toBe(false);
      expect(ArticleElement.isArticleElement(true)).toBe(false);
    });

    it("should return false for object with wrong type", () => {
      const element = {
        type: "text",
        tagName: "article",
        attributes: {},
        children: [],
      };

      expect(ArticleElement.isArticleElement(element)).toBe(false);
    });

    it("should return false for element with different tagName", () => {
      const element = {
        type: "element",
        tagName: "div",
        attributes: {},
        children: [],
      };

      expect(ArticleElement.isArticleElement(element)).toBe(false);
    });

    it("should return false for element without tagName", () => {
      const element = {
        type: "element",
        attributes: {},
        children: [],
      };

      expect(ArticleElement.isArticleElement(element)).toBe(false);
    });

    it("should return false for element without type", () => {
      const element = {
        tagName: "article",
        attributes: {},
        children: [],
      };

      expect(ArticleElement.isArticleElement(element)).toBe(false);
    });

    it("should handle element with nested structure", () => {
      const element: ArticleElementType = {
        type: "element",
        tagName: "article",
        attributes: { className: "blog-post" },
        children: [
          {
            type: "element",
            tagName: "h1",
            attributes: {},
            children: [{ type: "text", content: "Title" }],
          },
          {
            type: "element",
            tagName: "p",
            attributes: {},
            children: [{ type: "text", content: "Content" }],
          },
        ],
      };

      expect(ArticleElement.isArticleElement(element)).toBe(true);
    });
  });
});
