/**
 * @fileoverview meter要素の属性定義のテスト
 */

import { expect, test } from "vitest";
import type { MeterAttributes } from "../meter-attributes";

test("MeterAttributes: GlobalAttributesを継承している", () => {
  const attributes: MeterAttributes = {
    id: "meter-id",
    class: "meter-class",
    style: "width: 180px;",
  };

  expect(attributes.id).toBe("meter-id");
  expect(attributes.class).toBe("meter-class");
  expect(attributes.style).toBe("width: 180px;");
});

test("MeterAttributes: 値関連の属性を持つ", () => {
  const attributes: MeterAttributes = {
    value: "0.6",
    min: "0",
    max: "1",
    low: "0.2",
    high: "0.8",
    optimum: "0.7",
  };

  expect(attributes.value).toBe("0.6");
  expect(attributes.min).toBe("0");
  expect(attributes.max).toBe("1");
  expect(attributes.low).toBe("0.2");
  expect(attributes.high).toBe("0.8");
  expect(attributes.optimum).toBe("0.7");
});

test("MeterAttributes: 数値型の属性も受け付ける", () => {
  const attributes: MeterAttributes = {
    value: 40,
    min: 0,
    max: 100,
    low: 30,
    high: 80,
    optimum: 70,
  };

  expect(attributes.value).toBe(40);
  expect(attributes.min).toBe(0);
  expect(attributes.max).toBe(100);
  expect(attributes.low).toBe(30);
  expect(attributes.high).toBe(80);
  expect(attributes.optimum).toBe(70);
});

test("MeterAttributes: すべての属性が省略可能", () => {
  const attributes: MeterAttributes = {};

  expect(attributes).toBeDefined();
});
