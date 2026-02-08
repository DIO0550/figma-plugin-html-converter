/**
 * @fileoverview METER_STATUS_COLORS のテスト
 */

import { expect, test } from "vitest";
import { METER_STATUS_COLORS } from "../progress-meter-colors";
import { expectValidRGBColor } from "./progress-meter-test-helpers";

test("METER_STATUS_COLORS - good色のRGB値 - 0-1の範囲内である", () => {
  expectValidRGBColor(METER_STATUS_COLORS.good);
});

test("METER_STATUS_COLORS - caution色のRGB値 - 0-1の範囲内である", () => {
  expectValidRGBColor(METER_STATUS_COLORS.caution);
});

test("METER_STATUS_COLORS - danger色のRGB値 - 0-1の範囲内である", () => {
  expectValidRGBColor(METER_STATUS_COLORS.danger);
});

test("METER_STATUS_COLORS - good色の確認 - グリーン系の色である", () => {
  expect(METER_STATUS_COLORS.good.g).toBeGreaterThan(
    METER_STATUS_COLORS.good.r,
  );
  expect(METER_STATUS_COLORS.good.g).toBeGreaterThan(
    METER_STATUS_COLORS.good.b,
  );
});

test("METER_STATUS_COLORS - caution色の確認 - イエロー/オレンジ系の色である", () => {
  expect(METER_STATUS_COLORS.caution.r).toBeGreaterThan(
    METER_STATUS_COLORS.caution.b,
  );
  expect(METER_STATUS_COLORS.caution.g).toBeGreaterThan(
    METER_STATUS_COLORS.caution.b,
  );
});

test("METER_STATUS_COLORS - danger色の確認 - レッド系の色である", () => {
  expect(METER_STATUS_COLORS.danger.r).toBeGreaterThan(
    METER_STATUS_COLORS.danger.g,
  );
  expect(METER_STATUS_COLORS.danger.r).toBeGreaterThan(
    METER_STATUS_COLORS.danger.b,
  );
});
