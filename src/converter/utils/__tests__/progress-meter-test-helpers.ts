/**
 * @fileoverview progress/meter テスト用ヘルパー関数
 */

import { expect } from "vitest";
import type { FigmaRGBColor } from "../progress-meter-colors";

/**
 * RGB値が0-1の有効範囲内であることを検証するヘルパー関数
 */
export function expectValidRGBColor(color: FigmaRGBColor): void {
  expect(color.r).toBeGreaterThanOrEqual(0);
  expect(color.r).toBeLessThanOrEqual(1);
  expect(color.g).toBeGreaterThanOrEqual(0);
  expect(color.g).toBeLessThanOrEqual(1);
  expect(color.b).toBeGreaterThanOrEqual(0);
  expect(color.b).toBeLessThanOrEqual(1);
}
