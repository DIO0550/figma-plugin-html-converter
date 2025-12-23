/**
 * @fileoverview progress要素のファクトリーのテスト
 */

import { expect, test } from "vitest";
import { ProgressElement } from "../progress-element";

test("ProgressElement.create: デフォルト値でprogress要素を生成できる", () => {
  const element = ProgressElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("progress");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("ProgressElement.create: 属性を指定して生成できる", () => {
  const element = ProgressElement.create({ value: "40", max: "80" });

  expect(element.attributes.value).toBe("40");
  expect(element.attributes.max).toBe("80");
});

test("ProgressElement.create: 子要素を指定して生成できる", () => {
  const children = [{ type: "text" as const, textContent: "loading..." }];
  const element = ProgressElement.create({}, children);

  expect(element.children).toEqual(children);
});
