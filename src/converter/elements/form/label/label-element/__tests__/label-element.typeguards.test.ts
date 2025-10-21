/**
 * @fileoverview label要素の型ガードのテスト
 */

import { test, expect } from "vitest";
import { LabelElement } from "../label-element";

test("LabelElement.isLabelElement: 正しいlabel要素の場合trueを返す", () => {
  const element = LabelElement.create();

  expect(LabelElement.isLabelElement(element)).toBe(true);
});

test("LabelElement.isLabelElement: label要素以外の場合falseを返す", () => {
  const notLabel = {
    type: "element",
    tagName: "input",
    attributes: {},
  };

  expect(LabelElement.isLabelElement(notLabel)).toBe(false);
});

test("LabelElement.isLabelElement: nullの場合falseを返す", () => {
  expect(LabelElement.isLabelElement(null)).toBe(false);
});

test("LabelElement.isLabelElement: undefinedの場合falseを返す", () => {
  expect(LabelElement.isLabelElement(undefined)).toBe(false);
});

test("LabelElement.isLabelElement: オブジェクトでない場合falseを返す", () => {
  expect(LabelElement.isLabelElement("label")).toBe(false);
  expect(LabelElement.isLabelElement(123)).toBe(false);
  expect(LabelElement.isLabelElement(true)).toBe(false);
});

test("LabelElement.isLabelElement: typeプロパティがない場合falseを返す", () => {
  const noType = {
    tagName: "label",
    attributes: {},
  };

  expect(LabelElement.isLabelElement(noType)).toBe(false);
});

test("LabelElement.isLabelElement: tagNameプロパティがない場合falseを返す", () => {
  const noTagName = {
    type: "element",
    attributes: {},
  };

  expect(LabelElement.isLabelElement(noTagName)).toBe(false);
});

test("LabelElement.isLabelElement: typeが'element'でない場合falseを返す", () => {
  const wrongType = {
    type: "text",
    tagName: "label",
    attributes: {},
  };

  expect(LabelElement.isLabelElement(wrongType)).toBe(false);
});

test("LabelElement.isLabelElement: tagNameが'label'でない場合falseを返す", () => {
  const wrongTagName = {
    type: "element",
    tagName: "button",
    attributes: {},
  };

  expect(LabelElement.isLabelElement(wrongTagName)).toBe(false);
});
