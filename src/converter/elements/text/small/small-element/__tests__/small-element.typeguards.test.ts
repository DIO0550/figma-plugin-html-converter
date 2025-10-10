import { test, expect } from "vitest";
import { SmallElement } from "../small-element";

test("SmallElement.isSmallElement - 有効なSmallElement要素を正しく識別する", () => {
  const validElement = {
    type: "element",
    tagName: "small",
    attributes: {},
    children: [],
  };

  expect(SmallElement.isSmallElement(validElement)).toBe(true);
});

test("SmallElement.isSmallElement - 子要素を持つSmallElementを正しく識別する", () => {
  const elementWithChildren = {
    type: "element",
    tagName: "small",
    attributes: { class: "small-text" },
    children: [{ type: "text", content: "Small text content" }],
  };

  expect(SmallElement.isSmallElement(elementWithChildren)).toBe(true);
});

test("SmallElement.isSmallElement - スタイル属性を持つSmallElementを正しく識別する", () => {
  const elementWithStyle = {
    type: "element",
    tagName: "small",
    attributes: { style: "font-size: 0.8em;" },
    children: [],
  };

  expect(SmallElement.isSmallElement(elementWithStyle)).toBe(true);
});

test("SmallElement.isSmallElement - tagNameが異なる要素を拒否する", () => {
  const spanElement = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [],
  };

  expect(SmallElement.isSmallElement(spanElement)).toBe(false);
});

test("SmallElement.isSmallElement - typeが異なる要素を拒否する", () => {
  const textNode = {
    type: "text",
    content: "Some text",
  };

  expect(SmallElement.isSmallElement(textNode)).toBe(false);
});

test("SmallElement.isSmallElement - nullを拒否する", () => {
  expect(SmallElement.isSmallElement(null)).toBe(false);
});

test("SmallElement.isSmallElement - undefinedを拒否する", () => {
  expect(SmallElement.isSmallElement(undefined)).toBe(false);
});

test("SmallElement.isSmallElement - 文字列を拒否する", () => {
  expect(SmallElement.isSmallElement("small")).toBe(false);
});

test("SmallElement.isSmallElement - 数値を拒否する", () => {
  expect(SmallElement.isSmallElement(123)).toBe(false);
});

test("SmallElement.isSmallElement - 配列を拒否する", () => {
  expect(SmallElement.isSmallElement([])).toBe(false);
});

test("SmallElement.isSmallElement - tagNameプロパティがない要素を拒否する", () => {
  const invalidElement = {
    type: "element",
    attributes: {},
  };

  expect(SmallElement.isSmallElement(invalidElement)).toBe(false);
});

test("SmallElement.isSmallElement - typeプロパティがない要素を拒否する", () => {
  const invalidElement = {
    tagName: "small",
    attributes: {},
  };

  expect(SmallElement.isSmallElement(invalidElement)).toBe(false);
});
