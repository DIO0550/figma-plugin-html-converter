import { test, expect } from "vitest";
import { H6Element } from "../h6-element";
import type { H6Element as H6ElementType } from "../h6-element";

test("H6Element.getId - ID属性を取得できる", () => {
  const element: H6ElementType = {
    type: "element",
    tagName: "h6",
    attributes: {
      id: "heading-id-6",
    },
    children: [],
  };

  expect(H6Element.getId(element)).toBe("heading-id-6");
});

test("H6Element.getId - ID属性がない場合はundefinedを返す", () => {
  const element: H6ElementType = {
    type: "element",
    tagName: "h6",
    attributes: {},
    children: [],
  };

  expect(H6Element.getId(element)).toBeUndefined();
});

test("H6Element.getClass - クラス属性を取得できる", () => {
  const element: H6ElementType = {
    type: "element",
    tagName: "h6",
    attributes: {
      class: "heading level-6",
    },
    children: [],
  };

  expect(H6Element.getClass(element)).toBe("heading level-6");
});

test("H6Element.getClass - クラス属性がない場合はundefinedを返す", () => {
  const element: H6ElementType = {
    type: "element",
    tagName: "h6",
    attributes: {},
    children: [],
  };

  expect(H6Element.getClass(element)).toBeUndefined();
});

test("H6Element.getStyle - スタイル属性を取得できる", () => {
  const element: H6ElementType = {
    type: "element",
    tagName: "h6",
    attributes: {
      style: "color: red; font-size: 18px;",
    },
    children: [],
  };

  expect(H6Element.getStyle(element)).toBe("color: red; font-size: 18px;");
});

test("H6Element.getStyle - スタイル属性がない場合はundefinedを返す", () => {
  const element: H6ElementType = {
    type: "element",
    tagName: "h6",
    attributes: {},
    children: [],
  };

  expect(H6Element.getStyle(element)).toBeUndefined();
});
