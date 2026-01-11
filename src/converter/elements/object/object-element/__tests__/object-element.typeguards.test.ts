/**
 * object要素のタイプガードテスト
 */

import { describe, test, expect } from "vitest";
import { ObjectElement } from "../object-element";

describe("ObjectElement.isObjectElement", () => {
  test("ObjectElementを正しく識別できる", () => {
    const element = ObjectElement.create({
      data: "https://example.com/content.swf",
    });
    expect(ObjectElement.isObjectElement(element)).toBe(true);
  });

  test("type: elementでない場合はfalseを返す", () => {
    const element = { type: "text", tagName: "object", attributes: {} };
    expect(ObjectElement.isObjectElement(element)).toBe(false);
  });

  test("tagName: objectでない場合はfalseを返す", () => {
    const element = { type: "element", tagName: "iframe", attributes: {} };
    expect(ObjectElement.isObjectElement(element)).toBe(false);
  });

  test("nullの場合はfalseを返す", () => {
    expect(ObjectElement.isObjectElement(null)).toBe(false);
  });

  test("undefinedの場合はfalseを返す", () => {
    expect(ObjectElement.isObjectElement(undefined)).toBe(false);
  });

  test("オブジェクトでない場合はfalseを返す", () => {
    expect(ObjectElement.isObjectElement("object")).toBe(false);
    expect(ObjectElement.isObjectElement(123)).toBe(false);
  });

  test("typeプロパティがない場合はfalseを返す", () => {
    const element = { tagName: "object", attributes: {} };
    expect(ObjectElement.isObjectElement(element)).toBe(false);
  });

  test("tagNameプロパティがない場合はfalseを返す", () => {
    const element = { type: "element", attributes: {} };
    expect(ObjectElement.isObjectElement(element)).toBe(false);
  });
});
