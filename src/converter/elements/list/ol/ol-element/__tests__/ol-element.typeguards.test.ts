/**
 * @fileoverview OlElement 型ガードのテスト
 */

import { test, expect } from "vitest";
import { OlElement } from "../ol-element";

test("OlElement.isOlElement: correctly identifies valid OlElement", () => {
  const element = OlElement.create();
  expect(OlElement.isOlElement(element)).toBe(true);
});

test("OlElement.isOlElement: correctly identifies element with different tagName", () => {
  const element = {
    type: "element",
    tagName: "ul",
    attributes: {},
    children: [],
  };
  expect(OlElement.isOlElement(element)).toBe(false);
});

test("OlElement.isOlElement: correctly identifies element with different type", () => {
  const element = {
    type: "text",
    content: "text",
  };
  expect(OlElement.isOlElement(element)).toBe(false);
});

test("OlElement.isOlElement: correctly identifies null", () => {
  expect(OlElement.isOlElement(null)).toBe(false);
});

test("OlElement.isOlElement: correctly identifies undefined", () => {
  expect(OlElement.isOlElement(undefined)).toBe(false);
});

test("OlElement.isOlElement: correctly identifies primitive values", () => {
  expect(OlElement.isOlElement("string")).toBe(false);
  expect(OlElement.isOlElement(123)).toBe(false);
  expect(OlElement.isOlElement(true)).toBe(false);
});

test("OlElement.isOlElement: correctly identifies objects missing required properties", () => {
  expect(OlElement.isOlElement({})).toBe(false);
  expect(OlElement.isOlElement({ type: "element" })).toBe(false);
  expect(OlElement.isOlElement({ tagName: "ol" })).toBe(false);
});
