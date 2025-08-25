import { test, expect } from "vitest";
import { ArticleElement } from "../article-element";
import type { ArticleElement as ArticleElementType } from "../article-element";
test("有効なarticle要素の場合trueを返す", () => {
  const element: ArticleElementType = {
    type: "element",
    tagName: "article",
    attributes: {},
    children: [],
  };

  expect(ArticleElement.isArticleElement(element)).toBe(true);
});

test("属性を持つarticle要素の場合trueを返す", () => {
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

test("子要素を持つarticle要素の場合trueを返す", () => {
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

test("nullの場合falseを返す", () => {
  expect(ArticleElement.isArticleElement(null)).toBe(false);
});

test("undefinedの場合falseを返す", () => {
  expect(ArticleElement.isArticleElement(undefined)).toBe(false);
});

test("オブジェクト以外の場合falseを返す", () => {
  expect(ArticleElement.isArticleElement("article")).toBe(false);
  expect(ArticleElement.isArticleElement(123)).toBe(false);
  expect(ArticleElement.isArticleElement(true)).toBe(false);
});

test("間違ったtypeを持つオブジェクトの場合falseを返す", () => {
  const element = {
    type: "text",
    tagName: "article",
    attributes: {},
    children: [],
  };

  expect(ArticleElement.isArticleElement(element)).toBe(false);
});

test("異なるtagNameを持つ要素の場合falseを返す", () => {
  const element = {
    type: "element",
    tagName: "div",
    attributes: {},
    children: [],
  };

  expect(ArticleElement.isArticleElement(element)).toBe(false);
});

test("tagNameがない要素の場合falseを返す", () => {
  const element = {
    type: "element",
    attributes: {},
    children: [],
  };

  expect(ArticleElement.isArticleElement(element)).toBe(false);
});

test("typeがない要素の場合falseを返す", () => {
  const element = {
    tagName: "article",
    attributes: {},
    children: [],
  };

  expect(ArticleElement.isArticleElement(element)).toBe(false);
});

test("ネストされた構造を持つ要素を処理する", () => {
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
