/**
 * @fileoverview option要素の属性のテスト
 */

import { test, expect } from "vitest";
import type { OptionAttributes } from "../option-attributes";

test("OptionAttributes: GlobalAttributesを継承している", () => {
  const attributes: OptionAttributes = {
    id: "test-option",
    class: "option-item",
  };
  expect(attributes.id).toBe("test-option");
  expect(attributes.class).toBe("option-item");
});

test("OptionAttributes: option固有の属性を持つ", () => {
  const attributes: OptionAttributes = {
    value: "us",
    selected: "selected",
    disabled: "disabled",
    label: "United States",
  };
  expect(attributes.value).toBe("us");
  expect(attributes.selected).toBe("selected");
  expect(attributes.disabled).toBe("disabled");
  expect(attributes.label).toBe("United States");
});

test("OptionAttributes: すべての属性が省略可能", () => {
  const attributes: OptionAttributes = {};
  expect(attributes).toBeDefined();
});

test("OptionAttributes: value属性のみを持つことができる", () => {
  const attributes: OptionAttributes = {
    value: "jp",
  };
  expect(attributes.value).toBe("jp");
});

test("OptionAttributes: selected属性のみを持つことができる", () => {
  const attributes: OptionAttributes = {
    selected: "selected",
  };
  expect(attributes.selected).toBe("selected");
});

test("OptionAttributes: label属性のみを持つことができる", () => {
  const attributes: OptionAttributes = {
    label: "Japan",
  };
  expect(attributes.label).toBe("Japan");
});
