/**
 * @fileoverview LiElement 型ガードのテスト
 */

import { test, expect } from "vitest";
import { LiElement } from "../li-element";

test("LiElement.isLiElement: correctly identifies valid LiElement", () => {
  const element = LiElement.create();
  expect(LiElement.isLiElement(element)).toBe(true);
});

test("LiElement.isLiElement: correctly identifies element with different tagName", () => {
  const element = {
    type: "element",
    tagName: "div",
    attributes: {},
    children: [],
  };
  expect(LiElement.isLiElement(element)).toBe(false);
});

test("LiElement.isLiElement: correctly identifies element with different type", () => {
  const element = {
    type: "text",
    content: "text",
  };
  expect(LiElement.isLiElement(element)).toBe(false);
});

test("LiElement.isLiElement: correctly identifies null", () => {
  expect(LiElement.isLiElement(null)).toBe(false);
});

test("LiElement.isLiElement: correctly identifies undefined", () => {
  expect(LiElement.isLiElement(undefined)).toBe(false);
});

test("LiElement.isLiElement: correctly identifies primitive values", () => {
  expect(LiElement.isLiElement("string")).toBe(false);
  expect(LiElement.isLiElement(123)).toBe(false);
  expect(LiElement.isLiElement(true)).toBe(false);
});

test("LiElement.isLiElement: correctly identifies objects missing required properties", () => {
  expect(LiElement.isLiElement({})).toBe(false);
  expect(LiElement.isLiElement({ type: "element" })).toBe(false);
  expect(LiElement.isLiElement({ tagName: "li" })).toBe(false);
});

test("LiElement.isLiElement: correctly identifies ul element", () => {
  const element = {
    type: "element",
    tagName: "ul",
    attributes: {},
    children: [],
  };
  expect(LiElement.isLiElement(element)).toBe(false);
});

test("LiElement.isLiElement: correctly identifies ol element", () => {
  const element = {
    type: "element",
    tagName: "ol",
    attributes: {},
    children: [],
  };
  expect(LiElement.isLiElement(element)).toBe(false);
});
