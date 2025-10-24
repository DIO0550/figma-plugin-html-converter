/**
 * @fileoverview fieldset要素の属性のテスト
 */

import { test, expect } from "vitest";
import type { FieldsetAttributes } from "../fieldset-attributes";

test("FieldsetAttributes: GlobalAttributesを継承している", () => {
  const attributes: FieldsetAttributes = {
    id: "test-fieldset",
    class: "form-group",
  };
  expect(attributes.id).toBe("test-fieldset");
  expect(attributes.class).toBe("form-group");
});

test("FieldsetAttributes: disabled属性を持つ", () => {
  const attributes: FieldsetAttributes = {
    disabled: true,
  };
  expect(attributes.disabled).toBe(true);
});

test("FieldsetAttributes: form属性を持つ", () => {
  const attributes: FieldsetAttributes = {
    form: "user-form",
  };
  expect(attributes.form).toBe("user-form");
});

test("FieldsetAttributes: name属性を持つ", () => {
  const attributes: FieldsetAttributes = {
    name: "contact-info",
  };
  expect(attributes.name).toBe("contact-info");
});

test("FieldsetAttributes: すべての属性が省略可能", () => {
  const attributes: FieldsetAttributes = {};
  expect(attributes).toBeDefined();
});

test("FieldsetAttributes: 複数の属性を同時に持つことができる", () => {
  const attributes: FieldsetAttributes = {
    id: "personal-info",
    class: "fieldset-container",
    name: "personal",
    form: "registration-form",
    disabled: false,
  };
  expect(attributes.id).toBe("personal-info");
  expect(attributes.class).toBe("fieldset-container");
  expect(attributes.name).toBe("personal");
  expect(attributes.form).toBe("registration-form");
  expect(attributes.disabled).toBe(false);
});
