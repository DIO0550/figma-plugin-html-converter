import { test, expect } from "vitest";
import { HeaderElement } from "../header-element";

test(
  "HeaderElement.isHeaderElement - 有効なheader要素 - trueを返す",
  () => {
    const element = {
      type: "element",
      tagName: "header",
      attributes: {},
    };
    expect(HeaderElement.isHeaderElement(element)).toBe(true);
  }
);

test(
  "HeaderElement.isHeaderElement - 子要素を持つheader要素 - trueを返す",
  () => {
    const element = {
      type: "element",
      tagName: "header",
      attributes: { id: "page-header" },
      children: [],
    };
    expect(HeaderElement.isHeaderElement(element)).toBe(true);
  }
);

test(
  "HeaderElement.isHeaderElement - 非オブジェクト入力 - falseを返す",
  () => {
    expect(HeaderElement.isHeaderElement("header")).toBe(false);
    expect(HeaderElement.isHeaderElement(123)).toBe(false);
    expect(HeaderElement.isHeaderElement(true)).toBe(false);
    expect(HeaderElement.isHeaderElement(undefined)).toBe(false);
    expect(HeaderElement.isHeaderElement(null)).toBe(false);
  }
);

test("HeaderElement.isHeaderElement - typeがtext - falseを返す", () => {
  const element = {
    type: "text",
    tagName: "header",
    attributes: {},
  };
  expect(HeaderElement.isHeaderElement(element)).toBe(false);
});

test(
  "HeaderElement.isHeaderElement - tagNameがheader以外 - falseを返す",
  () => {
    const element = {
      type: "element",
      tagName: "main",
      attributes: {},
    };
    expect(HeaderElement.isHeaderElement(element)).toBe(false);
  }
);

test(
  "HeaderElement.isHeaderElement - typeプロパティなし - falseを返す",
  () => {
    const element = {
      tagName: "header",
      attributes: {},
    };
    expect(HeaderElement.isHeaderElement(element)).toBe(false);
  }
);

test(
  "HeaderElement.isHeaderElement - tagNameプロパティなし - falseを返す",
  () => {
    const element = {
      type: "element",
      attributes: {},
    };
    expect(HeaderElement.isHeaderElement(element)).toBe(false);
  }
);
