import { it, expect } from "vitest";
import { FooterElement } from "../footer-element";
import type { FooterAttributes } from "../../footer-attributes";
import type { HTMLNode } from "../../../../../models/html-node";

it(
  "FooterElement.create - 属性なし - デフォルトのfooter要素を作成する",
  () => {
    const element = FooterElement.create();

    expect(element).toEqual({
      type: "element",
      tagName: "footer",
      attributes: {},
      children: [],
    });
  }
);

it("FooterElement.create - 属性あり - footer要素を作成する", () => {
  const attributes: Partial<FooterAttributes> = {
    id: "page-footer",
    className: "footer container",
    style: "background-color: #f5f5f5;",
  };

  const element = FooterElement.create(attributes);

  expect(element).toEqual({
    type: "element",
    tagName: "footer",
    attributes,
    children: [],
  });
});

it("FooterElement.create - 子要素あり - childrenを設定する", () => {
  const children: HTMLNode[] = [
    {
      type: "element",
      tagName: "p",
      attributes: {},
      children: [{ type: "text", content: "© 2024 Company" }],
    },
    {
      type: "element",
      tagName: "nav",
      attributes: {},
      children: [],
    },
  ];

  const element = FooterElement.create({}, children);

  expect(element).toEqual({
    type: "element",
    tagName: "footer",
    attributes: {},
    children,
  });
});

it(
  "FooterElement.create - 属性と子要素あり - 両方を設定する",
  () => {
    const attributes: Partial<FooterAttributes> = {
      id: "site-footer",
      className: "footer-area",
    };
    const children: HTMLNode[] = [
      {
        type: "element",
        tagName: "div",
        attributes: { className: "footer-content" },
        children: [],
      },
    ];

    const element = FooterElement.create(attributes, children);

    expect(element).toEqual({
      type: "element",
      tagName: "footer",
      attributes,
      children,
    });
  }
);

it(
  "FooterElement.create - グローバル属性あり - 属性を保持する",
  () => {
    const attributes: Partial<FooterAttributes> = {
      id: "footer",
      className: "site-footer",
      title: "フッターエリア",
      lang: "ja",
      dir: "ltr",
      hidden: false,
      tabindex: -1,
      accesskey: "f",
      contenteditable: "false",
      spellcheck: false,
      draggable: false,
      translate: "yes",
    };

    const element = FooterElement.create(attributes);

    expect(element.attributes).toEqual(attributes);
  }
);

it("FooterElement.create - data属性あり - 属性を保持する", () => {
  const attributes: Partial<FooterAttributes> = {
    "data-section": "footer",
    "data-theme": "dark",
    "data-year": "2024",
  };

  const element = FooterElement.create(attributes);

  expect(element.attributes).toEqual(attributes);
});

it("FooterElement.create - aria属性あり - 属性を保持する", () => {
  const attributes: Partial<FooterAttributes> = {
    "aria-label": "ページフッター",
    "aria-labelledby": "footer-heading",
    "aria-describedby": "footer-description",
  };

  const element = FooterElement.create(attributes);

  expect(element.attributes).toEqual(attributes);
});
