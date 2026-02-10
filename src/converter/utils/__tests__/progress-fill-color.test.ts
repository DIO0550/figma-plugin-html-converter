/**
 * @fileoverview PROGRESS_FILL_COLOR のテスト
 */

import { expect, test } from "vitest";
import { PROGRESS_FILL_COLOR } from "../progress-meter-colors";
import { expectValidRGBColor } from "./progress-meter-test-helpers";

test("PROGRESS_FILL_COLOR - RGB値検証 - 0-1の範囲内である", () => {
  expectValidRGBColor(PROGRESS_FILL_COLOR);
});

test("PROGRESS_FILL_COLOR - 色の確認 - ブルー系の色である", () => {
  expect(PROGRESS_FILL_COLOR.b).toBeGreaterThan(PROGRESS_FILL_COLOR.r);
  expect(PROGRESS_FILL_COLOR.b).toBeGreaterThan(PROGRESS_FILL_COLOR.g);
});
