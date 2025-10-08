import { test, expect } from "vitest";
import type { BlockquoteAttributes } from "../blockquote-attributes";

test("BlockquoteAttributes - グローバル属性を含むことができる", () => {
  const attributes: BlockquoteAttributes = {
    id: "quote-1",
    class: "quote-block",
    style: "color: gray; margin-left: 40px;",
    title: "Famous quote",
    lang: "en",
    dir: "ltr",
  };

  expect(attributes.id).toBe("quote-1");
  expect(attributes.class).toBe("quote-block");
  expect(attributes.style).toBe("color: gray; margin-left: 40px;");
  expect(attributes.title).toBe("Famous quote");
  expect(attributes.lang).toBe("en");
  expect(attributes.dir).toBe("ltr");
});

test("BlockquoteAttributes - cite属性を含むことができる", () => {
  const attributes: BlockquoteAttributes = {
    cite: "https://example.com/quote-source",
  };

  expect(attributes.cite).toBe("https://example.com/quote-source");
});

test("BlockquoteAttributes - 空の属性オブジェクトを作成できる", () => {
  const attributes: BlockquoteAttributes = {};
  expect(attributes).toEqual({});
});

test("BlockquoteAttributes - 部分的な属性セットを作成できる", () => {
  const attributes: BlockquoteAttributes = {
    id: "quote-1",
    cite: "https://example.com/source",
    style: "font-style: italic;",
  };
  expect(attributes.id).toBe("quote-1");
  expect(attributes.cite).toBe("https://example.com/source");
  expect(attributes.style).toBe("font-style: italic;");
  expect(attributes.class).toBeUndefined();
});

test("BlockquoteAttributes - カスタムdata属性を含むことができる", () => {
  const attributes: BlockquoteAttributes = {
    "data-testid": "blockquote-component",
    "data-author": "John Doe",
    "data-date": "2024-01-01",
  };

  expect(attributes["data-testid"]).toBe("blockquote-component");
  expect(attributes["data-author"]).toBe("John Doe");
  expect(attributes["data-date"]).toBe("2024-01-01");
});

test("BlockquoteAttributes - アクセシビリティ属性を含むことができる", () => {
  const attributes: BlockquoteAttributes = {
    "aria-label": "Quote section",
    "aria-describedby": "quote-description",
    "aria-hidden": "false",
    role: "blockquote",
  };

  expect(attributes["aria-label"]).toBe("Quote section");
  expect(attributes["aria-describedby"]).toBe("quote-description");
  expect(attributes["aria-hidden"]).toBe("false");
  expect(attributes.role).toBe("blockquote");
});

test("BlockquoteAttributes - GlobalAttributesと互換性がある", () => {
  const globalAttrs = {
    id: "test",
    class: "test-class",
    style: "color: red;",
  };

  const blockquoteAttributes: BlockquoteAttributes = globalAttrs;
  expect(blockquoteAttributes.id).toBe("test");
  expect(blockquoteAttributes.class).toBe("test-class");
  expect(blockquoteAttributes.style).toBe("color: red;");
});
