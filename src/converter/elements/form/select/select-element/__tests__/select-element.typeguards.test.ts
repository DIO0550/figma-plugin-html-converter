/**
 * @fileoverview select要素の型ガードのテスト
 */

import { test, expect } from "vitest";
import { SelectElement } from "../select-element";

test("SelectElement.isSelectElement: 正しいselect要素の場合trueを返す", () => {
  const element = SelectElement.create();

  expect(SelectElement.isSelectElement(element)).toBe(true);
});

test("SelectElement.isSelectElement: select要素以外の場合falseを返す", () => {
  const notSelect = {
    type: "element",
    tagName: "button",
    attributes: {},
  };

  expect(SelectElement.isSelectElement(notSelect)).toBe(false);
});

test("SelectElement.isSelectElement: nullの場合falseを返す", () => {
  expect(SelectElement.isSelectElement(null)).toBe(false);
});

test("SelectElement.isSelectElement: undefinedの場合falseを返す", () => {
  expect(SelectElement.isSelectElement(undefined)).toBe(false);
});

test("SelectElement.isSelectElement: オブジェクトでない場合falseを返す", () => {
  expect(SelectElement.isSelectElement("select")).toBe(false);
  expect(SelectElement.isSelectElement(123)).toBe(false);
  expect(SelectElement.isSelectElement(true)).toBe(false);
});

test("SelectElement.isSelectElement: typeプロパティがない場合falseを返す", () => {
  const noType = {
    tagName: "select",
    attributes: {},
  };

  expect(SelectElement.isSelectElement(noType)).toBe(false);
});

test("SelectElement.isSelectElement: tagNameプロパティがない場合falseを返す", () => {
  const noTagName = {
    type: "element",
    attributes: {},
  };

  expect(SelectElement.isSelectElement(noTagName)).toBe(false);
});

test("SelectElement.isSelectElement: typeが'element'でない場合falseを返す", () => {
  const wrongType = {
    type: "text",
    tagName: "select",
    attributes: {},
  };

  expect(SelectElement.isSelectElement(wrongType)).toBe(false);
});

test("SelectElement.isSelectElement: tagNameが'select'でない場合falseを返す", () => {
  const wrongTagName = {
    type: "element",
    tagName: "input",
    attributes: {},
  };

  expect(SelectElement.isSelectElement(wrongTagName)).toBe(false);
});
