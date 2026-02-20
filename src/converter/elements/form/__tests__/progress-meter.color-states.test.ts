/**
 * @fileoverview meter要素のlow/high/optimum属性の色状態判定テスト
 */

import { test, expect } from "vitest";
import { MeterElement } from "../meter/meter-element";
import { toFigmaNode as meterToFigmaNode } from "../meter/meter-converter";

test("meter統合 - optimumがhigh以上でvalue高い - good(緑)を表示する", () => {
  const meter = MeterElement.create({
    value: 90,
    min: 0,
    max: 100,
    low: 30,
    high: 70,
    optimum: 100,
  });
  const node = meterToFigmaNode(meter);

  const fill = node.children?.[1];
  // good = green (r: 0.2, g: 0.7, b: 0.2)
  expect(fill?.fills?.[0]?.color.g).toBeCloseTo(0.7);
});

test("meter統合 - optimumがlow以下でvalue低い - good(緑)を表示する", () => {
  const meter = MeterElement.create({
    value: 10,
    min: 0,
    max: 100,
    low: 30,
    high: 70,
    optimum: 0,
  });
  const node = meterToFigmaNode(meter);

  const fill = node.children?.[1];
  // good = green (r: 0.2, g: 0.7, b: 0.2)
  expect(fill?.fills?.[0]?.color.g).toBeCloseTo(0.7);
});

test("meter統合 - optimumがlowとhighの間でvalue範囲内 - good(緑)を表示する", () => {
  const meter = MeterElement.create({
    value: 50,
    min: 0,
    max: 100,
    low: 30,
    high: 70,
    optimum: 50,
  });
  const node = meterToFigmaNode(meter);

  const fill = node.children?.[1];
  // good = green (r: 0.2, g: 0.7, b: 0.2)
  expect(fill?.fills?.[0]?.color.g).toBeCloseTo(0.7);
});

test("meter統合 - optimum未指定でvalue >= high - good(緑)を表示する", () => {
  const meter = MeterElement.create({
    value: 80,
    min: 0,
    max: 100,
    low: 25,
    high: 75,
  });
  const node = meterToFigmaNode(meter);

  const fill = node.children?.[1];
  // good = green (r: 0.2, g: 0.7, b: 0.2)
  expect(fill?.fills?.[0]?.color.g).toBeCloseTo(0.7);
});

test("meter統合 - optimum未指定でlow <= value < high - caution(黄)を表示する", () => {
  const meter = MeterElement.create({
    value: 50,
    min: 0,
    max: 100,
    low: 25,
    high: 75,
  });
  const node = meterToFigmaNode(meter);

  const fill = node.children?.[1];
  // caution = yellow (r: 0.95, g: 0.76, b: 0.2)
  expect(fill?.fills?.[0]?.color.r).toBeCloseTo(0.95);
});

test("meter統合 - optimum未指定でvalue < low - danger(赤)を表示する", () => {
  const meter = MeterElement.create({
    value: 10,
    min: 0,
    max: 100,
    low: 25,
    high: 75,
  });
  const node = meterToFigmaNode(meter);

  const fill = node.children?.[1];
  // danger = red (r: 0.9, g: 0.3, b: 0.3)
  expect(fill?.fills?.[0]?.color.r).toBeCloseTo(0.9);
  expect(fill?.fills?.[0]?.color.g).toBeCloseTo(0.3);
});
