import { test, expect } from "vitest";
import { H2Element } from "../h2-element";
import type { H2Element as H2ElementType } from "../h2-element";

test("H2Element.getId - ID属性を取得できる", () => {
  const element: H2ElementType = {
    type: "element",
    tagName: "h2",
    attributes: {
      id: "section-heading",
    },
    children: [],
  };

  expect(H2Element.getId(element)).toBe("section-heading");
});

test("H2Element.getId - ID属性がない場合はundefinedを返す", () => {
  const element: H2ElementType = {
    type: "element",
    tagName: "h2",
    attributes: {},
    children: [],
  };

  expect(H2Element.getId(element)).toBeUndefined();
});

test("H2Element.getClass - クラス属性を取得できる", () => {
  const element: H2ElementType = {
    type: "element",
    tagName: "h2",
    attributes: {
      class: "subtitle secondary",
    },
    children: [],
  };

  expect(H2Element.getClass(element)).toBe("subtitle secondary");
});

test("H2Element.getClass - クラス属性がない場合はundefinedを返す", () => {
  const element: H2ElementType = {
    type: "element",
    tagName: "h2",
    attributes: {},
    children: [],
  };

  expect(H2Element.getClass(element)).toBeUndefined();
});

test("H2Element.getStyle - スタイル属性を取得できる", () => {
  const element: H2ElementType = {
    type: "element",
    tagName: "h2",
    attributes: {
      style: "color: green; font-size: 24px;",
    },
    children: [],
  };

  expect(H2Element.getStyle(element)).toBe("color: green; font-size: 24px;");
});

test("H2Element.getStyle - スタイル属性がない場合はundefinedを返す", () => {
  const element: H2ElementType = {
    type: "element",
    tagName: "h2",
    attributes: {},
    children: [],
  };

  expect(H2Element.getStyle(element)).toBeUndefined();
});
