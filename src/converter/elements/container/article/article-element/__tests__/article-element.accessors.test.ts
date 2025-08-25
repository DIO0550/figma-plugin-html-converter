import { test, expect } from "vitest";
import { ArticleElement } from "../article-element";
import type { ArticleElement as ArticleElementType } from "../article-element";
test("idが存在する場合、idを返す", () => {
  const element: ArticleElementType = {
    type: "element",
    tagName: "article",
    attributes: { id: "article-123" },
    children: [],
  };

  expect(ArticleElement.getId(element)).toBe("article-123");
});

test("idが存在しない場合、undefinedを返す", () => {
  const element: ArticleElementType = {
    type: "element",
    tagName: "article",
    attributes: {},
    children: [],
  };

  expect(ArticleElement.getId(element)).toBeUndefined();
});
test("classNameが存在する場合、classNameを返す", () => {
  const element: ArticleElementType = {
    type: "element",
    tagName: "article",
    attributes: { className: "blog-post featured" },
    children: [],
  };

  expect(ArticleElement.getClassName(element)).toBe("blog-post featured");
});

test("classNameが存在しない場合、undefinedを返す", () => {
  const element: ArticleElementType = {
    type: "element",
    tagName: "article",
    attributes: {},
    children: [],
  };

  expect(ArticleElement.getClassName(element)).toBeUndefined();
});
test("styleが存在する場合、styleを返す", () => {
  const element: ArticleElementType = {
    type: "element",
    tagName: "article",
    attributes: { style: "padding: 20px; margin: 10px;" },
    children: [],
  };

  expect(ArticleElement.getStyle(element)).toBe("padding: 20px; margin: 10px;");
});

test("styleが存在しない場合、undefinedを返す", () => {
  const element: ArticleElementType = {
    type: "element",
    tagName: "article",
    attributes: {},
    children: [],
  };

  expect(ArticleElement.getStyle(element)).toBeUndefined();
});
test("特定の属性値を返す", () => {
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

  expect(ArticleElement.getAttribute(element, "data-article-id")).toBe("12345");
  expect(ArticleElement.getAttribute(element, "aria-label")).toBe("メイン記事");
  expect(ArticleElement.getAttribute(element, "role")).toBe("article");
});

test("存在しない属性の場合、undefinedを返す", () => {
  const element: ArticleElementType = {
    type: "element",
    tagName: "article",
    attributes: { id: "test" },
    children: [],
  };

  expect(ArticleElement.getAttribute(element, "data-missing")).toBeUndefined();
});

test("真偽値属性を処理する", () => {
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
  expect(ArticleElement.getAttribute(element, "contentEditable")).toBe("true");
});

test("数値属性を処理する", () => {
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
test("子要素配列を返す", () => {
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

test("子要素がない場合、空配列を返す", () => {
  const element: ArticleElementType = {
    type: "element",
    tagName: "article",
    attributes: {},
    children: [],
  };

  expect(ArticleElement.getChildren(element)).toEqual([]);
});

test("childrenがundefinedの場合、undefinedを返す", () => {
  const element: ArticleElementType = {
    type: "element",
    tagName: "article",
    attributes: {},
  };

  expect(ArticleElement.getChildren(element)).toBeUndefined();
});
test("属性が存在する場合、trueを返す", () => {
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

test("属性が存在しない場合、falseを返す", () => {
  const element: ArticleElementType = {
    type: "element",
    tagName: "article",
    attributes: { id: "test" },
    children: [],
  };

  expect(ArticleElement.hasAttribute(element, "className")).toBe(false);
  expect(ArticleElement.hasAttribute(element, "style")).toBe(false);
});

test("空の属性の場合、falseを返す", () => {
  const element: ArticleElementType = {
    type: "element",
    tagName: "article",
    attributes: {},
    children: [],
  };

  expect(ArticleElement.hasAttribute(element, "id")).toBe(false);
});
