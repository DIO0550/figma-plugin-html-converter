/**
 * @fileoverview progress/meter要素のHTMLノードマッピング統合テスト
 */

import { test, expect } from "vitest";
import { mapToFigma as mapProgressToFigma } from "../progress/progress-converter";
import { mapToFigma as mapMeterToFigma } from "../meter/meter-converter";

test("progress/meter統合 - progress HTMLノードマッピング - 正しくマッピングできる", () => {
  const progressHtml = {
    type: "element" as const,
    tagName: "progress" as const,
    attributes: { value: "30", max: "100" },
    children: [],
  };

  const node = mapProgressToFigma(progressHtml);

  expect(node).not.toBeNull();
  expect(node?.name).toBe("progress");
  expect(node?.children?.length).toBe(2);
});

test("progress/meter統合 - meter HTMLノードマッピング - 正しくマッピングできる", () => {
  const meterHtml = {
    type: "element" as const,
    tagName: "meter" as const,
    attributes: { value: "0.6", min: "0", max: "1" },
    children: [],
  };

  const node = mapMeterToFigma(meterHtml);

  expect(node).not.toBeNull();
  expect(node?.name).toBe("meter");
  expect(node?.children?.length).toBe(2);
});

test("progress/meter統合 - 異なるタグ名の要素 - nullを返す", () => {
  const divHtml = {
    type: "element" as const,
    tagName: "div" as const,
    attributes: {},
    children: [],
  };

  expect(mapProgressToFigma(divHtml)).toBeNull();
  expect(mapMeterToFigma(divHtml)).toBeNull();
});
