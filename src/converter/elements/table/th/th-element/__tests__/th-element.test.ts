/**
 * @fileoverview th-element.tsのユニットテスト
 */

import { describe, it, expect } from "vitest";
import { ThElement } from "../th-element";
import type { ThAttributes } from "../../th-attributes";

describe("ThElement", () => {
  describe("型ガード: isThElement", () => {
    it("正しいThElementを識別できる", () => {
      const validNode = {
        type: "element",
        tagName: "th",
        attributes: {},
        children: [],
      };

      expect(ThElement.isThElement(validNode)).toBe(true);
    });

    it("属性を持つThElementを識別できる", () => {
      const validNode = {
        type: "element",
        tagName: "th",
        attributes: { scope: "col", width: "100px" },
        children: [],
      };

      expect(ThElement.isThElement(validNode)).toBe(true);
    });

    it("間違ったtagNameを拒否する", () => {
      const invalidNode = {
        type: "element",
        tagName: "td",
        attributes: {},
        children: [],
      };

      expect(ThElement.isThElement(invalidNode)).toBe(false);
    });

    it("間違ったtypeを拒否する", () => {
      const invalidNode = {
        type: "text",
        tagName: "th",
        attributes: {},
        children: [],
      };

      expect(ThElement.isThElement(invalidNode)).toBe(false);
    });

    it("nullを拒否する", () => {
      expect(ThElement.isThElement(null)).toBe(false);
    });

    it("undefinedを拒否する", () => {
      expect(ThElement.isThElement(undefined)).toBe(false);
    });

    it("文字列を拒否する", () => {
      expect(ThElement.isThElement("th")).toBe(false);
    });

    it("数値を拒否する", () => {
      expect(ThElement.isThElement(123)).toBe(false);
    });

    it("空オブジェクトを拒否する", () => {
      expect(ThElement.isThElement({})).toBe(false);
    });

    it("typeプロパティがないオブジェクトを拒否する", () => {
      const invalidNode = {
        tagName: "th",
        attributes: {},
        children: [],
      };

      expect(ThElement.isThElement(invalidNode)).toBe(false);
    });

    it("tagNameプロパティがないオブジェクトを拒否する", () => {
      const invalidNode = {
        type: "element",
        attributes: {},
        children: [],
      };

      expect(ThElement.isThElement(invalidNode)).toBe(false);
    });
  });

  describe("ファクトリメソッド: create", () => {
    it("属性なしでThElementを作成できる", () => {
      const element = ThElement.create();

      expect(element.type).toBe("element");
      expect(element.tagName).toBe("th");
      expect(element.attributes).toEqual({});
      expect(element.children).toEqual([]);
    });

    it("属性を指定してThElementを作成できる", () => {
      const attrs: Partial<ThAttributes> = {
        scope: "col",
        width: "100px",
      };

      const element = ThElement.create(attrs);

      expect(element.type).toBe("element");
      expect(element.tagName).toBe("th");
      expect(element.attributes.scope).toBe("col");
      expect(element.attributes.width).toBe("100px");
      expect(element.children).toEqual([]);
    });

    it("すべての属性を指定してThElementを作成できる", () => {
      const attrs: Partial<ThAttributes> = {
        scope: "row",
        width: "120px",
        height: "40px",
        abbr: "Name",
        colspan: "2",
        rowspan: "1",
        style: "background-color: #f0f0f0;",
        class: "header-cell",
        id: "header-1",
      };

      const element = ThElement.create(attrs);

      expect(element.attributes.scope).toBe("row");
      expect(element.attributes.width).toBe("120px");
      expect(element.attributes.height).toBe("40px");
      expect(element.attributes.abbr).toBe("Name");
      expect(element.attributes.colspan).toBe("2");
      expect(element.attributes.rowspan).toBe("1");
      expect(element.attributes.style).toBe("background-color: #f0f0f0;");
      expect(element.attributes.class).toBe("header-cell");
      expect(element.attributes.id).toBe("header-1");
    });

    it("作成したThElementは型ガードを通過する", () => {
      const element = ThElement.create({ scope: "col" });

      expect(ThElement.isThElement(element)).toBe(true);
    });

    it("元の属性オブジェクトを変更しても作成したThElementに影響しない", () => {
      const attrs = { scope: "col" as const };
      const element = ThElement.create(attrs);

      // @ts-expect-error - テストのため意図的に変更
      attrs.scope = "row";

      // 元のattrsを変更してもelementは影響を受けない
      expect(element.attributes.scope).toBe("col");
    });
  });
});
