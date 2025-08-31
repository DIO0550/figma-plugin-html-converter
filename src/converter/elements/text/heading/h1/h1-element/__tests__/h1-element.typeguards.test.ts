import { test, expect } from "vitest";
import { H1Element } from "../h1-element";

test("H1Element.isH1Element - H1Elementを正しく判定できる", () => {
  const h1Element = {
    type: "element",
    tagName: "h1",
    attributes: {},
    children: [],
  };

  expect(H1Element.isH1Element(h1Element)).toBe(true);
});

test("H1Element.isH1Element - tagNameが異なる場合はfalseを返す", () => {
  const h2Element = {
    type: "element",
    tagName: "h2",
    attributes: {},
    children: [],
  };

  expect(H1Element.isH1Element(h2Element)).toBe(false);
});

test("H1Element.isH1Element - typeが異なる場合はfalseを返す", () => {
  const textNode = {
    type: "text",
    content: "Hello",
  };

  expect(H1Element.isH1Element(textNode)).toBe(false);
});

test("H1Element.isH1Element - nullの場合はfalseを返す", () => {
  expect(H1Element.isH1Element(null)).toBe(false);
});

test("H1Element.isH1Element - undefinedの場合はfalseを返す", () => {
  expect(H1Element.isH1Element(undefined)).toBe(false);
});

test("H1Element.isH1Element - 必須プロパティが欠けている場合はfalseを返す", () => {
  const invalidElement = {
    type: "element",
    // tagName がない
  };

  expect(H1Element.isH1Element(invalidElement)).toBe(false);
});
