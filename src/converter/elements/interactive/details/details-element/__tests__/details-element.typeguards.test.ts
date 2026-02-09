import { test, expect } from "vitest";
import { DetailsElement } from "../details-element";

test("DetailsElement.isDetailsElement - DetailsElementオブジェクト - trueを返す", () => {
  const element = DetailsElement.create();

  expect(DetailsElement.isDetailsElement(element)).toBe(true);
});

test("DetailsElement.isDetailsElement - open属性付きDetailsElement - trueを返す", () => {
  const element = DetailsElement.create({ open: true });

  expect(DetailsElement.isDetailsElement(element)).toBe(true);
});

test("DetailsElement.isDetailsElement - null - falseを返す", () => {
  expect(DetailsElement.isDetailsElement(null)).toBe(false);
});

test("DetailsElement.isDetailsElement - undefined - falseを返す", () => {
  expect(DetailsElement.isDetailsElement(undefined)).toBe(false);
});

test("DetailsElement.isDetailsElement - 文字列 - falseを返す", () => {
  expect(DetailsElement.isDetailsElement("details")).toBe(false);
});

test("DetailsElement.isDetailsElement - 数値 - falseを返す", () => {
  expect(DetailsElement.isDetailsElement(123)).toBe(false);
});

test("DetailsElement.isDetailsElement - 異なるtagNameの要素 - falseを返す", () => {
  const divElement = {
    type: "element",
    tagName: "div",
    attributes: {},
    children: [],
  };

  expect(DetailsElement.isDetailsElement(divElement)).toBe(false);
});

test("DetailsElement.isDetailsElement - summaryタグ - falseを返す", () => {
  const summaryElement = {
    type: "element",
    tagName: "summary",
    attributes: {},
    children: [],
  };

  expect(DetailsElement.isDetailsElement(summaryElement)).toBe(false);
});

test("DetailsElement.isDetailsElement - 異なるtypeの要素 - falseを返す", () => {
  const textNode = {
    type: "text",
    tagName: "details",
    attributes: {},
  };

  expect(DetailsElement.isDetailsElement(textNode)).toBe(false);
});
