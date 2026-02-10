import { test, expect } from "vitest";
import type { DialogAttributes } from "../dialog-attributes";

test("DialogAttributes - GlobalAttributesを継承している", () => {
  const attrs: DialogAttributes = {
    id: "test-dialog",
    class: "modal",
    style: "background: white;",
  };

  expect(attrs.id).toBe("test-dialog");
  expect(attrs.class).toBe("modal");
  expect(attrs.style).toBe("background: white;");
});

test("DialogAttributes - open属性true - 持つことができる", () => {
  const attrs: DialogAttributes = {
    open: true,
  };

  expect(attrs.open).toBe(true);
});

test("DialogAttributes - open属性false - 持つことができる", () => {
  const attrs: DialogAttributes = {
    open: false,
  };

  expect(attrs.open).toBe(false);
});

test("DialogAttributes - open属性空文字列 - HTML属性の存在を表す", () => {
  const attrs: DialogAttributes = {
    open: "",
  };

  expect(attrs.open).toBe("");
});

test("DialogAttributes - 空のオブジェクト - 有効", () => {
  const attrs: DialogAttributes = {};
  expect(attrs).toEqual({});
});
