/**
 * @fileoverview parseNumericOrNull のテスト
 */

import { expect, test } from "vitest";
import { parseNumericOrNull } from "../numeric-helpers";

test("parseNumericOrNull - 数値 - 数値を返す", () => {
  expect(parseNumericOrNull(42)).toBe(42);
});

test("parseNumericOrNull - 文字列の数値 - パースする", () => {
  expect(parseNumericOrNull("42.5")).toBe(42.5);
});

test("parseNumericOrNull - 非数値文字列 - nullを返す", () => {
  expect(parseNumericOrNull("abc")).toBeNull();
});

test("parseNumericOrNull - undefined - nullを返す", () => {
  expect(parseNumericOrNull(undefined)).toBeNull();
});

test("parseNumericOrNull - Infinity - nullを返す", () => {
  expect(parseNumericOrNull(Infinity)).toBeNull();
});

test("parseNumericOrNull - NaN - nullを返す", () => {
  expect(parseNumericOrNull(NaN)).toBeNull();
});

test("parseNumericOrNull - -Infinity - nullを返す", () => {
  expect(parseNumericOrNull(-Infinity)).toBeNull();
});
