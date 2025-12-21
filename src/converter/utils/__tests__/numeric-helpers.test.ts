/**
 * @fileoverview numeric-helpers のテスト
 */

import { describe, expect, test } from "vitest";
import {
  clamp,
  parseNumericOrNull,
  parseNumericWithFallback,
} from "../numeric-helpers";

describe("clamp", () => {
  test("値が範囲内の場合はそのまま返す", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  test("値がminより小さい場合はminを返す", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  test("値がmaxより大きい場合はmaxを返す", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe("parseNumericWithFallback", () => {
  test("数値を返す", () => {
    expect(parseNumericWithFallback(42, 0)).toBe(42);
  });

  test("文字列の数値をパースする", () => {
    expect(parseNumericWithFallback("42.5", 0)).toBe(42.5);
  });

  test("非数値文字列はフォールバックを返す", () => {
    expect(parseNumericWithFallback("abc", 99)).toBe(99);
  });

  test("undefinedはフォールバックを返す", () => {
    expect(parseNumericWithFallback(undefined, 10)).toBe(10);
  });

  test("Infinityはフォールバックを返す", () => {
    expect(parseNumericWithFallback(Infinity, 5)).toBe(5);
  });
});

describe("parseNumericOrNull", () => {
  test("数値を返す", () => {
    expect(parseNumericOrNull(42)).toBe(42);
  });

  test("文字列の数値をパースする", () => {
    expect(parseNumericOrNull("42.5")).toBe(42.5);
  });

  test("非数値文字列はnullを返す", () => {
    expect(parseNumericOrNull("abc")).toBeNull();
  });

  test("undefinedはnullを返す", () => {
    expect(parseNumericOrNull(undefined)).toBeNull();
  });

  test("Infinityはnullを返す", () => {
    expect(parseNumericOrNull(Infinity)).toBeNull();
  });
});
