import { test, expect } from "vitest";
import { SpanElement } from "../span-element";
import type { SpanElement as SpanElementType } from "../span-element";

test("SpanElement.getIdはID属性を正しく取得する", () => {
  const element: SpanElementType = {
    type: "element",
    tagName: "span",
    attributes: {
      id: "test-id",
    },
    children: [],
  };

  expect(SpanElement.getId(element)).toBe("test-id");
});

test("SpanElement.getIdはID属性がない場合undefinedを返す", () => {
  const element: SpanElementType = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [],
  };

  expect(SpanElement.getId(element)).toBeUndefined();
});

test("SpanElement.getClassはclass属性を正しく取得する", () => {
  const element: SpanElementType = {
    type: "element",
    tagName: "span",
    attributes: {
      class: "highlight bold",
    },
    children: [],
  };

  expect(SpanElement.getClass(element)).toBe("highlight bold");
});

test("SpanElement.getClassはclass属性がない場合undefinedを返す", () => {
  const element: SpanElementType = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [],
  };

  expect(SpanElement.getClass(element)).toBeUndefined();
});

test("SpanElement.getStyleはstyle属性を正しく取得する", () => {
  const element: SpanElementType = {
    type: "element",
    tagName: "span",
    attributes: {
      style: "color: red; font-weight: bold;",
    },
    children: [],
  };

  expect(SpanElement.getStyle(element)).toBe("color: red; font-weight: bold;");
});

test("SpanElement.getStyleはstyle属性がない場合undefinedを返す", () => {
  const element: SpanElementType = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [],
  };

  expect(SpanElement.getStyle(element)).toBeUndefined();
});

test("SpanElementのアクセサーは複数の属性を同時に取得できる", () => {
  const element: SpanElementType = {
    type: "element",
    tagName: "span",
    attributes: {
      id: "multi-test",
      class: "test-class",
      style: "display: inline;",
    },
    children: [],
  };

  expect(SpanElement.getId(element)).toBe("multi-test");
  expect(SpanElement.getClass(element)).toBe("test-class");
  expect(SpanElement.getStyle(element)).toBe("display: inline;");
});
