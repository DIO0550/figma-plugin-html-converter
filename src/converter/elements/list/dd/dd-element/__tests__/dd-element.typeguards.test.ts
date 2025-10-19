/**
 * @fileoverview DdElement 型ガードのテスト
 */

import { test, expect } from "vitest";
import { DdElement } from "../dd-element";

test("DdElement.isDdElement: correctly identifies valid DdElement", () => {
  const element = DdElement.create();
  expect(DdElement.isDdElement(element)).toBe(true);
});

test("DdElement.isDdElement: correctly identifies element with different tagName", () => {
  const element = {
    type: "element",
    tagName: "dt",
    attributes: {},
    children: [],
  };
  expect(DdElement.isDdElement(element)).toBe(false);
});

test("DdElement.isDdElement: correctly identifies element with different type", () => {
  const element = {
    type: "text",
    content: "text",
  };
  expect(DdElement.isDdElement(element)).toBe(false);
});

test("DdElement.isDdElement: correctly identifies null", () => {
  expect(DdElement.isDdElement(null)).toBe(false);
});

test("DdElement.isDdElement: correctly identifies undefined", () => {
  expect(DdElement.isDdElement(undefined)).toBe(false);
});

test("DdElement.isDdElement: correctly identifies primitive values", () => {
  expect(DdElement.isDdElement("string")).toBe(false);
  expect(DdElement.isDdElement(123)).toBe(false);
  expect(DdElement.isDdElement(true)).toBe(false);
});

test("DdElement.isDdElement: correctly identifies objects missing required properties", () => {
  expect(DdElement.isDdElement({})).toBe(false);
  expect(DdElement.isDdElement({ type: "element" })).toBe(false);
  expect(DdElement.isDdElement({ tagName: "dd" })).toBe(false);
});
