import { test, expect } from "vitest";
import { H4Element } from "../h4-element";

test("H4Element.isH4Element - H4Elementを正しく判定できる", () => {
  const h4Element = {
    type: "element",
    tagName: "h4",
    attributes: {},
    children: [],
  };

  expect(H4Element.isH4Element(h4Element)).toBe(true);
});

test("H4Element.isH4Element - tagNameが異なる場合はfalseを返す", () => {
  const h1Element = {
    type: "element",
    tagName: "h1",
    attributes: {},
    children: [],
  };

  expect(H4Element.isH4Element(h1Element)).toBe(false);
});

test("H4Element.isH4Element - typeが異なる場合はfalseを返す", () => {
  const textNode = {
    type: "text",
    content: "Hello",
  };

  expect(H4Element.isH4Element(textNode)).toBe(false);
});

test("H4Element.isH4Element - nullの場合はfalseを返す", () => {
  expect(H4Element.isH4Element(null)).toBe(false);
});

test("H4Element.isH4Element - undefinedの場合はfalseを返す", () => {
  expect(H4Element.isH4Element(undefined)).toBe(false);
});

test("H4Element.isH4Element - 必須プロパティが欠けている場合はfalseを返す", () => {
  const invalidElement = {
    type: "element",
    // tagName がない
  };

  expect(H4Element.isH4Element(invalidElement)).toBe(false);
});
