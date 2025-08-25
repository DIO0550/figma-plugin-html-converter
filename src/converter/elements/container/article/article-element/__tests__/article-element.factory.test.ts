import { test, expect } from "vitest";
import { ArticleElement } from "../article-element";
test("属性なしのarticle要素を作成する", () => {
  const element = ArticleElement.create();

  expect(element).toEqual({
    type: "element",
    tagName: "article",
    attributes: {},
    children: [],
  });
});

test("属性ありのarticle要素を作成する", () => {
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

test("子要素ありのarticle要素を作成する", () => {
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

test("属性と子要素両方ありのarticle要素を作成する", () => {
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

test("空の属性オブジェクトを処理する", () => {
  const element = ArticleElement.create({});

  expect(element.attributes).toEqual({});
});

test("空の子要素配列を処理する", () => {
  const element = ArticleElement.create({}, []);

  expect(element.children).toEqual([]);
});

test("ARIA属性を持つarticleを作成する", () => {
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

test("data属性を持つarticleを作成する", () => {
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

test("グローバル属性を持つarticleを作成する", () => {
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

test("ネストされたarticle構造を作成する", () => {
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
