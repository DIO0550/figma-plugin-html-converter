/**
 * @fileoverview input要素の型ガードのテスト
 */

import { test, expect } from "vitest";
import { InputElement } from "../input-element";

test("InputElement.isInputElement: 有効なinput要素の場合はtrueを返す", () => {
  const element = {
    type: "element",
    tagName: "input",
    attributes: { type: "text" },
  };

  expect(InputElement.isInputElement(element)).toBe(true);
});

test("InputElement.isInputElement: typeプロパティがない場合はfalseを返す", () => {
  const element = {
    tagName: "input",
    attributes: {},
  };

  expect(InputElement.isInputElement(element)).toBe(false);
});

test("InputElement.isInputElement: tagNameプロパティがない場合はfalseを返す", () => {
  const element = {
    type: "element",
    attributes: {},
  };

  expect(InputElement.isInputElement(element)).toBe(false);
});

test("InputElement.isInputElement: typeが'element'でない場合はfalseを返す", () => {
  const element = {
    type: "text",
    tagName: "input",
    attributes: {},
  };

  expect(InputElement.isInputElement(element)).toBe(false);
});

test("InputElement.isInputElement: tagNameが'input'でない場合はfalseを返す", () => {
  const element = {
    type: "element",
    tagName: "div",
    attributes: {},
  };

  expect(InputElement.isInputElement(element)).toBe(false);
});

test("InputElement.isInputElement: nullの場合はfalseを返す", () => {
  expect(InputElement.isInputElement(null)).toBe(false);
});

test("InputElement.isInputElement: undefinedの場合はfalseを返す", () => {
  expect(InputElement.isInputElement(undefined)).toBe(false);
});

test("InputElement.isInputElement: 文字列の場合はfalseを返す", () => {
  expect(InputElement.isInputElement("input")).toBe(false);
});

test("InputElement.isInputElement: 数値の場合はfalseを返す", () => {
  expect(InputElement.isInputElement(123)).toBe(false);
});

test("InputElement.isInputElement: 配列の場合はfalseを返す", () => {
  expect(InputElement.isInputElement([])).toBe(false);
});

test("InputElement.isInputElement: 空のオブジェクトの場合はfalseを返す", () => {
  expect(InputElement.isInputElement({})).toBe(false);
});
