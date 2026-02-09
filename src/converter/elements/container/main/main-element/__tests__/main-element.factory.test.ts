import { it, expect } from "vitest";
import { MainElement } from "../main-element";
import type { MainAttributes } from "../../main-attributes";
import type { HTMLNode } from "../../../../../models/html-node";

it(
  "MainElement.create - 属性なし - デフォルトのmain要素を作成する",
  () => {
    const element = MainElement.create();

    expect(element).toEqual({
      type: "element",
      tagName: "main",
      attributes: {},
      children: [],
    });
  }
);

it("MainElement.create - 属性あり - main要素を作成する", () => {
  const attributes: Partial<MainAttributes> = {
    id: "main-content",
    className: "main container",
    style: "padding: 20px;",
  };

  const element = MainElement.create(attributes);

  expect(element).toEqual({
    type: "element",
    tagName: "main",
    attributes,
    children: [],
  });
});

it("MainElement.create - 子要素あり - childrenを設定する", () => {
  const children: HTMLNode[] = [
    {
      type: "element",
      tagName: "h1",
      attributes: {},
      children: [{ type: "text", content: "タイトル" }],
    },
    {
      type: "element",
      tagName: "p",
      attributes: {},
      children: [{ type: "text", content: "本文" }],
    },
  ];

  const element = MainElement.create({}, children);

  expect(element).toEqual({
    type: "element",
    tagName: "main",
    attributes: {},
    children,
  });
});

it(
  "MainElement.create - 属性と子要素あり - 両方を設定する",
  () => {
    const attributes: Partial<MainAttributes> = {
      id: "content",
      className: "main-area",
    };
    const children: HTMLNode[] = [
      {
        type: "element",
        tagName: "section",
        attributes: { id: "intro" },
        children: [],
      },
    ];

    const element = MainElement.create(attributes, children);

    expect(element).toEqual({
      type: "element",
      tagName: "main",
      attributes,
      children,
    });
  }
);

it("MainElement.create - グローバル属性あり - 属性を保持する", () => {
  const attributes: Partial<MainAttributes> = {
    id: "main",
    className: "content",
    title: "メインエリア",
    lang: "ja",
    dir: "ltr",
    hidden: false,
    tabindex: -1,
    accesskey: "m",
    contenteditable: "false",
    spellcheck: false,
    draggable: false,
    translate: "yes",
  };

  const element = MainElement.create(attributes);

  expect(element.attributes).toEqual(attributes);
});

it("MainElement.create - data属性あり - 属性を保持する", () => {
  const attributes: Partial<MainAttributes> = {
    "data-page": "home",
    "data-section": "main",
    "data-theme": "light",
  };

  const element = MainElement.create(attributes);

  expect(element.attributes).toEqual(attributes);
});

it("MainElement.create - aria属性あり - 属性を保持する", () => {
  const attributes: Partial<MainAttributes> = {
    "aria-label": "メインコンテンツ",
    "aria-labelledby": "main-heading",
    "aria-describedby": "main-description",
  };

  const element = MainElement.create(attributes);

  expect(element.attributes).toEqual(attributes);
});
