import { describe, test, expect } from "vitest";
import type { DialogAttributes } from "../dialog-attributes";
import { DialogAttributes as DialogAttributesUtil } from "../dialog-attributes";

describe("DialogAttributes", () => {
  describe("型定義", () => {
    test("GlobalAttributesを継承している", () => {
      const attrs: DialogAttributes = {
        id: "test-dialog",
        class: "modal",
        style: "background: white;",
      };

      expect(attrs.id).toBe("test-dialog");
      expect(attrs.class).toBe("modal");
      expect(attrs.style).toBe("background: white;");
    });

    test("open属性を持つことができる", () => {
      const attrs: DialogAttributes = {
        open: true,
      };

      expect(attrs.open).toBe(true);
    });

    test("open属性がfalseの場合", () => {
      const attrs: DialogAttributes = {
        open: false,
      };

      expect(attrs.open).toBe(false);
    });

    test("open属性が空文字列の場合（HTML属性の存在を表す）", () => {
      const attrs: DialogAttributes = {
        open: "",
      };

      expect(attrs.open).toBe("");
    });

    test("空のオブジェクトも有効", () => {
      const attrs: DialogAttributes = {};
      expect(attrs).toEqual({});
    });
  });

  describe("isOpen", () => {
    test("open=trueの場合、trueを返す", () => {
      const attrs: DialogAttributes = { open: true };
      expect(DialogAttributesUtil.isOpen(attrs)).toBe(true);
    });

    test("open=''（空文字列）の場合、trueを返す", () => {
      const attrs: DialogAttributes = { open: "" };
      expect(DialogAttributesUtil.isOpen(attrs)).toBe(true);
    });

    test("open=falseの場合、falseを返す", () => {
      const attrs: DialogAttributes = { open: false };
      expect(DialogAttributesUtil.isOpen(attrs)).toBe(false);
    });

    test("open属性がない場合、falseを返す", () => {
      const attrs: DialogAttributes = {};
      expect(DialogAttributesUtil.isOpen(attrs)).toBe(false);
    });

    test("open=undefinedの場合、falseを返す", () => {
      const attrs: DialogAttributes = { open: undefined };
      expect(DialogAttributesUtil.isOpen(attrs)).toBe(false);
    });
  });
});
