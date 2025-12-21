/**
 * @fileoverview meter要素のコンバーターのテスト
 */

import { expect, test } from "vitest";
import { MeterElement } from "../../meter-element";
import { mapToFigma, toFigmaNode } from "../meter-converter";

test("toFigmaNode: 基本的なmeterを生成し、比率で幅を決定する", () => {
  const element = MeterElement.create({ value: 50, min: 0, max: 100 });
  const config = toFigmaNode(element);

  expect(config.name).toBe("meter");
  expect(config.children?.length).toBe(2);

  const [track, fill] = config.children!;
  expect(track.width).toBe(200);
  expect(fill.width).toBeCloseTo(100); // 50%
  expect(fill.fills?.[0]?.color.r).toBeCloseTo(0.95); // cautionカラー
});

test("toFigmaNode: 低い値はdangerカラーになる", () => {
  const element = MeterElement.create({
    value: 10,
    min: 0,
    max: 100,
    low: 30,
    high: 80,
    optimum: 100,
  });
  const config = toFigmaNode(element);

  const fill = config.children?.[1];
  expect(fill?.fills?.[0]?.color.r).toBeCloseTo(0.9);
  expect(fill?.fills?.[0]?.color.g).toBeCloseTo(0.3);
});

test("toFigmaNode: optimumがlow以下の場合は低い値がgoodカラーになる", () => {
  const element = MeterElement.create({
    value: 20,
    min: 0,
    max: 100,
    low: 30,
    high: 80,
    optimum: 10,
  });
  const config = toFigmaNode(element);

  const fill = config.children?.[1];
  expect(fill?.fills?.[0]?.color.g).toBeCloseTo(0.7);
});

test("toFigmaNode: maxを超える値はクランプされる", () => {
  const element = MeterElement.create({ value: 150, min: 0, max: 100 });
  const config = toFigmaNode(element);

  const [track, fill] = config.children!;
  expect(fill.width).toBe(track.width);
});

test("toFigmaNode: optimumがlowとhighの間にある場合、範囲内はgood", () => {
  const element = MeterElement.create({
    value: 50,
    min: 0,
    max: 100,
    low: 30,
    high: 70,
    optimum: 50,
  });
  const config = toFigmaNode(element);

  const fill = config.children?.[1];
  // optimumが中間にある場合、low〜high範囲内はgood
  expect(fill?.fills?.[0]?.color.g).toBeCloseTo(0.7);
});

test("toFigmaNode: optimumがlowとhighの間で範囲外はdanger", () => {
  const element = MeterElement.create({
    value: 90,
    min: 0,
    max: 100,
    low: 30,
    high: 70,
    optimum: 50,
  });
  const config = toFigmaNode(element);

  const fill = config.children?.[1];
  // optimumが中間にある場合、low〜high範囲外はdanger
  expect(fill?.fills?.[0]?.color.r).toBeCloseTo(0.9);
  expect(fill?.fills?.[0]?.color.g).toBeCloseTo(0.3);
});

test("toFigmaNode: optimum未指定でvalue >= highはgood", () => {
  const element = MeterElement.create({
    value: 85,
    min: 0,
    max: 100,
    low: 25,
    high: 75,
  });
  const config = toFigmaNode(element);

  const fill = config.children?.[1];
  expect(fill?.fills?.[0]?.color.g).toBeCloseTo(0.7);
});

test("toFigmaNode: optimum未指定でlow <= value < highはcaution", () => {
  const element = MeterElement.create({
    value: 50,
    min: 0,
    max: 100,
    low: 25,
    high: 75,
  });
  const config = toFigmaNode(element);

  const fill = config.children?.[1];
  expect(fill?.fills?.[0]?.color.r).toBeCloseTo(0.95);
  expect(fill?.fills?.[0]?.color.g).toBeCloseTo(0.76);
});

test("toFigmaNode: max <= minの場合はmax = min + 1に補正される", () => {
  const element = MeterElement.create({
    value: 5,
    min: 10,
    max: 5,
  });
  const config = toFigmaNode(element);

  // max = min + 1 = 11 に補正され、value = 10（min）にクランプ
  // ratio = 0
  const fill = config.children?.[1];
  expect(fill?.width).toBe(0);
});

test("toFigmaNode: cornerRadiusは高さの半分になる", () => {
  const element = MeterElement.create({
    value: 50,
    max: 100,
    style: "height: 16px;",
  });
  const config = toFigmaNode(element);

  const [track, fill] = config.children!;
  expect(track.cornerRadius).toBe(8);
  expect(fill.cornerRadius).toBe(8);
});

test("toFigmaNode: value省略時はminにフォールバックしfill幅が0になる", () => {
  const element = MeterElement.create({ min: 0, max: 100 });
  const config = toFigmaNode(element);

  const fill = config.children?.[1];
  expect(fill?.width).toBe(0);
});

test("mapToFigma: meter要素を変換し、その他はnullを返す", () => {
  const node = {
    type: "element" as const,
    tagName: "meter" as const,
    attributes: { value: "0.6", min: "0", max: "1" },
  };

  expect(mapToFigma(node)).not.toBeNull();
  expect(mapToFigma({ type: "element", tagName: "div" })).toBeNull();
});
