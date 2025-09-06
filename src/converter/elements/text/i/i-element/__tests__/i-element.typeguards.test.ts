import { test, expect } from "vitest";
import { IElement } from "../i-element";

test("IElement.isIElementはi要素の場合trueを返す", () => {
  const element = {
    type: "element",
    tagName: "i",
    attributes: {},
    children: [],
  };

  expect(IElement.isIElement(element)).toBe(true);
});

test("IElement.isIElementはi要素（子要素なし）の場合もtrueを返す", () => {
  const element = {
    type: "element",
    tagName: "i",
    attributes: {},
  };

  expect(IElement.isIElement(element)).toBe(true);
});

test("IElement.isIElementは異なるタグ名の場合falseを返す", () => {
  const element = {
    type: "element",
    tagName: "div",
    attributes: {},
  };

  expect(IElement.isIElement(element)).toBe(false);
});

test("IElement.isIElementは異なるtypeの場合falseを返す", () => {
  const element = {
    type: "text",
    tagName: "i",
    attributes: {},
  };

  expect(IElement.isIElement(element)).toBe(false);
});

test("IElement.isIElementはnullの場合falseを返す", () => {
  expect(IElement.isIElement(null)).toBe(false);
});

test("IElement.isIElementはundefinedの場合falseを返す", () => {
  expect(IElement.isIElement(undefined)).toBe(false);
});

test("IElement.isIElementは文字列の場合falseを返す", () => {
  expect(IElement.isIElement("i")).toBe(false);
});

test("IElement.isIElementは数値の場合falseを返す", () => {
  expect(IElement.isIElement(123)).toBe(false);
});

test("IElement.isIElementは必須プロパティが欠けている場合falseを返す", () => {
  const elementWithoutType = {
    tagName: "i",
    attributes: {},
  };

  const elementWithoutTagName = {
    type: "element",
    attributes: {},
  };

  expect(IElement.isIElement(elementWithoutType)).toBe(false);
  expect(IElement.isIElement(elementWithoutTagName)).toBe(false);
});
