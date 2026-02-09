import { it, expect } from "vitest";
import { FooterElement } from "../footer-element";

it(
  "FooterElement.isFooterElement - 有効なfooter要素 - trueを返す",
  () => {
    const element = {
      type: "element",
      tagName: "footer",
      attributes: {},
    };

    expect(FooterElement.isFooterElement(element)).toBe(true);
  }
);

it(
  "FooterElement.isFooterElement - 属性と子要素あり - trueを返す",
  () => {
    const element = {
      type: "element",
      tagName: "footer",
      attributes: { id: "footer", className: "site-footer" },
      children: [
        {
          type: "element",
          tagName: "p",
          attributes: {},
          children: [{ type: "text", content: "Copyright" }],
        },
      ],
    };

    expect(FooterElement.isFooterElement(element)).toBe(true);
  }
);

it(
  "FooterElement.isFooterElement - typeがelement以外 - falseを返す",
  () => {
    const element = {
      type: "text",
      tagName: "footer",
      attributes: {},
    };

    expect(FooterElement.isFooterElement(element)).toBe(false);
  }
);

it(
  "FooterElement.isFooterElement - tagNameがfooter以外 - falseを返す",
  () => {
    const element = {
      type: "element",
      tagName: "div",
      attributes: {},
    };

    expect(FooterElement.isFooterElement(element)).toBe(false);
  }
);

it("FooterElement.isFooterElement - null入力 - falseを返す", () => {
  expect(FooterElement.isFooterElement(null)).toBe(false);
});

it(
  "FooterElement.isFooterElement - undefined入力 - falseを返す",
  () => {
    expect(FooterElement.isFooterElement(undefined)).toBe(false);
  }
);

it("FooterElement.isFooterElement - 非オブジェクト入力 - falseを返す", () => {
  expect(FooterElement.isFooterElement("footer")).toBe(false);
  expect(FooterElement.isFooterElement(123)).toBe(false);
  expect(FooterElement.isFooterElement(true)).toBe(false);
});

it(
  "FooterElement.isFooterElement - 必須プロパティ不足 - falseを返す",
  () => {
    expect(FooterElement.isFooterElement({ type: "element" })).toBe(false);
    expect(FooterElement.isFooterElement({ tagName: "footer" })).toBe(false);
    expect(FooterElement.isFooterElement({})).toBe(false);
  }
);
