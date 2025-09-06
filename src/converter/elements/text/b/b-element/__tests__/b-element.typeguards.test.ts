import { test, expect } from "vitest";
import { BElement } from "../b-element";

test("BElement.isBElementはb要素の場合trueを返す", () => {
  const element = {
    type: "element",
    tagName: "b",
    attributes: {},
    children: [],
  };

  expect(BElement.isBElement(element)).toBe(true);
});

test("BElement.isBElementはb要素（子要素なし）の場合もtrueを返す", () => {
  const element = {
    type: "element",
    tagName: "b",
    attributes: {},
  };

  expect(BElement.isBElement(element)).toBe(true);
});

test("BElement.isBElementは異なるタグ名の場合falseを返す", () => {
  const element = {
    type: "element",
    tagName: "div",
    attributes: {},
  };

  expect(BElement.isBElement(element)).toBe(false);
});

test("BElement.isBElementは異なるtypeの場合falseを返す", () => {
  const element = {
    type: "text",
    tagName: "b",
    attributes: {},
  };

  expect(BElement.isBElement(element)).toBe(false);
});

test("BElement.isBElementはnullの場合falseを返す", () => {
  expect(BElement.isBElement(null)).toBe(false);
});

test("BElement.isBElementはundefinedの場合falseを返す", () => {
  expect(BElement.isBElement(undefined)).toBe(false);
});

test("BElement.isBElementは文字列の場合falseを返す", () => {
  expect(BElement.isBElement("b")).toBe(false);
});

test("BElement.isBElementは数値の場合falseを返す", () => {
  expect(BElement.isBElement(123)).toBe(false);
});

test("BElement.isBElementは必須プロパティが欠けている場合falseを返す", () => {
  const elementWithoutType = {
    tagName: "b",
    attributes: {},
  };

  const elementWithoutTagName = {
    type: "element",
    attributes: {},
  };

  expect(BElement.isBElement(elementWithoutType)).toBe(false);
  expect(BElement.isBElement(elementWithoutTagName)).toBe(false);
});
