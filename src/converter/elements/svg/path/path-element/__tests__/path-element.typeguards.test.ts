import { describe, test, expect } from "vitest";
import { PathElement } from "../path-element";

describe("PathElement.isPathElement", () => {
  test("正常なPathElement - trueを返す", () => {
    const element = PathElement.create({ d: "M0 0 L100 100" });
    expect(PathElement.isPathElement(element)).toBe(true);
  });

  test("null - falseを返す", () => {
    expect(PathElement.isPathElement(null)).toBe(false);
  });

  test("undefined - falseを返す", () => {
    expect(PathElement.isPathElement(undefined)).toBe(false);
  });

  test("空オブジェクト - falseを返す", () => {
    expect(PathElement.isPathElement({})).toBe(false);
  });

  test("異なるタグ名の要素 - falseを返す", () => {
    const element = {
      type: "element",
      tagName: "rect",
      attributes: {},
    };
    expect(PathElement.isPathElement(element)).toBe(false);
  });

  test("異なるtypeの要素 - falseを返す", () => {
    const element = {
      type: "text",
      tagName: "path",
      attributes: {},
    };
    expect(PathElement.isPathElement(element)).toBe(false);
  });

  test("typeがない要素 - falseを返す", () => {
    const element = {
      tagName: "path",
      attributes: {},
    };
    expect(PathElement.isPathElement(element)).toBe(false);
  });

  test("tagNameがない要素 - falseを返す", () => {
    const element = {
      type: "element",
      attributes: {},
    };
    expect(PathElement.isPathElement(element)).toBe(false);
  });
});
