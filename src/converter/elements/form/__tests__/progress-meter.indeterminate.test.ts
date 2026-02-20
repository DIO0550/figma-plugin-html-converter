/**
 * @fileoverview progress要素のindeterminate状態テスト
 */

import { test, expect } from "vitest";
import { ProgressElement } from "../progress/progress-element";
import { toFigmaNode as progressToFigmaNode } from "../progress/progress-converter";

test("progress統合 - value属性なし - indeterminate状態を表現する", () => {
  const progress = ProgressElement.create({ max: "100" });
  const node = progressToFigmaNode(progress);

  const fill = node.children?.[1];
  expect(fill?.width).toBe(0);
});

test("progress統合 - value=undefined - indeterminate状態として処理される", () => {
  const progress = ProgressElement.create({});
  const node = progressToFigmaNode(progress);

  const fill = node.children?.[1];
  expect(fill?.width).toBe(0);
});
