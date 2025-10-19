/**
 * @fileoverview textarea要素の型ガードのテスト
 */

import { test, expect } from "vitest";
import { TextareaElement } from "../textarea-element";

test("TextareaElement.isTextareaElement: 有効なtextarea要素の場合はtrueを返す", () => {
  const element = {
    type: "element",
    tagName: "textarea",
    attributes: { name: "message" },
    children: [],
  };

  expect(TextareaElement.isTextareaElement(element)).toBe(true);
});

test("TextareaElement.isTextareaElement: typeプロパティがない場合はfalseを返す", () => {
  const element = {
    tagName: "textarea",
    attributes: {},
    children: [],
  };

  expect(TextareaElement.isTextareaElement(element)).toBe(false);
});

test("TextareaElement.isTextareaElement: tagNameプロパティがない場合はfalseを返す", () => {
  const element = {
    type: "element",
    attributes: {},
    children: [],
  };

  expect(TextareaElement.isTextareaElement(element)).toBe(false);
});

test("TextareaElement.isTextareaElement: typeが'element'でない場合はfalseを返す", () => {
  const element = {
    type: "text",
    tagName: "textarea",
    attributes: {},
    children: [],
  };

  expect(TextareaElement.isTextareaElement(element)).toBe(false);
});

test("TextareaElement.isTextareaElement: tagNameが'textarea'でない場合はfalseを返す", () => {
  const element = {
    type: "element",
    tagName: "input",
    attributes: {},
    children: [],
  };

  expect(TextareaElement.isTextareaElement(element)).toBe(false);
});

test("TextareaElement.isTextareaElement: nullの場合はfalseを返す", () => {
  expect(TextareaElement.isTextareaElement(null)).toBe(false);
});

test("TextareaElement.isTextareaElement: undefinedの場合はfalseを返す", () => {
  expect(TextareaElement.isTextareaElement(undefined)).toBe(false);
});

test("TextareaElement.isTextareaElement: 文字列の場合はfalseを返す", () => {
  expect(TextareaElement.isTextareaElement("textarea")).toBe(false);
});

test("TextareaElement.isTextareaElement: 数値の場合はfalseを返す", () => {
  expect(TextareaElement.isTextareaElement(123)).toBe(false);
});

test("TextareaElement.isTextareaElement: 配列の場合はfalseを返す", () => {
  expect(TextareaElement.isTextareaElement([])).toBe(false);
});

test("TextareaElement.isTextareaElement: 空のオブジェクトの場合はfalseを返す", () => {
  expect(TextareaElement.isTextareaElement({})).toBe(false);
});
