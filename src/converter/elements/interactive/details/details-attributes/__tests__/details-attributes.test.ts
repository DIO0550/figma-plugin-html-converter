import { describe, test, expect } from "vitest";
import type { DetailsAttributes } from "../details-attributes";
import { DetailsAttributes as DetailsAttributesUtil } from "../details-attributes";

describe("DetailsAttributes", () => {
  describe("型定義", () => {
    test("GlobalAttributesを継承している", () => {
      const attrs: DetailsAttributes = {
        id: "test-details",
        class: "details-class",
        style: "border: 1px solid #ccc;",
      };

      expect(attrs.id).toBe("test-details");
      expect(attrs.class).toBe("details-class");
      expect(attrs.style).toBe("border: 1px solid #ccc;");
    });

    test("open属性を持つことができる", () => {
      const attrs: DetailsAttributes = {
        open: true,
      };

      expect(attrs.open).toBe(true);
    });

    test("open属性がfalseの場合", () => {
      const attrs: DetailsAttributes = {
        open: false,
      };

      expect(attrs.open).toBe(false);
    });

    test("open属性が空文字列の場合（HTML属性の存在を表す）", () => {
      const attrs: DetailsAttributes = {
        open: "",
      };

      expect(attrs.open).toBe("");
    });

    test("空のオブジェクトも有効", () => {
      const attrs: DetailsAttributes = {};
      expect(attrs).toEqual({});
    });
  });

  describe("isOpen", () => {
    test("open=trueの場合、trueを返す", () => {
      const attrs: DetailsAttributes = { open: true };
      expect(DetailsAttributesUtil.isOpen(attrs)).toBe(true);
    });

    test("open=''（空文字列）の場合、trueを返す", () => {
      const attrs: DetailsAttributes = { open: "" };
      expect(DetailsAttributesUtil.isOpen(attrs)).toBe(true);
    });

    test("open=falseの場合、falseを返す", () => {
      const attrs: DetailsAttributes = { open: false };
      expect(DetailsAttributesUtil.isOpen(attrs)).toBe(false);
    });

    test("open属性がない場合、falseを返す", () => {
      const attrs: DetailsAttributes = {};
      expect(DetailsAttributesUtil.isOpen(attrs)).toBe(false);
    });

    test("open=undefinedの場合、falseを返す", () => {
      const attrs: DetailsAttributes = { open: undefined };
      expect(DetailsAttributesUtil.isOpen(attrs)).toBe(false);
    });
  });
});
