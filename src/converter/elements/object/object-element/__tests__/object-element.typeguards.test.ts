/**
 * object要素のタイプガードテスト
 */

import { test, expect } from "vitest";
import { ObjectElement } from "../object-element";

test("ObjectElement.isObjectElement - ObjectElementの場合 - trueを返す", () => {
  const element = ObjectElement.create({
    data: "https://example.com/content.swf",
  });
  expect(ObjectElement.isObjectElement(element)).toBe(true);
});

test(
  "ObjectElement.isObjectElement - typeがelement以外の場合 - falseを返す",
  () => {
    const element = { type: "text", tagName: "object", attributes: {} };
    expect(ObjectElement.isObjectElement(element)).toBe(false);
  },
);

test(
  "ObjectElement.isObjectElement - tagNameがobject以外の場合 - falseを返す",
  () => {
    const element = { type: "element", tagName: "iframe", attributes: {} };
    expect(ObjectElement.isObjectElement(element)).toBe(false);
  },
);

test("ObjectElement.isObjectElement - nullの場合 - falseを返す", () => {
  expect(ObjectElement.isObjectElement(null)).toBe(false);
});

test("ObjectElement.isObjectElement - undefinedの場合 - falseを返す", () => {
  expect(ObjectElement.isObjectElement(undefined)).toBe(false);
});

test(
  "ObjectElement.isObjectElement - オブジェクト以外の場合 - falseを返す",
  () => {
    expect(ObjectElement.isObjectElement("object")).toBe(false);
    expect(ObjectElement.isObjectElement(123)).toBe(false);
  },
);

test(
  "ObjectElement.isObjectElement - typeプロパティなしの場合 - falseを返す",
  () => {
    const element = { tagName: "object", attributes: {} };
    expect(ObjectElement.isObjectElement(element)).toBe(false);
  },
);

test(
  "ObjectElement.isObjectElement - tagNameプロパティなしの場合 - falseを返す",
  () => {
    const element = { type: "element", attributes: {} };
    expect(ObjectElement.isObjectElement(element)).toBe(false);
  },
);
