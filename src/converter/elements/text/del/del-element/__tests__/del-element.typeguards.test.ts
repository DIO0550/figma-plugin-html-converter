import { test, expect } from "vitest";
import { DelElement } from "../del-element";

test("DelElement.isDelElement - 有効なDelElement要素を正しく識別する", () => {
  const validElement = {
    type: "element",
    tagName: "del",
    attributes: {},
    children: [],
  };

  expect(DelElement.isDelElement(validElement)).toBe(true);
});

test("DelElement.isDelElement - 子要素を持つDelElementを正しく識別する", () => {
  const elementWithChildren = {
    type: "element",
    tagName: "del",
    attributes: { class: "deleted-text" },
    children: [{ type: "text", content: "削除されたテキスト" }],
  };

  expect(DelElement.isDelElement(elementWithChildren)).toBe(true);
});

test("DelElement.isDelElement - cite属性を持つDelElementを正しく識別する", () => {
  const elementWithCite = {
    type: "element",
    tagName: "del",
    attributes: { cite: "https://example.com/reason" },
    children: [],
  };

  expect(DelElement.isDelElement(elementWithCite)).toBe(true);
});

test("DelElement.isDelElement - datetime属性を持つDelElementを正しく識別する", () => {
  const elementWithDatetime = {
    type: "element",
    tagName: "del",
    attributes: { datetime: "2024-01-01T12:00:00Z" },
    children: [],
  };

  expect(DelElement.isDelElement(elementWithDatetime)).toBe(true);
});

test("DelElement.isDelElement - tagNameが異なる要素を拒否する", () => {
  const insElement = {
    type: "element",
    tagName: "ins",
    attributes: {},
    children: [],
  };

  expect(DelElement.isDelElement(insElement)).toBe(false);
});

test("DelElement.isDelElement - typeが異なる要素を拒否する", () => {
  const textNode = {
    type: "text",
    tagName: "del",
    content: "テキスト",
  };

  expect(DelElement.isDelElement(textNode)).toBe(false);
});

test("DelElement.isDelElement - nullを拒否する", () => {
  expect(DelElement.isDelElement(null)).toBe(false);
});

test("DelElement.isDelElement - undefinedを拒否する", () => {
  expect(DelElement.isDelElement(undefined)).toBe(false);
});

test("DelElement.isDelElement - 文字列を拒否する", () => {
  expect(DelElement.isDelElement("del")).toBe(false);
});

test("DelElement.isDelElement - 数値を拒否する", () => {
  expect(DelElement.isDelElement(123)).toBe(false);
});

test("DelElement.isDelElement - 配列を拒否する", () => {
  expect(DelElement.isDelElement([])).toBe(false);
});

test("DelElement.isDelElement - typeプロパティのみのオブジェクトを拒否する", () => {
  const incompleteElement = { type: "element" };
  expect(DelElement.isDelElement(incompleteElement)).toBe(false);
});

test("DelElement.isDelElement - tagNameプロパティのみのオブジェクトを拒否する", () => {
  const incompleteElement = { tagName: "del" };
  expect(DelElement.isDelElement(incompleteElement)).toBe(false);
});

test("DelElement.isDelElement - 異なるtagNameを持つ不完全な要素を拒否する", () => {
  const incompleteElement = { type: "element", tagName: "span" };
  expect(DelElement.isDelElement(incompleteElement)).toBe(false);
});
