/**
 * @fileoverview progress要素のコンバーターのテスト
 */

import { expect, test } from "vitest";
import { ProgressElement } from "../../progress-element";
import { mapToFigma, toFigmaNode } from "../progress-converter";

test("toFigmaNode: デフォルトでトラックとフィルを生成する", () => {
  const element = ProgressElement.create();
  const config = toFigmaNode(element);

  expect(config.name).toBe("progress");
  expect(config.children?.length).toBe(2);

  const [track, fill] = config.children!;
  expect(track.width).toBe(200);
  expect(track.height).toBe(12);
  expect(fill.width).toBe(0);
});

test("toFigmaNode: value/maxに応じて塗りつぶし幅を計算する", () => {
  const element = ProgressElement.create({ value: "50", max: "100" });
  const config = toFigmaNode(element);

  const [track, fill] = config.children!;
  expect(track.width).toBe(200);
  expect(fill.width).toBeCloseTo(100);
});

test("toFigmaNode: valueがmaxを超える場合は最大幅でクランプする", () => {
  const element = ProgressElement.create({ value: "150", max: "100" });
  const config = toFigmaNode(element);

  const [track, fill] = config.children!;
  expect(fill.width).toBe(track.width);
});

test("toFigmaNode: id/classからノード名を付与する", () => {
  const withId = ProgressElement.create({ id: "download" });
  expect(toFigmaNode(withId).name).toBe("progress#download");

  const withClass = ProgressElement.create({ class: "primary loading" });
  expect(toFigmaNode(withClass).name).toBe("progress.primary.loading");
});

test("toFigmaNode: styleのwidth/heightを反映する", () => {
  const element = ProgressElement.create({
    style: "width: 300px; height: 8px;",
  });
  const config = toFigmaNode(element);

  const [track, fill] = config.children!;
  expect(config.width).toBe(300);
  expect(config.height).toBe(8);
  expect(track.width).toBe(300);
  expect(track.height).toBe(8);
  expect(fill.height).toBe(8);
});

test("toFigmaNode: value未設定（indeterminate状態）ではfill幅が0になる", () => {
  // value属性なし = indeterminate状態
  const element = ProgressElement.create({ max: "100" });
  const config = toFigmaNode(element);

  const fill = config.children?.[1];
  expect(fill?.width).toBe(0);
});

test("toFigmaNode: value=undefinedでもindeterminate状態として処理される", () => {
  const element = ProgressElement.create({});
  const config = toFigmaNode(element);

  const fill = config.children?.[1];
  expect(fill?.width).toBe(0);
});

test("toFigmaNode: cornerRadiusは高さの半分になる", () => {
  const element = ProgressElement.create({ style: "height: 20px;" });
  const config = toFigmaNode(element);

  const [track, fill] = config.children!;
  expect(track.cornerRadius).toBe(10);
  expect(fill.cornerRadius).toBe(10);
});

test("mapToFigma: progress要素を変換し、その他はnullを返す", () => {
  const node = {
    type: "element" as const,
    tagName: "progress" as const,
    attributes: { value: "30", max: "60" },
  };

  expect(mapToFigma(node)).not.toBeNull();
  expect(mapToFigma({ type: "element", tagName: "div" })).toBeNull();
});
