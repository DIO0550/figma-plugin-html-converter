import { test, expect } from "vitest";
import { PElement } from "../p-element";

test("PElement.isPElement - 有効なPElement要素を正しく識別する", () => {
  const validElement = {
    type: "element",
    tagName: "p",
    attributes: {},
    children: [],
  };

  expect(PElement.isPElement(validElement)).toBe(true);
});

test("PElement.isPElement - 子要素を持つPElementを正しく識別する", () => {
  const elementWithChildren = {
    type: "element",
    tagName: "p",
    attributes: { class: "paragraph" },
    children: [{ type: "text", content: "Hello World" }],
  };

  expect(PElement.isPElement(elementWithChildren)).toBe(true);
});

test("PElement.isPElement - tagNameが異なる要素を拒否する", () => {
  const divElement = {
    type: "element",
    tagName: "div",
    attributes: {},
    children: [],
  };

  expect(PElement.isPElement(divElement)).toBe(false);
});

test("PElement.isPElement - typeが異なる要素を拒否する", () => {
  const textNode = {
    type: "text",
    content: "Some text",
  };

  expect(PElement.isPElement(textNode)).toBe(false);
});

test("PElement.isPElement - nullを拒否する", () => {
  expect(PElement.isPElement(null)).toBe(false);
});

test("PElement.isPElement - undefinedを拒否する", () => {
  expect(PElement.isPElement(undefined)).toBe(false);
});

test("PElement.isPElement - 文字列を拒否する", () => {
  expect(PElement.isPElement("p")).toBe(false);
});

test("PElement.isPElement - 数値を拒否する", () => {
  expect(PElement.isPElement(123)).toBe(false);
});

test("PElement.isPElement - 配列を拒否する", () => {
  expect(PElement.isPElement([])).toBe(false);
});

test("PElement.isPElement - tagNameプロパティがない要素を拒否する", () => {
  const invalidElement = {
    type: "element",
    attributes: {},
  };

  expect(PElement.isPElement(invalidElement)).toBe(false);
});

test("PElement.isPElement - typeプロパティがない要素を拒否する", () => {
  const invalidElement = {
    tagName: "p",
    attributes: {},
  };

  expect(PElement.isPElement(invalidElement)).toBe(false);
});
