import { test, expect } from "vitest";
import { H1Element } from "../h1-element";
import type { H1Element as H1ElementType } from "../h1-element";

test("H1Element.getId - ID属性を取得できる", () => {
  const element: H1ElementType = {
    type: "element",
    tagName: "h1",
    attributes: {
      id: "main-heading",
    },
    children: [],
  };

  expect(H1Element.getId(element)).toBe("main-heading");
});

test("H1Element.getId - ID属性がない場合はundefinedを返す", () => {
  const element: H1ElementType = {
    type: "element",
    tagName: "h1",
    attributes: {},
    children: [],
  };

  expect(H1Element.getId(element)).toBeUndefined();
});

test("H1Element.getClass - クラス属性を取得できる", () => {
  const element: H1ElementType = {
    type: "element",
    tagName: "h1",
    attributes: {
      class: "title primary",
    },
    children: [],
  };

  expect(H1Element.getClass(element)).toBe("title primary");
});

test("H1Element.getClass - クラス属性がない場合はundefinedを返す", () => {
  const element: H1ElementType = {
    type: "element",
    tagName: "h1",
    attributes: {},
    children: [],
  };

  expect(H1Element.getClass(element)).toBeUndefined();
});

test("H1Element.getStyle - スタイル属性を取得できる", () => {
  const element: H1ElementType = {
    type: "element",
    tagName: "h1",
    attributes: {
      style: "color: blue; font-size: 32px;",
    },
    children: [],
  };

  expect(H1Element.getStyle(element)).toBe("color: blue; font-size: 32px;");
});

test("H1Element.getStyle - スタイル属性がない場合はundefinedを返す", () => {
  const element: H1ElementType = {
    type: "element",
    tagName: "h1",
    attributes: {},
    children: [],
  };

  expect(H1Element.getStyle(element)).toBeUndefined();
});
