import { test, expect } from "vitest";
import { H5Element } from "../h5-element";

test("H5Element.isH5Element - H5Elementを正しく判定できる", () => {
  const h5Element = {
    type: "element",
    tagName: "h5",
    attributes: {},
    children: [],
  };

  expect(H5Element.isH5Element(h5Element)).toBe(true);
});

test("H5Element.isH5Element - tagNameが異なる場合はfalseを返す", () => {
  const h1Element = {
    type: "element",
    tagName: "h1",
    attributes: {},
    children: [],
  };

  expect(H5Element.isH5Element(h1Element)).toBe(false);
});

test("H5Element.isH5Element - typeが異なる場合はfalseを返す", () => {
  const textNode = {
    type: "text",
    content: "Hello",
  };

  expect(H5Element.isH5Element(textNode)).toBe(false);
});

test("H5Element.isH5Element - nullの場合はfalseを返す", () => {
  expect(H5Element.isH5Element(null)).toBe(false);
});

test("H5Element.isH5Element - undefinedの場合はfalseを返す", () => {
  expect(H5Element.isH5Element(undefined)).toBe(false);
});

test("H5Element.isH5Element - 必須プロパティが欠けている場合はfalseを返す", () => {
  const invalidElement = {
    type: "element",
    // tagName がない
  };

  expect(H5Element.isH5Element(invalidElement)).toBe(false);
});
