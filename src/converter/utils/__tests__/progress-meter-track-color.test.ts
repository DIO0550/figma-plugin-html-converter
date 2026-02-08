/**
 * @fileoverview PROGRESS_METER_TRACK_COLOR のテスト
 */

import { expect, test } from "vitest";
import { PROGRESS_METER_TRACK_COLOR } from "../progress-meter-colors";
import { expectValidRGBColor } from "./progress-meter-test-helpers";

test("PROGRESS_METER_TRACK_COLOR - RGB値検証 - 0-1の範囲内である", () => {
  expectValidRGBColor(PROGRESS_METER_TRACK_COLOR);
});

test("PROGRESS_METER_TRACK_COLOR - 色の確認 - ライトグレーの色である", () => {
  expect(PROGRESS_METER_TRACK_COLOR.r).toBeCloseTo(0.92);
  expect(PROGRESS_METER_TRACK_COLOR.g).toBeCloseTo(0.92);
  expect(PROGRESS_METER_TRACK_COLOR.b).toBeCloseTo(0.92);
});
