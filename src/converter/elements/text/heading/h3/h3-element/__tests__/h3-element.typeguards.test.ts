import { test, expect } from "vitest";
import { H3Element } from "../h3-element";

test("H3Element.isH3Element - H3Elementを正しく判定できる", () => {
  const h3Element = {
    type: "element",
    tagName: "h3",
    attributes: {},
    children: [],
  };

  expect(H3Element.isH3Element(h3Element)).toBe(true);
});

test("H3Element.isH3Element - tagNameが異なる場合はfalseを返す", () => {
  const h1Element = {
    type: "element",
    tagName: "h1",
    attributes: {},
    children: [],
  };

  expect(H3Element.isH3Element(h1Element)).toBe(false);
});

test("H3Element.isH3Element - typeが異なる場合はfalseを返す", () => {
  const textNode = {
    type: "text",
    content: "Hello",
  };

  expect(H3Element.isH3Element(textNode)).toBe(false);
});

test("H3Element.isH3Element - nullの場合はfalseを返す", () => {
  expect(H3Element.isH3Element(null)).toBe(false);
});

test("H3Element.isH3Element - undefinedの場合はfalseを返す", () => {
  expect(H3Element.isH3Element(undefined)).toBe(false);
});

test("H3Element.isH3Element - 必須プロパティが欠けている場合はfalseを返す", () => {
  const invalidElement = {
    type: "element",
    // tagName がない
  };

  expect(H3Element.isH3Element(invalidElement)).toBe(false);
});
