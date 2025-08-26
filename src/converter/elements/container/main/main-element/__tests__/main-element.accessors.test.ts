import { describe, it, expect } from "vitest";
import { MainElement } from "../main-element";
import type { MainElement as MainElementType } from "../main-element";
import type { HTMLNode } from "../../../../../models/html-node";

describe("MainElement アクセサメソッド", () => {
  describe("getId", () => {
    it("id属性を取得できること", () => {
      const element = MainElement.create({ id: "main-content" });
      expect(MainElement.getId(element)).toBe("main-content");
    });

    it("id属性がない場合undefinedを返すこと", () => {
      const element = MainElement.create();
      expect(MainElement.getId(element)).toBeUndefined();
    });
  });

  describe("getClassName", () => {
    it("className属性を取得できること", () => {
      const element = MainElement.create({ className: "main container" });
      expect(MainElement.getClassName(element)).toBe("main container");
    });

    it("className属性がない場合undefinedを返すこと", () => {
      const element = MainElement.create();
      expect(MainElement.getClassName(element)).toBeUndefined();
    });
  });

  describe("getStyle", () => {
    it("style属性を取得できること", () => {
      const element = MainElement.create({ style: "padding: 20px;" });
      expect(MainElement.getStyle(element)).toBe("padding: 20px;");
    });

    it("style属性がない場合undefinedを返すこと", () => {
      const element = MainElement.create();
      expect(MainElement.getStyle(element)).toBeUndefined();
    });
  });

  describe("getAttribute", () => {
    it("任意の属性を取得できること", () => {
      const element = MainElement.create({
        id: "main",
        className: "content",
        title: "メインエリア",
        "data-page": "home",
        "aria-label": "メインコンテンツ",
      });

      expect(MainElement.getAttribute(element, "id")).toBe("main");
      expect(MainElement.getAttribute(element, "className")).toBe("content");
      expect(MainElement.getAttribute(element, "title")).toBe("メインエリア");
      expect(MainElement.getAttribute(element, "data-page")).toBe("home");
      expect(MainElement.getAttribute(element, "aria-label")).toBe(
        "メインコンテンツ",
      );
    });

    it("存在しない属性の場合undefinedを返すこと", () => {
      const element = MainElement.create({ id: "main" });
      expect(MainElement.getAttribute(element, "className")).toBeUndefined();
      expect(MainElement.getAttribute(element, "style")).toBeUndefined();
      expect(MainElement.getAttribute(element, "data-test")).toBeUndefined();
    });
  });

  describe("getChildren", () => {
    it("子要素を取得できること", () => {
      const children: HTMLNode[] = [
        { type: "text", content: "テキスト" },
        {
          type: "element",
          tagName: "section",
          attributes: {},
          children: [],
        },
      ];
      const element = MainElement.create({}, children);
      expect(MainElement.getChildren(element)).toEqual(children);
    });

    it("子要素がない場合空配列を返すこと", () => {
      const element = MainElement.create();
      expect(MainElement.getChildren(element)).toEqual([]);
    });

    it("子要素が明示的にundefinedの場合undefinedを返すこと", () => {
      const element: MainElementType = {
        type: "element",
        tagName: "main",
        attributes: {},
        children: undefined,
      };
      expect(MainElement.getChildren(element)).toBeUndefined();
    });
  });

  describe("hasAttribute", () => {
    it("属性が存在する場合trueを返すこと", () => {
      const element = MainElement.create({
        id: "main",
        className: "content",
        style: "padding: 20px;",
        "data-page": "home",
      });

      expect(MainElement.hasAttribute(element, "id")).toBe(true);
      expect(MainElement.hasAttribute(element, "className")).toBe(true);
      expect(MainElement.hasAttribute(element, "style")).toBe(true);
      expect(MainElement.hasAttribute(element, "data-page")).toBe(true);
    });

    it("属性が存在しない場合falseを返すこと", () => {
      const element = MainElement.create({ id: "main" });

      expect(MainElement.hasAttribute(element, "className")).toBe(false);
      expect(MainElement.hasAttribute(element, "style")).toBe(false);
      expect(MainElement.hasAttribute(element, "title")).toBe(false);
      expect(MainElement.hasAttribute(element, "data-test")).toBe(false);
    });

    it("値がundefinedでも属性キーが存在すればtrueを返すこと", () => {
      const element = MainElement.create({
        id: undefined as unknown as string,
      });

      expect(MainElement.hasAttribute(element, "id")).toBe(true);
    });
  });
});
