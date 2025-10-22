/**
 * @fileoverview select要素のファクトリー関数のテスト
 */

import { test, expect } from "vitest";
import { SelectElement } from "../select-element";

test("SelectElement.create: デフォルト値でselect要素を作成できる", () => {
  const element = SelectElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("select");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("SelectElement.create: 属性を指定してselect要素を作成できる", () => {
  const attributes = {
    name: "country",
    id: "country-select",
  };
  const element = SelectElement.create(attributes);

  expect(element.attributes).toEqual(attributes);
});

test("SelectElement.create: 子要素を指定してselect要素を作成できる", () => {
  const children = [
    {
      type: "element" as const,
      tagName: "option" as const,
      attributes: { value: "us" },
    },
  ];
  const element = SelectElement.create({}, children);

  expect(element.children).toEqual(children);
});

test("SelectElement.create: 属性と子要素の両方を指定してselect要素を作成できる", () => {
  const attributes = { name: "country" };
  const children = [
    {
      type: "element" as const,
      tagName: "option" as const,
      attributes: { value: "us" },
    },
  ];
  const element = SelectElement.create(attributes, children);

  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual(children);
});

test("SelectElement.create: multiple属性付きのselect要素を作成できる", () => {
  const element = SelectElement.create({ multiple: "multiple" });

  expect(element.attributes.multiple).toBe("multiple");
});

test("SelectElement.create: disabled属性付きのselect要素を作成できる", () => {
  const element = SelectElement.create({ disabled: "disabled" });

  expect(element.attributes.disabled).toBe("disabled");
});
