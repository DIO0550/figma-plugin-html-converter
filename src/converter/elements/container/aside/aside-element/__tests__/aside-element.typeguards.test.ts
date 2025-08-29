import { test, expect } from "vitest";
import { AsideElement } from "../aside-element";

test("AsideElement.isAsideElement: aside要素の場合はtrueを返すこと", () => {
  const element = {
    type: "element",
    tagName: "aside",
    attributes: {},
  };

  expect(AsideElement.isAsideElement(element)).toBe(true);
});

test("AsideElement.isAsideElement: タグ名が異なる場合はfalseを返すこと", () => {
  const element = {
    type: "element",
    tagName: "div",
    attributes: {},
  };

  expect(AsideElement.isAsideElement(element)).toBe(false);
});

test("AsideElement.isAsideElement: typeがelementでない場合はfalseを返すこと", () => {
  const element = {
    type: "text",
    content: "text",
  };

  expect(AsideElement.isAsideElement(element)).toBe(false);
});

test("AsideElement.isAsideElement: nullの場合はfalseを返すこと", () => {
  expect(AsideElement.isAsideElement(null)).toBe(false);
});

test("AsideElement.isAsideElement: undefinedの場合はfalseを返すこと", () => {
  expect(AsideElement.isAsideElement(undefined)).toBe(false);
});

test("AsideElement.isAsideElement: 文字列の場合はfalseを返すこと", () => {
  expect(AsideElement.isAsideElement("aside")).toBe(false);
});

test("AsideElement.isAsideElement: 数値の場合はfalseを返すこと", () => {
  expect(AsideElement.isAsideElement(123)).toBe(false);
});

test("AsideElement.isAsideElement: オブジェクトだがtypeプロパティがない場合はfalseを返すこと", () => {
  const element = {
    tagName: "aside",
    attributes: {},
  };

  expect(AsideElement.isAsideElement(element)).toBe(false);
});

test("AsideElement.isAsideElement: オブジェクトだがtagNameプロパティがない場合はfalseを返すこと", () => {
  const element = {
    type: "element",
    attributes: {},
  };

  expect(AsideElement.isAsideElement(element)).toBe(false);
});

test("AsideElement.isAsideElement: 子要素を持つaside要素の場合もtrueを返すこと", () => {
  const element = {
    type: "element",
    tagName: "aside",
    attributes: {},
    children: [
      {
        type: "text",
        content: "Sidebar content",
      },
    ],
  };

  expect(AsideElement.isAsideElement(element)).toBe(true);
});

test("AsideElement.isAsideElement: 属性を持つaside要素の場合もtrueを返すこと", () => {
  const element = {
    type: "element",
    tagName: "aside",
    attributes: {
      id: "sidebar",
      className: "navigation",
      role: "complementary",
    },
  };

  expect(AsideElement.isAsideElement(element)).toBe(true);
});
