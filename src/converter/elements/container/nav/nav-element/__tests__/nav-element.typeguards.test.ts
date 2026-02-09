import { expect, test } from "vitest";
import { NavElement } from "../nav-element";

test(
  "NavElement.isNavElement - 有効なnav要素 - trueを返す",
  () => {
    const element = {
      type: "element" as const,
      tagName: "nav",
      attributes: {},
      children: [],
    };

    expect(NavElement.isNavElement(element)).toBe(true);
  }
);

test(
  "NavElement.isNavElement - 子要素を持つnav要素 - trueを返す",
  () => {
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
  }
);

test(
  "NavElement.isNavElement - tagNameがnav以外 - falseを返す",
  () => {
    const element = {
      type: "element" as const,
      tagName: "div",
      attributes: {},
      children: [],
    };

    expect(NavElement.isNavElement(element)).toBe(false);
  }
);

test("NavElement.isNavElement - typeがelement以外 - falseを返す", () => {
  const element = {
    type: "text" as const,
    tagName: "nav",
    content: "text",
  };

  expect(NavElement.isNavElement(element)).toBe(false);
});

test("NavElement.isNavElement - null入力 - falseを返す", () => {
  expect(NavElement.isNavElement(null)).toBe(false);
});

test("NavElement.isNavElement - undefined入力 - falseを返す", () => {
  expect(NavElement.isNavElement(undefined)).toBe(false);
});

test("NavElement.isNavElement - 文字列入力 - falseを返す", () => {
  expect(NavElement.isNavElement("nav")).toBe(false);
});

test("NavElement.isNavElement - 数値入力 - falseを返す", () => {
  expect(NavElement.isNavElement(123)).toBe(false);
});

test("NavElement.isNavElement - 空のオブジェクト - falseを返す", () => {
  expect(NavElement.isNavElement({})).toBe(false);
});

test(
  "NavElement.isNavElement - tagNameプロパティなし - falseを返す",
  () => {
    const element = {
      type: "element" as const,
      attributes: {},
      children: [],
    };

    expect(NavElement.isNavElement(element)).toBe(false);
  }
);

test(
  "NavElement.isNavElement - typeプロパティなし - falseを返す",
  () => {
    const element = {
      tagName: "nav",
      attributes: {},
      children: [],
    };

    expect(NavElement.isNavElement(element)).toBe(false);
  }
);
