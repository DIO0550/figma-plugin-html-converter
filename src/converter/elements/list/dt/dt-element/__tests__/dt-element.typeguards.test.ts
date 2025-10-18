/**
 * @fileoverview DtElement 型ガードのテスト
 */

import { test, expect } from "vitest";
import { DtElement } from "../dt-element";

test("DtElement.isDtElement: correctly identifies valid DtElement", () => {
  const element = DtElement.create();
  expect(DtElement.isDtElement(element)).toBe(true);
});

test("DtElement.isDtElement: correctly identifies element with different tagName", () => {
  const element = {
    type: "element",
    tagName: "dd",
    attributes: {},
    children: [],
  };
  expect(DtElement.isDtElement(element)).toBe(false);
});

test("DtElement.isDtElement: correctly identifies element with different type", () => {
  const element = {
    type: "text",
    content: "text",
  };
  expect(DtElement.isDtElement(element)).toBe(false);
});

test("DtElement.isDtElement: correctly identifies null", () => {
  expect(DtElement.isDtElement(null)).toBe(false);
});

test("DtElement.isDtElement: correctly identifies undefined", () => {
  expect(DtElement.isDtElement(undefined)).toBe(false);
});

test("DtElement.isDtElement: correctly identifies primitive values", () => {
  expect(DtElement.isDtElement("string")).toBe(false);
  expect(DtElement.isDtElement(123)).toBe(false);
  expect(DtElement.isDtElement(true)).toBe(false);
});

test("DtElement.isDtElement: correctly identifies objects missing required properties", () => {
  expect(DtElement.isDtElement({})).toBe(false);
  expect(DtElement.isDtElement({ type: "element" })).toBe(false);
  expect(DtElement.isDtElement({ tagName: "dt" })).toBe(false);
});
