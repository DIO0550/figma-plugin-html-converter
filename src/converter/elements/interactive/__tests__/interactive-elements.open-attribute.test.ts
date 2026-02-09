import { test, expect } from "vitest";
import { DetailsAttributes } from "../details";
import { DialogAttributes } from "../dialog";

test("open属性 - 空文字列の場合 - 開いていると判定される", () => {
  const detailsAttrs = { open: "" as const };
  const dialogAttrs = { open: "" as const };

  expect(DetailsAttributes.isOpen(detailsAttrs)).toBe(true);
  expect(DialogAttributes.isOpen(dialogAttrs)).toBe(true);
});

test("open属性 - undefinedの場合 - 閉じていると判定される", () => {
  const detailsAttrs = { open: undefined };
  const dialogAttrs = { open: undefined };

  expect(DetailsAttributes.isOpen(detailsAttrs)).toBe(false);
  expect(DialogAttributes.isOpen(dialogAttrs)).toBe(false);
});
