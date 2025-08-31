import { test, expect } from "vitest";
import { SpanElement } from "../span-element";

test("SpanElement.isSpanElementはspan要素の場合trueを返す", () => {
  const element = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [],
  };

  expect(SpanElement.isSpanElement(element)).toBe(true);
});

test("SpanElement.isSpanElementはspan要素（子要素なし）の場合もtrueを返す", () => {
  const element = {
    type: "element",
    tagName: "span",
    attributes: {},
  };

  expect(SpanElement.isSpanElement(element)).toBe(true);
});

test("SpanElement.isSpanElementは異なるタグ名の場合falseを返す", () => {
  const element = {
    type: "element",
    tagName: "div",
    attributes: {},
  };

  expect(SpanElement.isSpanElement(element)).toBe(false);
});

test("SpanElement.isSpanElementは異なるtypeの場合falseを返す", () => {
  const element = {
    type: "text",
    tagName: "span",
    attributes: {},
  };

  expect(SpanElement.isSpanElement(element)).toBe(false);
});

test("SpanElement.isSpanElementはnullの場合falseを返す", () => {
  expect(SpanElement.isSpanElement(null)).toBe(false);
});

test("SpanElement.isSpanElementはundefinedの場合falseを返す", () => {
  expect(SpanElement.isSpanElement(undefined)).toBe(false);
});

test("SpanElement.isSpanElementは文字列の場合falseを返す", () => {
  expect(SpanElement.isSpanElement("span")).toBe(false);
});

test("SpanElement.isSpanElementは数値の場合falseを返す", () => {
  expect(SpanElement.isSpanElement(123)).toBe(false);
});

test("SpanElement.isSpanElementは必須プロパティが欠けている場合falseを返す", () => {
  const elementWithoutType = {
    tagName: "span",
    attributes: {},
  };

  const elementWithoutTagName = {
    type: "element",
    attributes: {},
  };

  expect(SpanElement.isSpanElement(elementWithoutType)).toBe(false);
  expect(SpanElement.isSpanElement(elementWithoutTagName)).toBe(false);
});
