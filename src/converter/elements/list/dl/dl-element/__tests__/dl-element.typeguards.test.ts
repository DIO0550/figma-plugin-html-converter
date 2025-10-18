/**
 * @fileoverview DlElement 型ガードのテスト
 */

import { test, expect } from "vitest";
import { DlElement } from "../dl-element";

test("DlElement.isDlElement: correctly identifies valid DlElement", () => {
  const element = DlElement.create();
  expect(DlElement.isDlElement(element)).toBe(true);
});

test("DlElement.isDlElement: correctly identifies element with different tagName", () => {
  const element = {
    type: "element",
    tagName: "ul",
    attributes: {},
    children: [],
  };
  expect(DlElement.isDlElement(element)).toBe(false);
});

test("DlElement.isDlElement: correctly identifies element with different type", () => {
  const element = {
    type: "text",
    content: "text",
  };
  expect(DlElement.isDlElement(element)).toBe(false);
});

test("DlElement.isDlElement: correctly identifies null", () => {
  expect(DlElement.isDlElement(null)).toBe(false);
});

test("DlElement.isDlElement: correctly identifies undefined", () => {
  expect(DlElement.isDlElement(undefined)).toBe(false);
});

test("DlElement.isDlElement: correctly identifies primitive values", () => {
  expect(DlElement.isDlElement("string")).toBe(false);
  expect(DlElement.isDlElement(123)).toBe(false);
  expect(DlElement.isDlElement(true)).toBe(false);
});

test("DlElement.isDlElement: correctly identifies objects missing required properties", () => {
  expect(DlElement.isDlElement({})).toBe(false);
  expect(DlElement.isDlElement({ type: "element" })).toBe(false);
  expect(DlElement.isDlElement({ tagName: "dl" })).toBe(false);
});
