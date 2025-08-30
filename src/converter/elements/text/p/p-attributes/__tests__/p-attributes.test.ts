import { describe, it, expect } from "vitest";
import type { PAttributes } from "../p-attributes";

describe("PAttributes", () => {
  describe("基本的な属性定義", () => {
    it("グローバル属性を含むことができる", () => {
      const attributes: PAttributes = {
        id: "paragraph-1",
        class: "text-body",
        style: "color: blue; font-size: 16px;",
        title: "This is a paragraph",
        lang: "ja",
        dir: "ltr",
      };

      expect(attributes.id).toBe("paragraph-1");
      expect(attributes.class).toBe("text-body");
      expect(attributes.style).toBe("color: blue; font-size: 16px;");
      expect(attributes.title).toBe("This is a paragraph");
      expect(attributes.lang).toBe("ja");
      expect(attributes.dir).toBe("ltr");
    });

    it("空の属性オブジェクトを作成できる", () => {
      const attributes: PAttributes = {};
      expect(attributes).toEqual({});
    });

    it("部分的な属性セットを作成できる", () => {
      const attributes: PAttributes = {
        id: "para-1",
        style: "text-align: center;",
      };
      expect(attributes.id).toBe("para-1");
      expect(attributes.style).toBe("text-align: center;");
      expect(attributes.class).toBeUndefined();
    });
  });

  describe("data属性", () => {
    it("カスタムdata属性を含むことができる", () => {
      const attributes: PAttributes = {
        "data-testid": "paragraph-component",
        "data-index": "5",
        "data-visible": "true",
      };

      expect(attributes["data-testid"]).toBe("paragraph-component");
      expect(attributes["data-index"]).toBe("5");
      expect(attributes["data-visible"]).toBe("true");
    });
  });

  describe("aria属性", () => {
    it("アクセシビリティ属性を含むことができる", () => {
      const attributes: PAttributes = {
        "aria-label": "Main paragraph",
        "aria-describedby": "description-1",
        "aria-hidden": "false",
        role: "paragraph",
      };

      expect(attributes["aria-label"]).toBe("Main paragraph");
      expect(attributes["aria-describedby"]).toBe("description-1");
      expect(attributes["aria-hidden"]).toBe("false");
      expect(attributes.role).toBe("paragraph");
    });
  });

  describe("イベントハンドラ属性", () => {
    it("イベントハンドラ属性を含むことができる", () => {
      const attributes: PAttributes = {
        onclick: "handleClick()",
        onmouseover: "handleMouseOver()",
        onmouseout: "handleMouseOut()",
      };

      expect(attributes.onclick).toBe("handleClick()");
      expect(attributes.onmouseover).toBe("handleMouseOver()");
      expect(attributes.onmouseout).toBe("handleMouseOut()");
    });
  });

  describe("型の互換性", () => {
    it("GlobalAttributesと互換性がある", () => {
      const globalAttrs = {
        id: "test",
        class: "test-class",
        style: "color: red;",
      };

      const pAttributes: PAttributes = globalAttrs;
      expect(pAttributes.id).toBe("test");
      expect(pAttributes.class).toBe("test-class");
      expect(pAttributes.style).toBe("color: red;");
    });
  });
});
