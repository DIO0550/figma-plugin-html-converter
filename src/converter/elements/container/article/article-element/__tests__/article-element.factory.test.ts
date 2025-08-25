import { describe, it, expect } from "vitest";
import { ArticleElement } from "../article-element";

describe("ArticleElement - Factory", () => {
  describe("create", () => {
    it("should create article element with no attributes", () => {
      const element = ArticleElement.create();

      expect(element).toEqual({
        type: "element",
        tagName: "article",
        attributes: {},
        children: [],
      });
    });

    it("should create article element with attributes", () => {
      const element = ArticleElement.create({
        id: "main-article",
        className: "blog-post featured",
        style: "margin: 20px; padding: 15px;",
      });

      expect(element).toEqual({
        type: "element",
        tagName: "article",
        attributes: {
          id: "main-article",
          className: "blog-post featured",
          style: "margin: 20px; padding: 15px;",
        },
        children: [],
      });
    });

    it("should create article element with children", () => {
      const children = [
        { type: "text" as const, content: "Article content" },
        {
          type: "element" as const,
          tagName: "p",
          attributes: {},
          children: [],
        },
      ];

      const element = ArticleElement.create({}, children);

      expect(element).toEqual({
        type: "element",
        tagName: "article",
        attributes: {},
        children,
      });
    });

    it("should create article element with both attributes and children", () => {
      const attributes = {
        id: "article-1",
        className: "content",
        role: "article",
      };

      const children = [
        {
          type: "element" as const,
          tagName: "h2",
          attributes: {},
          children: [{ type: "text" as const, content: "Heading" }],
        },
      ];

      const element = ArticleElement.create(attributes, children);

      expect(element).toEqual({
        type: "element",
        tagName: "article",
        attributes,
        children,
      });
    });

    it("should handle empty attributes object", () => {
      const element = ArticleElement.create({});

      expect(element.attributes).toEqual({});
    });

    it("should handle empty children array", () => {
      const element = ArticleElement.create({}, []);

      expect(element.children).toEqual([]);
    });

    it("should create article with ARIA attributes", () => {
      const element = ArticleElement.create({
        "aria-label": "主要記事",
        "aria-labelledby": "article-title",
        "aria-describedby": "article-summary",
      });

      expect(element.attributes).toEqual({
        "aria-label": "主要記事",
        "aria-labelledby": "article-title",
        "aria-describedby": "article-summary",
      });
    });

    it("should create article with data attributes", () => {
      const element = ArticleElement.create({
        "data-article-id": "12345",
        "data-author": "Jane Doe",
        "data-category": "technology",
      });

      expect(element.attributes).toEqual({
        "data-article-id": "12345",
        "data-author": "Jane Doe",
        "data-category": "technology",
      });
    });

    it("should create article with global attributes", () => {
      const element = ArticleElement.create({
        id: "article",
        className: "content",
        title: "Article Title",
        lang: "ja",
        dir: "ltr",
        hidden: false,
        tabIndex: 0,
      });

      expect(element.attributes).toHaveProperty("id", "article");
      expect(element.attributes).toHaveProperty("className", "content");
      expect(element.attributes).toHaveProperty("title", "Article Title");
      expect(element.attributes).toHaveProperty("lang", "ja");
      expect(element.attributes).toHaveProperty("dir", "ltr");
      expect(element.attributes).toHaveProperty("hidden", false);
      expect(element.attributes).toHaveProperty("tabIndex", 0);
    });

    it("should create nested article structure", () => {
      const element = ArticleElement.create({ className: "blog-post" }, [
        {
          type: "element",
          tagName: "header",
          attributes: {},
          children: [
            {
              type: "element",
              tagName: "h1",
              attributes: {},
              children: [{ type: "text", content: "Article Title" }],
            },
          ],
        },
        {
          type: "element",
          tagName: "section",
          attributes: {},
          children: [
            {
              type: "element",
              tagName: "p",
              attributes: {},
              children: [{ type: "text", content: "Article content..." }],
            },
          ],
        },
      ]);

      expect(element.tagName).toBe("article");
      expect(element.attributes.className).toBe("blog-post");
      expect(element.children).toHaveLength(2);
      expect(element.children[0]).toHaveProperty("tagName", "header");
      expect(element.children[1]).toHaveProperty("tagName", "section");
    });
  });
});
