import { test, expect } from "vitest";
import { ArticleElement } from "../article-element";
import type { ArticleElement as ArticleElementType } from "../article-element";
test("基本的なarticle要素をFigmaノードに変換する", () => {
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
    layoutSizingVertical: "HUG",
    layoutSizingHorizontal: "FIXED",
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    itemSpacing: 0,
  });
});

test("idが存在する場合、Figmaノード名にidを含む", () => {
  const element: ArticleElementType = {
    type: "element",
    tagName: "article",
    attributes: { id: "main-article" },
    children: [],
  };

  const figmaNode = ArticleElement.toFigmaNode(element);

  expect(figmaNode.name).toBe("article#main-article");
});

test("classNameが存在する場合、Figmaノード名にclassNameを含む", () => {
  const element: ArticleElementType = {
    type: "element",
    tagName: "article",
    attributes: { className: "blog-post featured" },
    children: [],
  };

  const figmaNode = ArticleElement.toFigmaNode(element);

  expect(figmaNode.name).toBe("article.blog-post.featured");
});

test("idとclassName両方を名前に含む", () => {
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

test("paddingスタイルを適用する", () => {
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

test("個別のpadding値を適用する", () => {
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

test("gapスタイルを適用する", () => {
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

test("flexboxスタイルを適用する", () => {
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

test("背景色を適用する", () => {
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

test("寸法を適用する", () => {
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
  expect(figmaNode.layoutSizingVertical).toBe("FIXED");
  expect(figmaNode.layoutSizingHorizontal).toBe("FIXED");
});

test("最小/最大寸法を適用する", () => {
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

test("複雑なスタイルを処理する", () => {
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

test("空のstyle属性を処理する", () => {
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
