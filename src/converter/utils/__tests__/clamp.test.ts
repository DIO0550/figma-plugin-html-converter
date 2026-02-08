/**
 * @fileoverview clamp のテスト
 */

import { expect, test } from "vitest";
import { clamp } from "../numeric-helpers";

test("clamp - 値が範囲内の場合 - そのまま返す", () => {
  expect(clamp(5, 0, 10)).toBe(5);
});

test("clamp - 値がminより小さい場合 - minを返す", () => {
  expect(clamp(-5, 0, 10)).toBe(0);
});

test("clamp - 値がmaxより大きい場合 - maxを返す", () => {
  expect(clamp(15, 0, 10)).toBe(10);
});
