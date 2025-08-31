import { test, expect } from "vitest";
import { H4Element } from "../h4-element";
import type { H4Element as H4ElementType } from "../h4-element";

test("H4Element.getId - ID属性を取得できる", () => {
  const element: H4ElementType = {
    type: "element",
    tagName: "h4",
    attributes: {
      id: "heading-id-4",
    },
    children: [],
  };

  expect(H4Element.getId(element)).toBe("heading-id-4");
});

test("H4Element.getId - ID属性がない場合はundefinedを返す", () => {
  const element: H4ElementType = {
    type: "element",
    tagName: "h4",
    attributes: {},
    children: [],
  };

  expect(H4Element.getId(element)).toBeUndefined();
});

test("H4Element.getClass - クラス属性を取得できる", () => {
  const element: H4ElementType = {
    type: "element",
    tagName: "h4",
    attributes: {
      class: "heading level-4",
    },
    children: [],
  };

  expect(H4Element.getClass(element)).toBe("heading level-4");
});

test("H4Element.getClass - クラス属性がない場合はundefinedを返す", () => {
  const element: H4ElementType = {
    type: "element",
    tagName: "h4",
    attributes: {},
    children: [],
  };

  expect(H4Element.getClass(element)).toBeUndefined();
});

test("H4Element.getStyle - スタイル属性を取得できる", () => {
  const element: H4ElementType = {
    type: "element",
    tagName: "h4",
    attributes: {
      style: "color: red; font-size: 18px;",
    },
    children: [],
  };

  expect(H4Element.getStyle(element)).toBe("color: red; font-size: 18px;");
});

test("H4Element.getStyle - スタイル属性がない場合はundefinedを返す", () => {
  const element: H4ElementType = {
    type: "element",
    tagName: "h4",
    attributes: {},
    children: [],
  };

  expect(H4Element.getStyle(element)).toBeUndefined();
});
