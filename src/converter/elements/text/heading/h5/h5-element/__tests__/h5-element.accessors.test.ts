import { test, expect } from "vitest";
import { H5Element } from "../h5-element";
import type { H5Element as H5ElementType } from "../h5-element";

test("H5Element.getId - ID属性を取得できる", () => {
  const element: H5ElementType = {
    type: "element",
    tagName: "h5",
    attributes: {
      id: "heading-id-5",
    },
    children: [],
  };

  expect(H5Element.getId(element)).toBe("heading-id-5");
});

test("H5Element.getId - ID属性がない場合はundefinedを返す", () => {
  const element: H5ElementType = {
    type: "element",
    tagName: "h5",
    attributes: {},
    children: [],
  };

  expect(H5Element.getId(element)).toBeUndefined();
});

test("H5Element.getClass - クラス属性を取得できる", () => {
  const element: H5ElementType = {
    type: "element",
    tagName: "h5",
    attributes: {
      class: "heading level-5",
    },
    children: [],
  };

  expect(H5Element.getClass(element)).toBe("heading level-5");
});

test("H5Element.getClass - クラス属性がない場合はundefinedを返す", () => {
  const element: H5ElementType = {
    type: "element",
    tagName: "h5",
    attributes: {},
    children: [],
  };

  expect(H5Element.getClass(element)).toBeUndefined();
});

test("H5Element.getStyle - スタイル属性を取得できる", () => {
  const element: H5ElementType = {
    type: "element",
    tagName: "h5",
    attributes: {
      style: "color: red; font-size: 18px;",
    },
    children: [],
  };

  expect(H5Element.getStyle(element)).toBe("color: red; font-size: 18px;");
});

test("H5Element.getStyle - スタイル属性がない場合はundefinedを返す", () => {
  const element: H5ElementType = {
    type: "element",
    tagName: "h5",
    attributes: {},
    children: [],
  };

  expect(H5Element.getStyle(element)).toBeUndefined();
});
