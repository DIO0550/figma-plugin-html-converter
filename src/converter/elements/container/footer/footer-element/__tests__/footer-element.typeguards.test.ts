import { describe, it, expect } from "vitest";
import { FooterElement } from "../footer-element";

describe("FooterElement.isFooterElement", () => {
  it("正しいfooter要素を判定できること", () => {
    const element = {
      type: "element",
      tagName: "footer",
      attributes: {},
    };

    expect(FooterElement.isFooterElement(element)).toBe(true);
  });

  it("属性と子要素を持つfooter要素を判定できること", () => {
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
  });

  it("typeが異なる場合はfalseを返すこと", () => {
    const element = {
      type: "text",
      tagName: "footer",
      attributes: {},
    };

    expect(FooterElement.isFooterElement(element)).toBe(false);
  });

  it("tagNameが異なる場合はfalseを返すこと", () => {
    const element = {
      type: "element",
      tagName: "div",
      attributes: {},
    };

    expect(FooterElement.isFooterElement(element)).toBe(false);
  });

  it("nullの場合はfalseを返すこと", () => {
    expect(FooterElement.isFooterElement(null)).toBe(false);
  });

  it("undefinedの場合はfalseを返すこと", () => {
    expect(FooterElement.isFooterElement(undefined)).toBe(false);
  });

  it("オブジェクトでない場合はfalseを返すこと", () => {
    expect(FooterElement.isFooterElement("footer")).toBe(false);
    expect(FooterElement.isFooterElement(123)).toBe(false);
    expect(FooterElement.isFooterElement(true)).toBe(false);
  });

  it("必須プロパティが欠けている場合はfalseを返すこと", () => {
    expect(FooterElement.isFooterElement({ type: "element" })).toBe(false);
    expect(FooterElement.isFooterElement({ tagName: "footer" })).toBe(false);
    expect(FooterElement.isFooterElement({})).toBe(false);
  });
});
