import { describe, expect, test } from "vitest";
import { NavElement } from "../nav-element";

describe("NavElement.isNavElement", () => {
  test("有効なnav要素の場合trueを返す", () => {
    const element = {
      type: "element" as const,
      tagName: "nav",
      attributes: {},
      children: [],
    };

    expect(NavElement.isNavElement(element)).toBe(true);
  });

  test("子要素を持つnav要素の場合trueを返す", () => {
    const element = {
      type: "element" as const,
      tagName: "nav",
      attributes: { className: "main-nav" },
      children: [
        {
          type: "element" as const,
          tagName: "ul",
          attributes: {},
          children: [],
        },
      ],
    };

    expect(NavElement.isNavElement(element)).toBe(true);
  });

  test("タグ名がnavでない場合falseを返す", () => {
    const element = {
      type: "element" as const,
      tagName: "div",
      attributes: {},
      children: [],
    };

    expect(NavElement.isNavElement(element)).toBe(false);
  });

  test("typeがelementでない場合falseを返す", () => {
    const element = {
      type: "text" as const,
      tagName: "nav",
      content: "text",
    };

    expect(NavElement.isNavElement(element)).toBe(false);
  });

  test("nullの場合falseを返す", () => {
    expect(NavElement.isNavElement(null)).toBe(false);
  });

  test("undefinedの場合falseを返す", () => {
    expect(NavElement.isNavElement(undefined)).toBe(false);
  });

  test("文字列の場合falseを返す", () => {
    expect(NavElement.isNavElement("nav")).toBe(false);
  });

  test("数値の場合falseを返す", () => {
    expect(NavElement.isNavElement(123)).toBe(false);
  });

  test("空のオブジェクトの場合falseを返す", () => {
    expect(NavElement.isNavElement({})).toBe(false);
  });

  test("tagNameプロパティがない場合falseを返す", () => {
    const element = {
      type: "element" as const,
      attributes: {},
      children: [],
    };

    expect(NavElement.isNavElement(element)).toBe(false);
  });

  test("typeプロパティがない場合falseを返す", () => {
    const element = {
      tagName: "nav",
      attributes: {},
      children: [],
    };

    expect(NavElement.isNavElement(element)).toBe(false);
  });
});
