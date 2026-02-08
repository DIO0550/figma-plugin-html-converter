/**
 * @fileoverview PROGRESS_METER_TRACK_COLOR のテスト
 */

import { expect, test } from "vitest";
import type { FigmaRGBColor } from "../progress-meter-colors";
import { PROGRESS_METER_TRACK_COLOR } from "../progress-meter-colors";

/**
 * RGB値が0-1の有効範囲内であることを検証するヘルパー関数
 */
function expectValidRGBColor(color: FigmaRGBColor): void {
  expect(color.r).toBeGreaterThanOrEqual(0);
  expect(color.r).toBeLessThanOrEqual(1);
  expect(color.g).toBeGreaterThanOrEqual(0);
  expect(color.g).toBeLessThanOrEqual(1);
  expect(color.b).toBeGreaterThanOrEqual(0);
  expect(color.b).toBeLessThanOrEqual(1);
}

test("PROGRESS_METER_TRACK_COLOR - RGB値検証 - 0-1の範囲内である", () => {
  expectValidRGBColor(PROGRESS_METER_TRACK_COLOR);
});

test("PROGRESS_METER_TRACK_COLOR - 色の確認 - ライトグレーの色である", () => {
  expect(PROGRESS_METER_TRACK_COLOR.r).toBeCloseTo(0.92);
  expect(PROGRESS_METER_TRACK_COLOR.g).toBeCloseTo(0.92);
  expect(PROGRESS_METER_TRACK_COLOR.b).toBeCloseTo(0.92);
});
