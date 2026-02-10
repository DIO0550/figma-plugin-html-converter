import { test, expect } from "vitest";
import type { DialogAttributes } from "../dialog-attributes";
import { DialogAttributes as DialogAttributesUtil } from "../dialog-attributes";

test("DialogAttributes.isOpen - open=true - trueを返す", () => {
  const attrs: DialogAttributes = { open: true };
  expect(DialogAttributesUtil.isOpen(attrs)).toBe(true);
});

test("DialogAttributes.isOpen - open=''（空文字列） - trueを返す", () => {
  const attrs: DialogAttributes = { open: "" };
  expect(DialogAttributesUtil.isOpen(attrs)).toBe(true);
});

test("DialogAttributes.isOpen - open=false - falseを返す", () => {
  const attrs: DialogAttributes = { open: false };
  expect(DialogAttributesUtil.isOpen(attrs)).toBe(false);
});

test("DialogAttributes.isOpen - open属性なし - falseを返す", () => {
  const attrs: DialogAttributes = {};
  expect(DialogAttributesUtil.isOpen(attrs)).toBe(false);
});

test("DialogAttributes.isOpen - open=undefined - falseを返す", () => {
  const attrs: DialogAttributes = { open: undefined };
  expect(DialogAttributesUtil.isOpen(attrs)).toBe(false);
});
