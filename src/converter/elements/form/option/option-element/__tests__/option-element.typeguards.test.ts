/**
 * @fileoverview option要素の型ガードのテスト
 */

import { test, expect } from "vitest";
import { OptionElement } from "../option-element";

test("OptionElement.isOptionElement: 正しいoption要素の場合trueを返す", () => {
  const element = OptionElement.create();

  expect(OptionElement.isOptionElement(element)).toBe(true);
});

test("OptionElement.isOptionElement: option要素以外の場合falseを返す", () => {
  const notOption = {
    type: "element",
    tagName: "select",
    attributes: {},
  };

  expect(OptionElement.isOptionElement(notOption)).toBe(false);
});

test("OptionElement.isOptionElement: nullの場合falseを返す", () => {
  expect(OptionElement.isOptionElement(null)).toBe(false);
});

test("OptionElement.isOptionElement: undefinedの場合falseを返す", () => {
  expect(OptionElement.isOptionElement(undefined)).toBe(false);
});

test("OptionElement.isOptionElement: オブジェクトでない場合falseを返す", () => {
  expect(OptionElement.isOptionElement("option")).toBe(false);
  expect(OptionElement.isOptionElement(123)).toBe(false);
  expect(OptionElement.isOptionElement(true)).toBe(false);
});

test("OptionElement.isOptionElement: typeプロパティがない場合falseを返す", () => {
  const noType = {
    tagName: "option",
    attributes: {},
  };

  expect(OptionElement.isOptionElement(noType)).toBe(false);
});

test("OptionElement.isOptionElement: tagNameプロパティがない場合falseを返す", () => {
  const noTagName = {
    type: "element",
    attributes: {},
  };

  expect(OptionElement.isOptionElement(noTagName)).toBe(false);
});

test("OptionElement.isOptionElement: typeが'element'でない場合falseを返す", () => {
  const wrongType = {
    type: "text",
    tagName: "option",
    attributes: {},
  };

  expect(OptionElement.isOptionElement(wrongType)).toBe(false);
});

test("OptionElement.isOptionElement: tagNameが'option'でない場合falseを返す", () => {
  const wrongTagName = {
    type: "element",
    tagName: "select",
    attributes: {},
  };

  expect(OptionElement.isOptionElement(wrongTagName)).toBe(false);
});
