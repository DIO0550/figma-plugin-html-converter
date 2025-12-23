/**
 * @fileoverview meter要素のファクトリーのテスト
 */

import { expect, test } from "vitest";
import { MeterElement } from "../meter-element";

test("MeterElement.create: デフォルト値でmeter要素を生成できる", () => {
  const element = MeterElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("meter");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("MeterElement.create: 属性を指定して生成できる", () => {
  const element = MeterElement.create({
    value: "0.4",
    max: "1",
    low: "0.2",
  });

  expect(element.attributes.value).toBe("0.4");
  expect(element.attributes.max).toBe("1");
  expect(element.attributes.low).toBe("0.2");
});

test("MeterElement.create: 子要素を指定して生成できる", () => {
  const children = [{ type: "text" as const, textContent: "CPU" }];
  const element = MeterElement.create({}, children);

  expect(element.children).toEqual(children);
});
