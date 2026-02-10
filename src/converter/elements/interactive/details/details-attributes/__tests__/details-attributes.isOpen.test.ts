import { test, expect } from "vitest";
import type { DetailsAttributes } from "../details-attributes";
import { DetailsAttributes as DetailsAttributesUtil } from "../details-attributes";

test("DetailsAttributes.isOpen - open=true - trueを返す", () => {
  const attrs: DetailsAttributes = { open: true };
  expect(DetailsAttributesUtil.isOpen(attrs)).toBe(true);
});

test("DetailsAttributes.isOpen - open=''（空文字列） - trueを返す", () => {
  const attrs: DetailsAttributes = { open: "" };
  expect(DetailsAttributesUtil.isOpen(attrs)).toBe(true);
});

test("DetailsAttributes.isOpen - open=false - falseを返す", () => {
  const attrs: DetailsAttributes = { open: false };
  expect(DetailsAttributesUtil.isOpen(attrs)).toBe(false);
});

test("DetailsAttributes.isOpen - open属性なし - falseを返す", () => {
  const attrs: DetailsAttributes = {};
  expect(DetailsAttributesUtil.isOpen(attrs)).toBe(false);
});

test("DetailsAttributes.isOpen - open=undefined - falseを返す", () => {
  const attrs: DetailsAttributes = { open: undefined };
  expect(DetailsAttributesUtil.isOpen(attrs)).toBe(false);
});
