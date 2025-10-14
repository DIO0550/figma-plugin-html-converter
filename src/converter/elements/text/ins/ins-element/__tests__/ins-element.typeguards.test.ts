import { test, expect } from "vitest";
import { InsElement } from "../ins-element";

test("InsElement.isInsElement - 有効なInsElement要素を正しく識別する", () => {
  const validElement = {
    type: "element",
    tagName: "ins",
    attributes: {},
    children: [],
  };

  expect(InsElement.isInsElement(validElement)).toBe(true);
});

test("InsElement.isInsElement - 子要素を持つInsElementを正しく識別する", () => {
  const elementWithChildren = {
    type: "element",
    tagName: "ins",
    attributes: { class: "inserted-text" },
    children: [{ type: "text", content: "挿入されたテキスト" }],
  };

  expect(InsElement.isInsElement(elementWithChildren)).toBe(true);
});

test("InsElement.isInsElement - cite属性を持つInsElementを正しく識別する", () => {
  const elementWithCite = {
    type: "element",
    tagName: "ins",
    attributes: { cite: "https://example.com/reason" },
    children: [],
  };

  expect(InsElement.isInsElement(elementWithCite)).toBe(true);
});

test("InsElement.isInsElement - datetime属性を持つInsElementを正しく識別する", () => {
  const elementWithDatetime = {
    type: "element",
    tagName: "ins",
    attributes: { datetime: "2024-01-01T12:00:00Z" },
    children: [],
  };

  expect(InsElement.isInsElement(elementWithDatetime)).toBe(true);
});

test("InsElement.isInsElement - tagNameが異なる要素を拒否する", () => {
  const delElement = {
    type: "element",
    tagName: "del",
    attributes: {},
    children: [],
  };

  expect(InsElement.isInsElement(delElement)).toBe(false);
});

test("InsElement.isInsElement - typeが異なる要素を拒否する", () => {
  const textNode = {
    type: "text",
    tagName: "ins",
    content: "テキスト",
  };

  expect(InsElement.isInsElement(textNode)).toBe(false);
});

test("InsElement.isInsElement - nullを拒否する", () => {
  expect(InsElement.isInsElement(null)).toBe(false);
});

test("InsElement.isInsElement - undefinedを拒否する", () => {
  expect(InsElement.isInsElement(undefined)).toBe(false);
});

test("InsElement.isInsElement - 文字列を拒否する", () => {
  expect(InsElement.isInsElement("del")).toBe(false);
});

test("InsElement.isInsElement - 数値を拒否する", () => {
  expect(InsElement.isInsElement(123)).toBe(false);
});

test("InsElement.isInsElement - 配列を拒否する", () => {
  expect(InsElement.isInsElement([])).toBe(false);
});

test("InsElement.isInsElement - typeプロパティのみのオブジェクトを拒否する", () => {
  const incompleteElement = { type: "element" };
  expect(InsElement.isInsElement(incompleteElement)).toBe(false);
});

test("InsElement.isInsElement - tagNameプロパティのみのオブジェクトを拒否する", () => {
  const incompleteElement = { tagName: "ins" };
  expect(InsElement.isInsElement(incompleteElement)).toBe(false);
});

test("InsElement.isInsElement - 異なるtagNameを持つ不完全な要素を拒否する", () => {
  const incompleteElement = { type: "element", tagName: "span" };
  expect(InsElement.isInsElement(incompleteElement)).toBe(false);
});
