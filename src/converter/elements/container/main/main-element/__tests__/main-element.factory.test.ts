import { describe, it, expect } from "vitest";
import { MainElement } from "../main-element";
import type { MainAttributes } from "../../main-attributes";
import type { HTMLNode } from "../../../../../models/html-node";

describe("MainElement.create", () => {
  it("デフォルトのmain要素を作成できること", () => {
    const element = MainElement.create();

    expect(element).toEqual({
      type: "element",
      tagName: "main",
      attributes: {},
      children: [],
    });
  });

  it("属性を指定してmain要素を作成できること", () => {
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

  it("子要素を指定してmain要素を作成できること", () => {
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

  it("属性と子要素を同時に指定してmain要素を作成できること", () => {
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
  });

  it("グローバル属性を設定できること", () => {
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

  it("data-*属性を設定できること", () => {
    const attributes: Partial<MainAttributes> = {
      "data-page": "home",
      "data-section": "main",
      "data-theme": "light",
    };

    const element = MainElement.create(attributes);

    expect(element.attributes).toEqual(attributes);
  });

  it("aria-*属性を設定できること", () => {
    const attributes: Partial<MainAttributes> = {
      "aria-label": "メインコンテンツ",
      "aria-labelledby": "main-heading",
      "aria-describedby": "main-description",
    };

    const element = MainElement.create(attributes);

    expect(element.attributes).toEqual(attributes);
  });
});
