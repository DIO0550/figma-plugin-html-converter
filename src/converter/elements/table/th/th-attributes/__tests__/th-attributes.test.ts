/**
 * @fileoverview th-attributes.tsのユニットテスト
 */

import { describe, it, expect } from "vitest";
import type { ThAttributes } from "../th-attributes";

describe("ThAttributes", () => {
  describe("型定義", () => {
    it("GlobalAttributesを拡張している", () => {
      const attrs: ThAttributes = {
        id: "header-1",
        class: "table-header",
        style: "background-color: #f0f0f0;",
      };

      expect(attrs.id).toBe("header-1");
      expect(attrs.class).toBe("table-header");
      expect(attrs.style).toBe("background-color: #f0f0f0;");
    });

    it("width属性を持つことができる", () => {
      const attrs: ThAttributes = {
        width: "100px",
      };

      expect(attrs.width).toBe("100px");
    });

    it("height属性を持つことができる", () => {
      const attrs: ThAttributes = {
        height: "50px",
      };

      expect(attrs.height).toBe("50px");
    });

    it("scope属性を持つことができる", () => {
      const colScope: ThAttributes = { scope: "col" };
      const rowScope: ThAttributes = { scope: "row" };
      const colgroupScope: ThAttributes = { scope: "colgroup" };
      const rowgroupScope: ThAttributes = { scope: "rowgroup" };

      expect(colScope.scope).toBe("col");
      expect(rowScope.scope).toBe("row");
      expect(colgroupScope.scope).toBe("colgroup");
      expect(rowgroupScope.scope).toBe("rowgroup");
    });

    it("abbr属性を持つことができる", () => {
      const attrs: ThAttributes = {
        abbr: "Name",
      };

      expect(attrs.abbr).toBe("Name");
    });

    it("colspan属性を持つことができる", () => {
      const attrs: ThAttributes = {
        colspan: "2",
      };

      expect(attrs.colspan).toBe("2");
    });

    it("rowspan属性を持つことができる", () => {
      const attrs: ThAttributes = {
        rowspan: "3",
      };

      expect(attrs.rowspan).toBe("3");
    });

    it("すべての属性が省略可能である", () => {
      const attrs: ThAttributes = {};

      expect(attrs).toBeDefined();
      expect(Object.keys(attrs).length).toBe(0);
    });

    it("複数の属性を同時に持つことができる", () => {
      const attrs: ThAttributes = {
        scope: "col",
        width: "120px",
        height: "40px",
        abbr: "Full Name",
        colspan: "2",
        style: "font-weight: bold; text-align: center;",
      };

      expect(attrs.scope).toBe("col");
      expect(attrs.width).toBe("120px");
      expect(attrs.height).toBe("40px");
      expect(attrs.abbr).toBe("Full Name");
      expect(attrs.colspan).toBe("2");
      expect(attrs.style).toBe("font-weight: bold; text-align: center;");
    });
  });
});
