import { test, expect } from "vitest";
import { TableElement } from "../table-element";

test("正常なTableElementに対してtrueを返す", () => {
  const table = TableElement.create();
  expect(TableElement.isTableElement(table)).toBe(true);
});

test("nullに対してfalseを返す", () => {
  expect(TableElement.isTableElement(null)).toBe(false);
});

test("他の要素に対してfalseを返す", () => {
  const div = { type: "element", tagName: "div" };
  expect(TableElement.isTableElement(div)).toBe(false);
});

test("不完全なオブジェクトに対してfalseを返す", () => {
  const invalid = { type: "element" };
  expect(TableElement.isTableElement(invalid)).toBe(false);
});
