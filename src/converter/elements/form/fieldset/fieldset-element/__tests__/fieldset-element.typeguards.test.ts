/**
 * @fileoverview fieldset要素の型ガードのテスト
 */

import { test, expect } from "vitest";
import { FieldsetElement } from "../fieldset-element";

test("FieldsetElement.isFieldsetElement: 正しいfieldset要素の場合trueを返す", () => {
  const element = FieldsetElement.create();

  expect(FieldsetElement.isFieldsetElement(element)).toBe(true);
});

test("FieldsetElement.isFieldsetElement: fieldset要素以外の場合falseを返す", () => {
  const notFieldset = {
    type: "element",
    tagName: "input",
    attributes: {},
  };

  expect(FieldsetElement.isFieldsetElement(notFieldset)).toBe(false);
});

test("FieldsetElement.isFieldsetElement: nullの場合falseを返す", () => {
  expect(FieldsetElement.isFieldsetElement(null)).toBe(false);
});

test("FieldsetElement.isFieldsetElement: undefinedの場合falseを返す", () => {
  expect(FieldsetElement.isFieldsetElement(undefined)).toBe(false);
});

test("FieldsetElement.isFieldsetElement: オブジェクトでない場合falseを返す", () => {
  expect(FieldsetElement.isFieldsetElement("fieldset")).toBe(false);
  expect(FieldsetElement.isFieldsetElement(123)).toBe(false);
  expect(FieldsetElement.isFieldsetElement(true)).toBe(false);
});

test("FieldsetElement.isFieldsetElement: typeプロパティがない場合falseを返す", () => {
  const noType = {
    tagName: "fieldset",
    attributes: {},
  };

  expect(FieldsetElement.isFieldsetElement(noType)).toBe(false);
});

test("FieldsetElement.isFieldsetElement: tagNameプロパティがない場合falseを返す", () => {
  const noTagName = {
    type: "element",
    attributes: {},
  };

  expect(FieldsetElement.isFieldsetElement(noTagName)).toBe(false);
});

test("FieldsetElement.isFieldsetElement: typeが'element'でない場合falseを返す", () => {
  const wrongType = {
    type: "text",
    tagName: "fieldset",
    attributes: {},
  };

  expect(FieldsetElement.isFieldsetElement(wrongType)).toBe(false);
});

test("FieldsetElement.isFieldsetElement: tagNameが'fieldset'でない場合falseを返す", () => {
  const wrongTagName = {
    type: "element",
    tagName: "legend",
    attributes: {},
  };

  expect(FieldsetElement.isFieldsetElement(wrongTagName)).toBe(false);
});
