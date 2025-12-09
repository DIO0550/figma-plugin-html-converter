import { describe, test, expect } from "vitest";
import { DefsElement } from "../defs-element";

describe("DefsElement.isDefsElement", () => {
  test("DefsElementの場合、trueを返す", () => {
    const element = DefsElement.create();

    expect(DefsElement.isDefsElement(element)).toBe(true);
  });

  test("tagNameがdefsで、typeがelementの場合、trueを返す", () => {
    const node = {
      type: "element" as const,
      tagName: "defs",
      attributes: {},
    };

    expect(DefsElement.isDefsElement(node)).toBe(true);
  });

  test("tagNameがdefs以外の場合、falseを返す", () => {
    const node = {
      type: "element" as const,
      tagName: "g",
      attributes: {},
    };

    expect(DefsElement.isDefsElement(node)).toBe(false);
  });

  test("typeがelement以外の場合、falseを返す", () => {
    const node = {
      type: "text" as const,
      tagName: "defs",
      attributes: {},
    };

    expect(DefsElement.isDefsElement(node)).toBe(false);
  });

  test("nullの場合、falseを返す", () => {
    expect(DefsElement.isDefsElement(null)).toBe(false);
  });

  test("undefinedの場合、falseを返す", () => {
    expect(DefsElement.isDefsElement(undefined)).toBe(false);
  });

  test("オブジェクトでない場合、falseを返す", () => {
    expect(DefsElement.isDefsElement("defs")).toBe(false);
    expect(DefsElement.isDefsElement(123)).toBe(false);
  });
});
