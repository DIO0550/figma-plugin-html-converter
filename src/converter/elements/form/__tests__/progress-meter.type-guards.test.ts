/**
 * @fileoverview progress/meter要素の型ガード統合テスト
 */

import { test, expect } from "vitest";
import { ProgressElement } from "../progress/progress-element";
import { MeterElement } from "../meter/meter-element";

test("progress/meter統合 - 型ガード - 異なる要素を正しく区別できる", () => {
  const progress = ProgressElement.create();
  const meter = MeterElement.create({ value: 50, max: 100 });

  expect(ProgressElement.isProgressElement(progress)).toBe(true);
  expect(ProgressElement.isProgressElement(meter)).toBe(false);

  expect(MeterElement.isMeterElement(progress)).toBe(false);
  expect(MeterElement.isMeterElement(meter)).toBe(true);
});
