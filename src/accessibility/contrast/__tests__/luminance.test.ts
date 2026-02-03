import { test, expect } from "vitest";
import { calculateRelativeLuminance, srgbToLinear } from "../luminance";

// =============================================================================
// sRGB → リニアRGB変換
// =============================================================================

test("srgbToLinear: 0の場合0を返す", () => {
  expect(srgbToLinear(0)).toBe(0);
});

test("srgbToLinear: 1の場合1を返す", () => {
  expect(srgbToLinear(1)).toBeCloseTo(1);
});

test("srgbToLinear: 閾値以下の値を正しく変換する", () => {
  // 0.04045 / 12.92 = 0.003130804953560372
  expect(srgbToLinear(0.04045)).toBeCloseTo(0.003130804953560372);
});

test("srgbToLinear: 閾値以上の値を正しく変換する", () => {
  // ((0.5 + 0.055) / 1.055) ^ 2.4 ≈ 0.2140
  expect(srgbToLinear(0.5)).toBeCloseTo(0.214, 3);
});

// =============================================================================
// 相対輝度計算
// =============================================================================

test("白の相対輝度は1.0", () => {
  expect(calculateRelativeLuminance({ r: 1, g: 1, b: 1 })).toBeCloseTo(1.0);
});

test("黒の相対輝度は0.0", () => {
  expect(calculateRelativeLuminance({ r: 0, g: 0, b: 0 })).toBe(0);
});

test("赤の相対輝度を正しく計算する", () => {
  // 0.2126 * 1.0 + 0.7152 * 0 + 0.0722 * 0 = 0.2126
  expect(calculateRelativeLuminance({ r: 1, g: 0, b: 0 })).toBeCloseTo(0.2126);
});

test("緑の相対輝度を正しく計算する", () => {
  // 0.2126 * 0 + 0.7152 * 1.0 + 0.0722 * 0 = 0.7152
  expect(calculateRelativeLuminance({ r: 0, g: 1, b: 0 })).toBeCloseTo(0.7152);
});

test("青の相対輝度を正しく計算する", () => {
  // 0.2126 * 0 + 0.7152 * 0 + 0.0722 * 1.0 = 0.0722
  expect(calculateRelativeLuminance({ r: 0, g: 0, b: 1 })).toBeCloseTo(0.0722);
});

test("中間グレーの相対輝度を正しく計算する", () => {
  // sRGB 0.5 → リニア ≈ 0.2140
  // L = 0.2126 * 0.2140 + 0.7152 * 0.2140 + 0.0722 * 0.2140 ≈ 0.2140
  const luminance = calculateRelativeLuminance({ r: 0.5, g: 0.5, b: 0.5 });
  expect(luminance).toBeCloseTo(0.214, 3);
});
