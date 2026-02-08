/**
 * @fileoverview parseNumericWithFallback のテスト
 */

import { expect, test } from "vitest";
import { parseNumericWithFallback } from "../numeric-helpers";

test("parseNumericWithFallback - 数値 - 数値を返す", () => {
  expect(parseNumericWithFallback(42, 0)).toBe(42);
});

test("parseNumericWithFallback - 文字列の数値 - パースする", () => {
  expect(parseNumericWithFallback("42.5", 0)).toBe(42.5);
});

test("parseNumericWithFallback - 非数値文字列 - フォールバックを返す", () => {
  expect(parseNumericWithFallback("abc", 99)).toBe(99);
});

test("parseNumericWithFallback - undefined - フォールバックを返す", () => {
  expect(parseNumericWithFallback(undefined, 10)).toBe(10);
});

test("parseNumericWithFallback - Infinity - フォールバックを返す", () => {
  expect(parseNumericWithFallback(Infinity, 5)).toBe(5);
});

test("parseNumericWithFallback - NaN - フォールバックを返す", () => {
  expect(parseNumericWithFallback(NaN, 7)).toBe(7);
});

test("parseNumericWithFallback - -Infinity - フォールバックを返す", () => {
  expect(parseNumericWithFallback(-Infinity, 3)).toBe(3);
});
