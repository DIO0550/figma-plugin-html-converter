import { test, expect } from "vitest";
import type { ArticleAttributes } from "../article-attributes";

test("GlobalAttributesを拡張する", () => {
  const attributes: ArticleAttributes = {
    id: "article-1",
    className: "article-content",
    style: "padding: 20px;",
    tabIndex: 0,
    title: "Main Article",
    lang: "ja",
    dir: "ltr",
    hidden: false,
    contentEditable: "false",
    spellcheck: false,
    draggable: false,
    translate: "yes",
    role: "article",
    "aria-label": "メインコンテンツ",
    "aria-labelledby": "article-title",
    "aria-describedby": "article-description",
    "aria-hidden": "false",
    "data-custom": "value",
  };

  expect(attributes.id).toBe("article-1");
  expect(attributes.className).toBe("article-content");
  expect(attributes.style).toBe("padding: 20px;");
  expect(attributes.role).toBe("article");
});

test("アクセシビリティのためのARIA属性を受け入れる", () => {
  const attributes: ArticleAttributes = {
    "aria-label": "記事のコンテンツ",
    "aria-labelledby": "article-heading",
    "aria-describedby": "article-summary",
    "aria-live": "polite",
    "aria-atomic": "true",
    "aria-relevant": "additions text",
  };

  expect(attributes["aria-label"]).toBe("記事のコンテンツ");
  expect(attributes["aria-labelledby"]).toBe("article-heading");
  expect(attributes["aria-describedby"]).toBe("article-summary");
  expect(attributes["aria-live"]).toBe("polite");
});

test("data属性を受け入れる", () => {
  const attributes: ArticleAttributes = {
    "data-article-id": "123",
    "data-author": "John Doe",
    "data-published": "2024-01-01",
    "data-category": "tech",
  };

  expect(attributes["data-article-id"]).toBe("123");
  expect(attributes["data-author"]).toBe("John Doe");
  expect(attributes["data-published"]).toBe("2024-01-01");
  expect(attributes["data-category"]).toBe("tech");
});

test("HTML5セマンティック属性と互換性がある", () => {
  const attributes: ArticleAttributes = {
    role: "article",
    itemScope: true,
    itemType: "https://schema.org/Article",
    itemProp: "articleBody",
  };

  expect(attributes.role).toBe("article");
  expect(attributes.itemScope).toBe(true);
  expect(attributes.itemType).toBe("https://schema.org/Article");
  expect(attributes.itemProp).toBe("articleBody");
});

test("空の属性オブジェクトを処理する", () => {
  const attributes: ArticleAttributes = {};
  expect(attributes).toEqual({});
});

test("全てのグローバルイベントハンドラを許可する", () => {
  const attributes: ArticleAttributes = {
    onClick: "handleClick()",
    onFocus: "handleFocus()",
    onBlur: "handleBlur()",
    onMouseEnter: "handleMouseEnter()",
    onMouseLeave: "handleMouseLeave()",
    onKeyDown: "handleKeyDown()",
    onKeyUp: "handleKeyUp()",
    onScroll: "handleScroll()",
  };

  expect(attributes.onClick).toBe("handleClick()");
  expect(attributes.onFocus).toBe("handleFocus()");
  expect(attributes.onScroll).toBe("handleScroll()");
});
