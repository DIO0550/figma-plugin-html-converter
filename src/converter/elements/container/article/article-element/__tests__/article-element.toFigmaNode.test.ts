import { describe, it, expect } from "vitest";
import { ArticleElement } from "../article-element";
import type { ArticleElement as ArticleElementType } from "../article-element";

describe("ArticleElement - toFigmaNode", () => {
  it("should convert basic article element to Figma node", () => {
    const element: ArticleElementType = {
      type: "element",
      tagName: "article",
      attributes: {},
      children: [],
    };

    const figmaNode = ArticleElement.toFigmaNode(element);

    expect(figmaNode).toEqual({
      type: "FRAME",
      name: "article",
      layoutMode: "VERTICAL",
      primaryAxisSizingMode: "AUTO",
      counterAxisSizingMode: "FIXED",
      layoutAlign: "STRETCH",
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      itemSpacing: 0,
    });
  });

  it("should include id in Figma node name when present", () => {
    const element: ArticleElementType = {
      type: "element",
      tagName: "article",
      attributes: { id: "main-article" },
      children: [],
    };

    const figmaNode = ArticleElement.toFigmaNode(element);

    expect(figmaNode.name).toBe("article#main-article");
  });

  it("should include className in Figma node name when present", () => {
    const element: ArticleElementType = {
      type: "element",
      tagName: "article",
      attributes: { className: "blog-post featured" },
      children: [],
    };

    const figmaNode = ArticleElement.toFigmaNode(element);

    expect(figmaNode.name).toBe("article.blog-post.featured");
  });

  it("should include both id and className in name", () => {
    const element: ArticleElementType = {
      type: "element",
      tagName: "article",
      attributes: {
        id: "article-1",
        className: "content main",
      },
      children: [],
    };

    const figmaNode = ArticleElement.toFigmaNode(element);

    expect(figmaNode.name).toBe("article#article-1.content.main");
  });

  it("should apply padding styles", () => {
    const element: ArticleElementType = {
      type: "element",
      tagName: "article",
      attributes: {
        style: "padding: 20px;",
      },
      children: [],
    };

    const figmaNode = ArticleElement.toFigmaNode(element);

    expect(figmaNode.paddingTop).toBe(20);
    expect(figmaNode.paddingRight).toBe(20);
    expect(figmaNode.paddingBottom).toBe(20);
    expect(figmaNode.paddingLeft).toBe(20);
  });

  it("should apply individual padding values", () => {
    const element: ArticleElementType = {
      type: "element",
      tagName: "article",
      attributes: {
        style:
          "padding-top: 10px; padding-right: 20px; padding-bottom: 30px; padding-left: 40px;",
      },
      children: [],
    };

    const figmaNode = ArticleElement.toFigmaNode(element);

    expect(figmaNode.paddingTop).toBe(10);
    expect(figmaNode.paddingRight).toBe(20);
    expect(figmaNode.paddingBottom).toBe(30);
    expect(figmaNode.paddingLeft).toBe(40);
  });

  it("should apply gap style", () => {
    const element: ArticleElementType = {
      type: "element",
      tagName: "article",
      attributes: {
        style: "gap: 16px;",
      },
      children: [],
    };

    const figmaNode = ArticleElement.toFigmaNode(element);

    expect(figmaNode.itemSpacing).toBe(16);
  });

  it("should apply flexbox styles", () => {
    const element: ArticleElementType = {
      type: "element",
      tagName: "article",
      attributes: {
        style:
          "display: flex; flex-direction: row; justify-content: center; align-items: center;",
      },
      children: [],
    };

    const figmaNode = ArticleElement.toFigmaNode(element);

    expect(figmaNode.layoutMode).toBe("HORIZONTAL");
    expect(figmaNode.primaryAxisAlignItems).toBe("CENTER");
    expect(figmaNode.counterAxisAlignItems).toBe("CENTER");
  });

  it("should apply background color", () => {
    const element: ArticleElementType = {
      type: "element",
      tagName: "article",
      attributes: {
        style: "background-color: #f0f0f0;",
      },
      children: [],
    };

    const figmaNode = ArticleElement.toFigmaNode(element);

    expect(figmaNode.fills).toEqual([
      {
        type: "SOLID",
        color: {
          r: 240 / 255,
          g: 240 / 255,
          b: 240 / 255,
        },
        opacity: 1,
      },
    ]);
  });

  it("should apply dimensions", () => {
    const element: ArticleElementType = {
      type: "element",
      tagName: "article",
      attributes: {
        style: "width: 800px; height: 600px;",
      },
      children: [],
    };

    const figmaNode = ArticleElement.toFigmaNode(element);

    expect(figmaNode.width).toBe(800);
    expect(figmaNode.height).toBe(600);
    expect(figmaNode.primaryAxisSizingMode).toBe("FIXED");
    expect(figmaNode.counterAxisSizingMode).toBe("FIXED");
  });

  it("should apply min/max dimensions", () => {
    const element: ArticleElementType = {
      type: "element",
      tagName: "article",
      attributes: {
        style:
          "min-width: 300px; max-width: 1200px; min-height: 200px; max-height: 800px;",
      },
      children: [],
    };

    const figmaNode = ArticleElement.toFigmaNode(element);

    expect(figmaNode.minWidth).toBe(300);
    expect(figmaNode.maxWidth).toBe(1200);
    expect(figmaNode.minHeight).toBe(200);
    expect(figmaNode.maxHeight).toBe(800);
  });

  it("should handle complex styles", () => {
    const element: ArticleElementType = {
      type: "element",
      tagName: "article",
      attributes: {
        id: "blog-post",
        className: "content",
        style:
          "display: flex; flex-direction: column; padding: 24px; gap: 16px; background-color: white; width: 100%; min-height: 400px;",
      },
      children: [],
    };

    const figmaNode = ArticleElement.toFigmaNode(element);

    expect(figmaNode.name).toBe("article#blog-post.content");
    expect(figmaNode.layoutMode).toBe("VERTICAL");
    expect(figmaNode.paddingTop).toBe(24);
    expect(figmaNode.paddingRight).toBe(24);
    expect(figmaNode.paddingBottom).toBe(24);
    expect(figmaNode.paddingLeft).toBe(24);
    expect(figmaNode.itemSpacing).toBe(16);
    expect(figmaNode.minHeight).toBe(400);
    expect(figmaNode.fills).toEqual([
      {
        type: "SOLID",
        color: { r: 1, g: 1, b: 1 },
        opacity: 1,
      },
    ]);
  });

  it("should handle empty style attribute", () => {
    const element: ArticleElementType = {
      type: "element",
      tagName: "article",
      attributes: { style: "" },
      children: [],
    };

    const figmaNode = ArticleElement.toFigmaNode(element);

    expect(figmaNode.layoutMode).toBe("VERTICAL");
    expect(figmaNode.paddingTop).toBe(0);
    expect(figmaNode.itemSpacing).toBe(0);
  });
});
