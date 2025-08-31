import { test, expect } from "vitest";
import { H2Element } from "../h2-element";

test("H2Element.isH2Element - H2Elementを正しく判定できる", () => {
  const h2Element = {
    type: "element",
    tagName: "h2",
    attributes: {},
    children: [],
  };

  expect(H2Element.isH2Element(h2Element)).toBe(true);
});

test("H2Element.isH2Element - tagNameが異なる場合はfalseを返す", () => {
  const h1Element = {
    type: "element",
    tagName: "h1",
    attributes: {},
    children: [],
  };

  expect(H2Element.isH2Element(h1Element)).toBe(false);
});

test("H2Element.isH2Element - typeが異なる場合はfalseを返す", () => {
  const textNode = {
    type: "text",
    content: "Hello",
  };

  expect(H2Element.isH2Element(textNode)).toBe(false);
});

test("H2Element.isH2Element - nullの場合はfalseを返す", () => {
  expect(H2Element.isH2Element(null)).toBe(false);
});

test("H2Element.isH2Element - undefinedの場合はfalseを返す", () => {
  expect(H2Element.isH2Element(undefined)).toBe(false);
});

test("H2Element.isH2Element - 必須プロパティが欠けている場合はfalseを返す", () => {
  const invalidElement = {
    type: "element",
    // tagName がない
  };

  expect(H2Element.isH2Element(invalidElement)).toBe(false);
});
