import { test, expect } from "vitest";
import { SummaryElement } from "../summary-element";

test("SummaryElement.isSummaryElement - SummaryElementオブジェクト - trueを返す", () => {
  const element = SummaryElement.create();

  expect(SummaryElement.isSummaryElement(element)).toBe(true);
});

test("SummaryElement.isSummaryElement - 属性付きSummaryElement - trueを返す", () => {
  const element = SummaryElement.create({
    id: "test-summary",
    class: "summary-class",
  });

  expect(SummaryElement.isSummaryElement(element)).toBe(true);
});

test("SummaryElement.isSummaryElement - null - falseを返す", () => {
  expect(SummaryElement.isSummaryElement(null)).toBe(false);
});

test("SummaryElement.isSummaryElement - undefined - falseを返す", () => {
  expect(SummaryElement.isSummaryElement(undefined)).toBe(false);
});

test("SummaryElement.isSummaryElement - 文字列 - falseを返す", () => {
  expect(SummaryElement.isSummaryElement("summary")).toBe(false);
});

test("SummaryElement.isSummaryElement - 数値 - falseを返す", () => {
  expect(SummaryElement.isSummaryElement(123)).toBe(false);
});

test("SummaryElement.isSummaryElement - 異なるtagNameの要素 - falseを返す", () => {
  const divElement = {
    type: "element",
    tagName: "div",
    attributes: {},
    children: [],
  };

  expect(SummaryElement.isSummaryElement(divElement)).toBe(false);
});

test("SummaryElement.isSummaryElement - 異なるtypeの要素 - falseを返す", () => {
  const textNode = {
    type: "text",
    tagName: "summary",
    attributes: {},
  };

  expect(SummaryElement.isSummaryElement(textNode)).toBe(false);
});

test("SummaryElement.isSummaryElement - typeプロパティがないオブジェクト - falseを返す", () => {
  const invalidObject = {
    tagName: "summary",
    attributes: {},
  };

  expect(SummaryElement.isSummaryElement(invalidObject)).toBe(false);
});

test("SummaryElement.isSummaryElement - tagNameプロパティがないオブジェクト - falseを返す", () => {
  const invalidObject = {
    type: "element",
    attributes: {},
  };

  expect(SummaryElement.isSummaryElement(invalidObject)).toBe(false);
});
