import { test, expect } from "vitest";
import { H6Element } from "../h6-element";

test("H6Element.isH6Element - H6Elementを正しく判定できる", () => {
  const h6Element = {
    type: "element",
    tagName: "h6",
    attributes: {},
    children: [],
  };

  expect(H6Element.isH6Element(h6Element)).toBe(true);
});

test("H6Element.isH6Element - tagNameが異なる場合はfalseを返す", () => {
  const h1Element = {
    type: "element",
    tagName: "h1",
    attributes: {},
    children: [],
  };

  expect(H6Element.isH6Element(h1Element)).toBe(false);
});

test("H6Element.isH6Element - typeが異なる場合はfalseを返す", () => {
  const textNode = {
    type: "text",
    content: "Hello",
  };

  expect(H6Element.isH6Element(textNode)).toBe(false);
});

test("H6Element.isH6Element - nullの場合はfalseを返す", () => {
  expect(H6Element.isH6Element(null)).toBe(false);
});

test("H6Element.isH6Element - undefinedの場合はfalseを返す", () => {
  expect(H6Element.isH6Element(undefined)).toBe(false);
});

test("H6Element.isH6Element - 必須プロパティが欠けている場合はfalseを返す", () => {
  const invalidElement = {
    type: "element",
    // tagName がない
  };

  expect(H6Element.isH6Element(invalidElement)).toBe(false);
});
