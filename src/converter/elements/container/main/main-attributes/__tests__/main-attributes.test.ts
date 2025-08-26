import { describe, it, expect } from "vitest";
import type { MainAttributes } from "../main-attributes";
import type { GlobalAttributes } from "../../../../base/global-attributes";

describe("MainAttributes", () => {
  it("GlobalAttributesを継承していること", () => {
    const attributes: MainAttributes = {
      id: "main-content",
      className: "main-container",
      style: "display: flex;",
    };

    const globalAttributes: GlobalAttributes = attributes;
    expect(globalAttributes).toBe(attributes);
  });

  it("main要素固有の属性がないこと", () => {
    const attributes: MainAttributes = {};
    expect(Object.keys(attributes)).toHaveLength(0);
  });

  it("グローバル属性を設定できること", () => {
    const attributes: MainAttributes = {
      id: "main",
      className: "content",
      style: "padding: 20px;",
      title: "メインコンテンツ",
      lang: "ja",
      dir: "ltr",
      hidden: false,
      tabindex: 0,
      accesskey: "m",
      contenteditable: "false",
      spellcheck: false,
      draggable: false,
      translate: "yes",
    };

    expect(attributes.id).toBe("main");
    expect(attributes.className).toBe("content");
    expect(attributes.style).toBe("padding: 20px;");
    expect(attributes.title).toBe("メインコンテンツ");
    expect(attributes.lang).toBe("ja");
    expect(attributes.dir).toBe("ltr");
    expect(attributes.hidden).toBe(false);
    expect(attributes.tabindex).toBe(0);
    expect(attributes.accesskey).toBe("m");
    expect(attributes.contenteditable).toBe("false");
    expect(attributes.spellcheck).toBe(false);
    expect(attributes.draggable).toBe(false);
    expect(attributes.translate).toBe("yes");
  });

  it("data-*属性を設定できること", () => {
    const attributes: MainAttributes = {
      "data-page": "home",
      "data-section": "main",
    };

    expect(attributes["data-page"]).toBe("home");
    expect(attributes["data-section"]).toBe("main");
  });

  it("aria-*属性を設定できること", () => {
    const attributes: MainAttributes = {
      "aria-label": "メインコンテンツエリア",
      "aria-hidden": "false",
      "aria-live": "polite",
    };

    expect(attributes["aria-label"]).toBe("メインコンテンツエリア");
    expect(attributes["aria-hidden"]).toBe("false");
    expect(attributes["aria-live"]).toBe("polite");
  });
});
