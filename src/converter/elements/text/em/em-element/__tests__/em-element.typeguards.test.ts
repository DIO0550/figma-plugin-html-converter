import { test, expect } from "vitest";
import { EmElement } from "../em-element";

test("EmElement.isEmElementはem要素の場合trueを返す", () => {
  const element = {
    type: "element",
    tagName: "em",
    attributes: {},
    children: [],
  };

  expect(EmElement.isEmElement(element)).toBe(true);
});

test("EmElement.isEmElementはem要素（子要素なし）の場合もtrueを返す", () => {
  const element = {
    type: "element",
    tagName: "em",
    attributes: {},
  };

  expect(EmElement.isEmElement(element)).toBe(true);
});

test("EmElement.isEmElementは異なるタグ名の場合falseを返す", () => {
  const element = {
    type: "element",
    tagName: "div",
    attributes: {},
  };

  expect(EmElement.isEmElement(element)).toBe(false);
});

test("EmElement.isEmElementは異なるtypeの場合falseを返す", () => {
  const element = {
    type: "text",
    tagName: "em",
    attributes: {},
  };

  expect(EmElement.isEmElement(element)).toBe(false);
});

test("EmElement.isEmElementはnullの場合falseを返す", () => {
  expect(EmElement.isEmElement(null)).toBe(false);
});

test("EmElement.isEmElementはundefinedの場合falseを返す", () => {
  expect(EmElement.isEmElement(undefined)).toBe(false);
});

test("EmElement.isEmElementは文字列の場合falseを返す", () => {
  expect(EmElement.isEmElement("em")).toBe(false);
});

test("EmElement.isEmElementは数値の場合falseを返す", () => {
  expect(EmElement.isEmElement(123)).toBe(false);
});

test("EmElement.isEmElementは必須プロパティが欠けている場合falseを返す", () => {
  const elementWithoutType = {
    tagName: "em",
    attributes: {},
  };

  const elementWithoutTagName = {
    type: "element",
    attributes: {},
  };

  expect(EmElement.isEmElement(elementWithoutType)).toBe(false);
  expect(EmElement.isEmElement(elementWithoutTagName)).toBe(false);
});
