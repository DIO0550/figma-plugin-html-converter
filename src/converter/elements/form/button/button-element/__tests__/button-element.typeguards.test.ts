/**
 * @fileoverview button要素の型ガードのテスト
 */

import { test, expect } from "vitest";
import { ButtonElement } from "../button-element";

test("ButtonElement.isButtonElement: 有効なbutton要素の場合はtrueを返す", () => {
  const element = {
    type: "element",
    tagName: "button",
    attributes: { type: "button" },
    children: [],
  };

  expect(ButtonElement.isButtonElement(element)).toBe(true);
});

test("ButtonElement.isButtonElement: typeプロパティがない場合はfalseを返す", () => {
  const element = {
    tagName: "button",
    attributes: {},
    children: [],
  };

  expect(ButtonElement.isButtonElement(element)).toBe(false);
});

test("ButtonElement.isButtonElement: tagNameプロパティがない場合はfalseを返す", () => {
  const element = {
    type: "element",
    attributes: {},
    children: [],
  };

  expect(ButtonElement.isButtonElement(element)).toBe(false);
});

test("ButtonElement.isButtonElement: typeが'element'でない場合はfalseを返す", () => {
  const element = {
    type: "text",
    tagName: "button",
    attributes: {},
    children: [],
  };

  expect(ButtonElement.isButtonElement(element)).toBe(false);
});

test("ButtonElement.isButtonElement: tagNameが'button'でない場合はfalseを返す", () => {
  const element = {
    type: "element",
    tagName: "input",
    attributes: {},
    children: [],
  };

  expect(ButtonElement.isButtonElement(element)).toBe(false);
});

test("ButtonElement.isButtonElement: nullの場合はfalseを返す", () => {
  expect(ButtonElement.isButtonElement(null)).toBe(false);
});

test("ButtonElement.isButtonElement: undefinedの場合はfalseを返す", () => {
  expect(ButtonElement.isButtonElement(undefined)).toBe(false);
});

test("ButtonElement.isButtonElement: 文字列の場合はfalseを返す", () => {
  expect(ButtonElement.isButtonElement("button")).toBe(false);
});

test("ButtonElement.isButtonElement: 数値の場合はfalseを返す", () => {
  expect(ButtonElement.isButtonElement(123)).toBe(false);
});

test("ButtonElement.isButtonElement: 配列の場合はfalseを返す", () => {
  expect(ButtonElement.isButtonElement([])).toBe(false);
});

test("ButtonElement.isButtonElement: 空のオブジェクトの場合はfalseを返す", () => {
  expect(ButtonElement.isButtonElement({})).toBe(false);
});
