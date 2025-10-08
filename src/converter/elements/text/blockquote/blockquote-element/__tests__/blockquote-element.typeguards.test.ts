import { test, expect } from "vitest";
import { BlockquoteElement } from "../blockquote-element";

test("BlockquoteElement.isBlockquoteElement - 有効なBlockquoteElement要素を正しく識別する", () => {
  const validElement = {
    type: "element",
    tagName: "blockquote",
    attributes: {},
    children: [],
  };

  expect(BlockquoteElement.isBlockquoteElement(validElement)).toBe(true);
});

test("BlockquoteElement.isBlockquoteElement - 子要素を持つBlockquoteElementを正しく識別する", () => {
  const elementWithChildren = {
    type: "element",
    tagName: "blockquote",
    attributes: { class: "quote" },
    children: [{ type: "text", content: "Quote text" }],
  };

  expect(BlockquoteElement.isBlockquoteElement(elementWithChildren)).toBe(true);
});

test("BlockquoteElement.isBlockquoteElement - cite属性を持つBlockquoteElementを正しく識別する", () => {
  const elementWithCite = {
    type: "element",
    tagName: "blockquote",
    attributes: { cite: "https://example.com/source" },
    children: [],
  };

  expect(BlockquoteElement.isBlockquoteElement(elementWithCite)).toBe(true);
});

test("BlockquoteElement.isBlockquoteElement - tagNameが異なる要素を拒否する", () => {
  const divElement = {
    type: "element",
    tagName: "div",
    attributes: {},
    children: [],
  };

  expect(BlockquoteElement.isBlockquoteElement(divElement)).toBe(false);
});

test("BlockquoteElement.isBlockquoteElement - typeが異なる要素を拒否する", () => {
  const textNode = {
    type: "text",
    content: "Some text",
  };

  expect(BlockquoteElement.isBlockquoteElement(textNode)).toBe(false);
});

test("BlockquoteElement.isBlockquoteElement - nullを拒否する", () => {
  expect(BlockquoteElement.isBlockquoteElement(null)).toBe(false);
});

test("BlockquoteElement.isBlockquoteElement - undefinedを拒否する", () => {
  expect(BlockquoteElement.isBlockquoteElement(undefined)).toBe(false);
});

test("BlockquoteElement.isBlockquoteElement - 文字列を拒否する", () => {
  expect(BlockquoteElement.isBlockquoteElement("blockquote")).toBe(false);
});

test("BlockquoteElement.isBlockquoteElement - 数値を拒否する", () => {
  expect(BlockquoteElement.isBlockquoteElement(123)).toBe(false);
});

test("BlockquoteElement.isBlockquoteElement - 配列を拒否する", () => {
  expect(BlockquoteElement.isBlockquoteElement([])).toBe(false);
});

test("BlockquoteElement.isBlockquoteElement - tagNameプロパティがない要素を拒否する", () => {
  const invalidElement = {
    type: "element",
    attributes: {},
  };

  expect(BlockquoteElement.isBlockquoteElement(invalidElement)).toBe(false);
});

test("BlockquoteElement.isBlockquoteElement - typeプロパティがない要素を拒否する", () => {
  const invalidElement = {
    tagName: "blockquote",
    attributes: {},
  };

  expect(BlockquoteElement.isBlockquoteElement(invalidElement)).toBe(false);
});
