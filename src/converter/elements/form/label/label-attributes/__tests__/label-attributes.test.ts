/**
 * @fileoverview label要素の属性のテスト
 */

import { test, expect } from "vitest";
import type { LabelAttributes } from "../label-attributes";

test("LabelAttributes: GlobalAttributesを継承している", () => {
  const attributes: LabelAttributes = {
    id: "test-label",
    class: "form-label",
  };
  expect(attributes.id).toBe("test-label");
  expect(attributes.class).toBe("form-label");
});

test("LabelAttributes: for属性を持つ", () => {
  const attributes: LabelAttributes = {
    for: "email-input",
  };
  expect(attributes.for).toBe("email-input");
});

test("LabelAttributes: すべての属性が省略可能", () => {
  const attributes: LabelAttributes = {};
  expect(attributes).toBeDefined();
});

test("LabelAttributes: form属性を持つ", () => {
  const attributes: LabelAttributes = {
    form: "user-form",
  };
  expect(attributes.form).toBe("user-form");
});

test("LabelAttributes: for属性とその他の属性を同時に持つことができる", () => {
  const attributes: LabelAttributes = {
    for: "email-input",
    id: "email-label",
    class: "label-text",
  };
  expect(attributes.for).toBe("email-input");
  expect(attributes.id).toBe("email-label");
  expect(attributes.class).toBe("label-text");
});
