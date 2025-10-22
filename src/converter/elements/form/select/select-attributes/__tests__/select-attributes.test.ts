/**
 * @fileoverview select要素の属性のテスト
 */

import { test, expect } from "vitest";
import type { SelectAttributes } from "../select-attributes";

test("SelectAttributes: GlobalAttributesを継承している", () => {
  const attributes: SelectAttributes = {
    id: "test-select",
    class: "form-select",
  };
  expect(attributes.id).toBe("test-select");
  expect(attributes.class).toBe("form-select");
});

test("SelectAttributes: select固有の属性を持つ", () => {
  const attributes: SelectAttributes = {
    name: "country",
    multiple: "multiple",
    size: "5",
    disabled: "disabled",
    required: "required",
  };
  expect(attributes.name).toBe("country");
  expect(attributes.multiple).toBe("multiple");
  expect(attributes.size).toBe("5");
  expect(attributes.disabled).toBe("disabled");
  expect(attributes.required).toBe("required");
});

test("SelectAttributes: すべての属性が省略可能", () => {
  const attributes: SelectAttributes = {};
  expect(attributes).toBeDefined();
});

test("SelectAttributes: autocomplete属性を持つ", () => {
  const attributes: SelectAttributes = {
    autocomplete: "on",
  };
  expect(attributes.autocomplete).toBe("on");
});

test("SelectAttributes: autofocus属性を持つ", () => {
  const attributes: SelectAttributes = {
    autofocus: "autofocus",
  };
  expect(attributes.autofocus).toBe("autofocus");
});

test("SelectAttributes: form属性を持つ", () => {
  const attributes: SelectAttributes = {
    form: "user-form",
  };
  expect(attributes.form).toBe("user-form");
});
