/**
 * @fileoverview progress/meter要素の共通スタイル統合テスト
 */

import { test, expect } from "vitest";
import { ProgressElement } from "../progress/progress-element";
import { MeterElement } from "../meter/meter-element";
import { toFigmaNode as progressToFigmaNode } from "../progress/progress-converter";
import { toFigmaNode as meterToFigmaNode } from "../meter/meter-converter";

test("progress/meter統合 - 両要素 - トラックとフィルの2つの子要素を持つ", () => {
  const progress = ProgressElement.create({ value: "50", max: "100" });
  const meter = MeterElement.create({ value: 50, max: 100 });

  const progressNode = progressToFigmaNode(progress);
  const meterNode = meterToFigmaNode(meter);

  expect(progressNode.children?.length).toBe(2);
  expect(meterNode.children?.length).toBe(2);

  expect(progressNode.children?.[0]?.name).toBe("progress-track");
  expect(progressNode.children?.[1]?.name).toBe("progress-fill");
  expect(meterNode.children?.[0]?.name).toBe("meter-track");
  expect(meterNode.children?.[1]?.name).toBe("meter-fill");
});

test("progress/meter統合 - 両要素のデフォルトサイズ - 200x12である", () => {
  const progress = ProgressElement.create();
  const meter = MeterElement.create({ value: 50, max: 100 });

  const progressNode = progressToFigmaNode(progress);
  const meterNode = meterToFigmaNode(meter);

  expect(progressNode.width).toBe(200);
  expect(progressNode.height).toBe(12);
  expect(meterNode.width).toBe(200);
  expect(meterNode.height).toBe(12);
});

test("progress/meter統合 - 両要素のcornerRadius - 高さの半分である", () => {
  const progress = ProgressElement.create({ style: "height: 20px;" });
  const meter = MeterElement.create({
    value: 50,
    max: 100,
    style: "height: 20px;",
  });

  const progressNode = progressToFigmaNode(progress);
  const meterNode = meterToFigmaNode(meter);

  expect(progressNode.children?.[0]?.cornerRadius).toBe(10);
  expect(meterNode.children?.[0]?.cornerRadius).toBe(10);
});
