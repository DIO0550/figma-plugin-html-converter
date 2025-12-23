/**
 * @fileoverview progress/meter要素のカラー定数のテスト
 */

import { describe, expect, test } from "vitest";
import type { FigmaRGBColor } from "../progress-meter-colors";
import {
  METER_STATUS_COLORS,
  PROGRESS_FILL_COLOR,
  PROGRESS_METER_TRACK_COLOR,
} from "../progress-meter-colors";

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

describe("PROGRESS_METER_TRACK_COLOR", () => {
  test("RGB値が0-1の範囲内である", () => {
    expectValidRGBColor(PROGRESS_METER_TRACK_COLOR);
  });

  test("ライトグレーの色である", () => {
    expect(PROGRESS_METER_TRACK_COLOR.r).toBeCloseTo(0.92);
    expect(PROGRESS_METER_TRACK_COLOR.g).toBeCloseTo(0.92);
    expect(PROGRESS_METER_TRACK_COLOR.b).toBeCloseTo(0.92);
  });
});

describe("PROGRESS_FILL_COLOR", () => {
  test("RGB値が0-1の範囲内である", () => {
    expectValidRGBColor(PROGRESS_FILL_COLOR);
  });

  test("ブルー系の色である", () => {
    expect(PROGRESS_FILL_COLOR.b).toBeGreaterThan(PROGRESS_FILL_COLOR.r);
    expect(PROGRESS_FILL_COLOR.b).toBeGreaterThan(PROGRESS_FILL_COLOR.g);
  });
});

describe("METER_STATUS_COLORS", () => {
  test("good色のRGB値が0-1の範囲内である", () => {
    expectValidRGBColor(METER_STATUS_COLORS.good);
  });

  test("caution色のRGB値が0-1の範囲内である", () => {
    expectValidRGBColor(METER_STATUS_COLORS.caution);
  });

  test("danger色のRGB値が0-1の範囲内である", () => {
    expectValidRGBColor(METER_STATUS_COLORS.danger);
  });

  test("goodはグリーン系の色である", () => {
    expect(METER_STATUS_COLORS.good.g).toBeGreaterThan(
      METER_STATUS_COLORS.good.r,
    );
    expect(METER_STATUS_COLORS.good.g).toBeGreaterThan(
      METER_STATUS_COLORS.good.b,
    );
  });

  test("cautionはイエロー/オレンジ系の色である", () => {
    expect(METER_STATUS_COLORS.caution.r).toBeGreaterThan(
      METER_STATUS_COLORS.caution.b,
    );
    expect(METER_STATUS_COLORS.caution.g).toBeGreaterThan(
      METER_STATUS_COLORS.caution.b,
    );
  });

  test("dangerはレッド系の色である", () => {
    expect(METER_STATUS_COLORS.danger.r).toBeGreaterThan(
      METER_STATUS_COLORS.danger.g,
    );
    expect(METER_STATUS_COLORS.danger.r).toBeGreaterThan(
      METER_STATUS_COLORS.danger.b,
    );
  });
});
