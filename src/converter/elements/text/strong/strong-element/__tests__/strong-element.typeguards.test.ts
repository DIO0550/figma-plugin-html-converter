import { test, expect } from "vitest";
import { StrongElement } from "../strong-element";

test("StrongElement.isStrongElementはstrong要素の場合trueを返す", () => {
  const element = {
    type: "element",
    tagName: "strong",
    attributes: {},
    children: [],
  };

  expect(StrongElement.isStrongElement(element)).toBe(true);
});

test("StrongElement.isStrongElementはstrong要素（子要素なし）の場合もtrueを返す", () => {
  const element = {
    type: "element",
    tagName: "strong",
    attributes: {},
  };

  expect(StrongElement.isStrongElement(element)).toBe(true);
});

test("StrongElement.isStrongElementは異なるタグ名の場合falseを返す", () => {
  const element = {
    type: "element",
    tagName: "div",
    attributes: {},
  };

  expect(StrongElement.isStrongElement(element)).toBe(false);
});

test("StrongElement.isStrongElementは異なるtypeの場合falseを返す", () => {
  const element = {
    type: "text",
    tagName: "strong",
    attributes: {},
  };

  expect(StrongElement.isStrongElement(element)).toBe(false);
});

test("StrongElement.isStrongElementはnullの場合falseを返す", () => {
  expect(StrongElement.isStrongElement(null)).toBe(false);
});

test("StrongElement.isStrongElementはundefinedの場合falseを返す", () => {
  expect(StrongElement.isStrongElement(undefined)).toBe(false);
});

test("StrongElement.isStrongElementは文字列の場合falseを返す", () => {
  expect(StrongElement.isStrongElement("strong")).toBe(false);
});

test("StrongElement.isStrongElementは数値の場合falseを返す", () => {
  expect(StrongElement.isStrongElement(123)).toBe(false);
});

test("StrongElement.isStrongElementは必須プロパティが欠けている場合falseを返す", () => {
  const elementWithoutType = {
    tagName: "strong",
    attributes: {},
  };

  const elementWithoutTagName = {
    type: "element",
    attributes: {},
  };

  expect(StrongElement.isStrongElement(elementWithoutType)).toBe(false);
  expect(StrongElement.isStrongElement(elementWithoutTagName)).toBe(false);
});
