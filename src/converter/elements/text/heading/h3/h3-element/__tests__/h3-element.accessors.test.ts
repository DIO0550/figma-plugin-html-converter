import { test, expect } from "vitest";
import { H3Element } from "../h3-element";
import type { H3Element as H3ElementType } from "../h3-element";

test("H3Element.getId - ID属性を取得できる", () => {
  const element: H3ElementType = {
    type: "element",
    tagName: "h3",
    attributes: {
      id: "heading-id-3",
    },
    children: [],
  };

  expect(H3Element.getId(element)).toBe("heading-id-3");
});

test("H3Element.getId - ID属性がない場合はundefinedを返す", () => {
  const element: H3ElementType = {
    type: "element",
    tagName: "h3",
    attributes: {},
    children: [],
  };

  expect(H3Element.getId(element)).toBeUndefined();
});

test("H3Element.getClass - クラス属性を取得できる", () => {
  const element: H3ElementType = {
    type: "element",
    tagName: "h3",
    attributes: {
      class: "heading level-3",
    },
    children: [],
  };

  expect(H3Element.getClass(element)).toBe("heading level-3");
});

test("H3Element.getClass - クラス属性がない場合はundefinedを返す", () => {
  const element: H3ElementType = {
    type: "element",
    tagName: "h3",
    attributes: {},
    children: [],
  };

  expect(H3Element.getClass(element)).toBeUndefined();
});

test("H3Element.getStyle - スタイル属性を取得できる", () => {
  const element: H3ElementType = {
    type: "element",
    tagName: "h3",
    attributes: {
      style: "color: red; font-size: 18px;",
    },
    children: [],
  };

  expect(H3Element.getStyle(element)).toBe("color: red; font-size: 18px;");
});

test("H3Element.getStyle - スタイル属性がない場合はundefinedを返す", () => {
  const element: H3ElementType = {
    type: "element",
    tagName: "h3",
    attributes: {},
    children: [],
  };

  expect(H3Element.getStyle(element)).toBeUndefined();
});
