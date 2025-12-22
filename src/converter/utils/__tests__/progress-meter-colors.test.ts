/**
 * @fileoverview progress/meter要素のカラー定数のテスト
 */

import { describe, expect, test } from "vitest";
import {
  METER_STATUS_COLORS,
  PROGRESS_FILL_COLOR,
  PROGRESS_METER_TRACK_COLOR,
} from "../progress-meter-colors";

describe("PROGRESS_METER_TRACK_COLOR", () => {
  test("RGB値が0-1の範囲内である", () => {
    expect(PROGRESS_METER_TRACK_COLOR.r).toBeGreaterThanOrEqual(0);
    expect(PROGRESS_METER_TRACK_COLOR.r).toBeLessThanOrEqual(1);
    expect(PROGRESS_METER_TRACK_COLOR.g).toBeGreaterThanOrEqual(0);
    expect(PROGRESS_METER_TRACK_COLOR.g).toBeLessThanOrEqual(1);
    expect(PROGRESS_METER_TRACK_COLOR.b).toBeGreaterThanOrEqual(0);
    expect(PROGRESS_METER_TRACK_COLOR.b).toBeLessThanOrEqual(1);
  });

  test("ライトグレーの色である", () => {
    // 0.92はライトグレー（#EBEBEB相当）
    expect(PROGRESS_METER_TRACK_COLOR.r).toBeCloseTo(0.92);
    expect(PROGRESS_METER_TRACK_COLOR.g).toBeCloseTo(0.92);
    expect(PROGRESS_METER_TRACK_COLOR.b).toBeCloseTo(0.92);
  });
});

describe("PROGRESS_FILL_COLOR", () => {
  test("RGB値が0-1の範囲内である", () => {
    expect(PROGRESS_FILL_COLOR.r).toBeGreaterThanOrEqual(0);
    expect(PROGRESS_FILL_COLOR.r).toBeLessThanOrEqual(1);
    expect(PROGRESS_FILL_COLOR.g).toBeGreaterThanOrEqual(0);
    expect(PROGRESS_FILL_COLOR.g).toBeLessThanOrEqual(1);
    expect(PROGRESS_FILL_COLOR.b).toBeGreaterThanOrEqual(0);
    expect(PROGRESS_FILL_COLOR.b).toBeLessThanOrEqual(1);
  });

  test("ブルー系の色である", () => {
    // bが最も高く、r, gは低め
    expect(PROGRESS_FILL_COLOR.b).toBeGreaterThan(PROGRESS_FILL_COLOR.r);
    expect(PROGRESS_FILL_COLOR.b).toBeGreaterThan(PROGRESS_FILL_COLOR.g);
  });
});

describe("METER_STATUS_COLORS", () => {
  test("good色のRGB値が0-1の範囲内である", () => {
    expect(METER_STATUS_COLORS.good.r).toBeGreaterThanOrEqual(0);
    expect(METER_STATUS_COLORS.good.r).toBeLessThanOrEqual(1);
    expect(METER_STATUS_COLORS.good.g).toBeGreaterThanOrEqual(0);
    expect(METER_STATUS_COLORS.good.g).toBeLessThanOrEqual(1);
    expect(METER_STATUS_COLORS.good.b).toBeGreaterThanOrEqual(0);
    expect(METER_STATUS_COLORS.good.b).toBeLessThanOrEqual(1);
  });

  test("caution色のRGB値が0-1の範囲内である", () => {
    expect(METER_STATUS_COLORS.caution.r).toBeGreaterThanOrEqual(0);
    expect(METER_STATUS_COLORS.caution.r).toBeLessThanOrEqual(1);
    expect(METER_STATUS_COLORS.caution.g).toBeGreaterThanOrEqual(0);
    expect(METER_STATUS_COLORS.caution.g).toBeLessThanOrEqual(1);
    expect(METER_STATUS_COLORS.caution.b).toBeGreaterThanOrEqual(0);
    expect(METER_STATUS_COLORS.caution.b).toBeLessThanOrEqual(1);
  });

  test("danger色のRGB値が0-1の範囲内である", () => {
    expect(METER_STATUS_COLORS.danger.r).toBeGreaterThanOrEqual(0);
    expect(METER_STATUS_COLORS.danger.r).toBeLessThanOrEqual(1);
    expect(METER_STATUS_COLORS.danger.g).toBeGreaterThanOrEqual(0);
    expect(METER_STATUS_COLORS.danger.g).toBeLessThanOrEqual(1);
    expect(METER_STATUS_COLORS.danger.b).toBeGreaterThanOrEqual(0);
    expect(METER_STATUS_COLORS.danger.b).toBeLessThanOrEqual(1);
  });

  test("goodはグリーン系の色である", () => {
    // gが最も高い
    expect(METER_STATUS_COLORS.good.g).toBeGreaterThan(
      METER_STATUS_COLORS.good.r,
    );
    expect(METER_STATUS_COLORS.good.g).toBeGreaterThan(
      METER_STATUS_COLORS.good.b,
    );
  });

  test("cautionはイエロー/オレンジ系の色である", () => {
    // rとgが高く、bが低い
    expect(METER_STATUS_COLORS.caution.r).toBeGreaterThan(
      METER_STATUS_COLORS.caution.b,
    );
    expect(METER_STATUS_COLORS.caution.g).toBeGreaterThan(
      METER_STATUS_COLORS.caution.b,
    );
  });

  test("dangerはレッド系の色である", () => {
    // rが最も高い
    expect(METER_STATUS_COLORS.danger.r).toBeGreaterThan(
      METER_STATUS_COLORS.danger.g,
    );
    expect(METER_STATUS_COLORS.danger.r).toBeGreaterThan(
      METER_STATUS_COLORS.danger.b,
    );
  });
});
