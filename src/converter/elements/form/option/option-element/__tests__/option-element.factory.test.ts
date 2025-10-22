/**
 * @fileoverview option要素のファクトリー関数のテスト
 */

import { test, expect } from "vitest";
import { OptionElement } from "../option-element";

test("OptionElement.create: デフォルト値でoption要素を作成できる", () => {
  const element = OptionElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("option");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("OptionElement.create: 属性を指定してoption要素を作成できる", () => {
  const attributes = {
    value: "us",
    label: "United States",
  };
  const element = OptionElement.create(attributes);

  expect(element.attributes).toEqual(attributes);
});

test("OptionElement.create: 子要素を指定してoption要素を作成できる", () => {
  const children = [{ type: "text" as const, textContent: "United States" }];
  const element = OptionElement.create({}, children);

  expect(element.children).toEqual(children);
});

test("OptionElement.create: 属性と子要素の両方を指定してoption要素を作成できる", () => {
  const attributes = { value: "us" };
  const children = [{ type: "text" as const, textContent: "United States" }];
  const element = OptionElement.create(attributes, children);

  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual(children);
});

test("OptionElement.create: selected属性付きのoption要素を作成できる", () => {
  const element = OptionElement.create({ selected: "selected" });

  expect(element.attributes.selected).toBe("selected");
});

test("OptionElement.create: disabled属性付きのoption要素を作成できる", () => {
  const element = OptionElement.create({ disabled: "disabled" });

  expect(element.attributes.disabled).toBe("disabled");
});
