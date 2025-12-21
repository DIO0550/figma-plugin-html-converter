/**
 * @fileoverview progress要素の属性定義のテスト
 */

import { expect, test } from "vitest";
import type { ProgressAttributes } from "../progress-attributes";

test("ProgressAttributes: GlobalAttributesを継承している", () => {
  const attributes: ProgressAttributes = {
    id: "progress-id",
    class: "progress-class",
    style: "width: 200px;",
  };

  expect(attributes.id).toBe("progress-id");
  expect(attributes.class).toBe("progress-class");
  expect(attributes.style).toBe("width: 200px;");
});

test("ProgressAttributes: value/maxを持つ", () => {
  const attributes: ProgressAttributes = {
    value: "30",
    max: "120",
  };

  expect(attributes.value).toBe("30");
  expect(attributes.max).toBe("120");
});

test("ProgressAttributes: 数値型のvalue/maxも受け付ける", () => {
  const attributes: ProgressAttributes = {
    value: 10,
    max: 50,
  };

  expect(attributes.value).toBe(10);
  expect(attributes.max).toBe(50);
});

test("ProgressAttributes: すべての属性が省略可能", () => {
  const attributes: ProgressAttributes = {};

  expect(attributes).toBeDefined();
});
