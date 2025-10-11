import { test, expect } from "vitest";
import { MarkElement } from "../mark-element";

test("MarkElement.isMarkElement - 有効なMarkElement要素を正しく識別する", () => {
  const validElement = {
    type: "element",
    tagName: "mark",
    attributes: {},
    children: [],
  };

  expect(MarkElement.isMarkElement(validElement)).toBe(true);
});

test("MarkElement.isMarkElement - 子要素を持つMarkElementを正しく識別する", () => {
  const elementWithChildren = {
    type: "element",
    tagName: "mark",
    attributes: { class: "highlight" },
    children: [{ type: "text", content: "Highlighted text content" }],
  };

  expect(MarkElement.isMarkElement(elementWithChildren)).toBe(true);
});

test("MarkElement.isMarkElement - スタイル属性を持つMarkElementを正しく識別する", () => {
  const elementWithStyle = {
    type: "element",
    tagName: "mark",
    attributes: { style: "background-color: yellow;" },
    children: [],
  };

  expect(MarkElement.isMarkElement(elementWithStyle)).toBe(true);
});

test("MarkElement.isMarkElement - tagNameが異なる要素を拒否する", () => {
  const spanElement = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [],
  };

  expect(MarkElement.isMarkElement(spanElement)).toBe(false);
});

test("MarkElement.isMarkElement - typeが異なる要素を拒否する", () => {
  const textNode = {
    type: "text",
    content: "Some text",
  };

  expect(MarkElement.isMarkElement(textNode)).toBe(false);
});

test("MarkElement.isMarkElement - nullを拒否する", () => {
  expect(MarkElement.isMarkElement(null)).toBe(false);
});

test("MarkElement.isMarkElement - undefinedを拒否する", () => {
  expect(MarkElement.isMarkElement(undefined)).toBe(false);
});

test("MarkElement.isMarkElement - 文字列を拒否する", () => {
  expect(MarkElement.isMarkElement("mark")).toBe(false);
});

test("MarkElement.isMarkElement - 数値を拒否する", () => {
  expect(MarkElement.isMarkElement(123)).toBe(false);
});

test("MarkElement.isMarkElement - 配列を拒否する", () => {
  expect(MarkElement.isMarkElement([])).toBe(false);
});

test("MarkElement.isMarkElement - tagNameプロパティがない要素を拒否する", () => {
  const invalidElement = {
    type: "element",
    attributes: {},
  };

  expect(MarkElement.isMarkElement(invalidElement)).toBe(false);
});

test("MarkElement.isMarkElement - typeプロパティがない要素を拒否する", () => {
  const invalidElement = {
    tagName: "mark",
    attributes: {},
  };

  expect(MarkElement.isMarkElement(invalidElement)).toBe(false);
});
