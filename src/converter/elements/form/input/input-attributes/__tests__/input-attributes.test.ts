/**
 * @fileoverview input要素の属性のテスト
 */

import { test, expect } from "vitest";
import type { InputAttributes } from "../input-attributes";

// 型定義のテスト

test("InputAttributes: GlobalAttributesを継承している", () => {
  const attributes: InputAttributes = {
    id: "test-input",
    class: "input-field",
    style: "color: red;",
  };

  // GlobalAttributesのプロパティが使用できることを確認
  expect(attributes.id).toBe("test-input");
  expect(attributes.class).toBe("input-field");
  expect(attributes.style).toBe("color: red;");
});

test("InputAttributes: type属性を持つ", () => {
  const attributes: InputAttributes = {
    type: "text",
  };

  expect(attributes.type).toBe("text");
});

test("InputAttributes: name属性を持つ", () => {
  const attributes: InputAttributes = {
    name: "username",
  };

  expect(attributes.name).toBe("username");
});

test("InputAttributes: value属性を持つ", () => {
  const attributes: InputAttributes = {
    value: "initial value",
  };

  expect(attributes.value).toBe("initial value");
});

test("InputAttributes: placeholder属性を持つ", () => {
  const attributes: InputAttributes = {
    placeholder: "Enter your name",
  };

  expect(attributes.placeholder).toBe("Enter your name");
});

test("InputAttributes: required属性を持つ", () => {
  const attributes: InputAttributes = {
    required: "required",
  };

  expect(attributes.required).toBe("required");
});

test("InputAttributes: disabled属性を持つ", () => {
  const attributes: InputAttributes = {
    disabled: "disabled",
  };

  expect(attributes.disabled).toBe("disabled");
});

test("InputAttributes: readonly属性を持つ", () => {
  const attributes: InputAttributes = {
    readonly: "readonly",
  };

  expect(attributes.readonly).toBe("readonly");
});

test("InputAttributes: checked属性を持つ（checkbox/radio用）", () => {
  const attributes: InputAttributes = {
    type: "checkbox",
    checked: "checked",
  };

  expect(attributes.checked).toBe("checked");
});

test("InputAttributes: min属性を持つ（number/date用）", () => {
  const attributes: InputAttributes = {
    type: "number",
    min: "0",
  };

  expect(attributes.min).toBe("0");
});

test("InputAttributes: max属性を持つ（number/date用）", () => {
  const attributes: InputAttributes = {
    type: "number",
    max: "100",
  };

  expect(attributes.max).toBe("100");
});

test("InputAttributes: step属性を持つ（number/range用）", () => {
  const attributes: InputAttributes = {
    type: "number",
    step: "0.1",
  };

  expect(attributes.step).toBe("0.1");
});

test("InputAttributes: pattern属性を持つ（text用）", () => {
  const attributes: InputAttributes = {
    type: "text",
    pattern: "[0-9]{3}-[0-9]{4}",
  };

  expect(attributes.pattern).toBe("[0-9]{3}-[0-9]{4}");
});

test("InputAttributes: maxlength属性を持つ", () => {
  const attributes: InputAttributes = {
    maxlength: "100",
  };

  expect(attributes.maxlength).toBe("100");
});

test("InputAttributes: accept属性を持つ（file用）", () => {
  const attributes: InputAttributes = {
    type: "file",
    accept: "image/*",
  };

  expect(attributes.accept).toBe("image/*");
});

test("InputAttributes: 複数の属性を同時に持つことができる", () => {
  const attributes: InputAttributes = {
    type: "email",
    name: "email",
    value: "test@example.com",
    placeholder: "Enter your email",
    required: "required",
    id: "email-input",
    class: "form-input",
  };

  expect(attributes.type).toBe("email");
  expect(attributes.name).toBe("email");
  expect(attributes.value).toBe("test@example.com");
  expect(attributes.placeholder).toBe("Enter your email");
  expect(attributes.required).toBe("required");
  expect(attributes.id).toBe("email-input");
  expect(attributes.class).toBe("form-input");
});

test("InputAttributes: すべての属性が省略可能", () => {
  const attributes: InputAttributes = {};

  // エラーなくコンパイルできることを確認
  expect(attributes).toBeDefined();
});

// InputTypeのテスト

test("InputType: text型が使用できる", () => {
  const attributes: InputAttributes = { type: "text" };
  expect(attributes.type).toBe("text");
});

test("InputType: password型が使用できる", () => {
  const attributes: InputAttributes = { type: "password" };
  expect(attributes.type).toBe("password");
});

test("InputType: email型が使用できる", () => {
  const attributes: InputAttributes = { type: "email" };
  expect(attributes.type).toBe("email");
});

test("InputType: number型が使用できる", () => {
  const attributes: InputAttributes = { type: "number" };
  expect(attributes.type).toBe("number");
});

test("InputType: checkbox型が使用できる", () => {
  const attributes: InputAttributes = { type: "checkbox" };
  expect(attributes.type).toBe("checkbox");
});

test("InputType: radio型が使用できる", () => {
  const attributes: InputAttributes = { type: "radio" };
  expect(attributes.type).toBe("radio");
});

test("InputType: file型が使用できる", () => {
  const attributes: InputAttributes = { type: "file" };
  expect(attributes.type).toBe("file");
});

test("InputType: date型が使用できる", () => {
  const attributes: InputAttributes = { type: "date" };
  expect(attributes.type).toBe("date");
});

test("InputType: range型が使用できる", () => {
  const attributes: InputAttributes = { type: "range" };
  expect(attributes.type).toBe("range");
});

test("InputType: color型が使用できる", () => {
  const attributes: InputAttributes = { type: "color" };
  expect(attributes.type).toBe("color");
});

test("InputType: search型が使用できる", () => {
  const attributes: InputAttributes = { type: "search" };
  expect(attributes.type).toBe("search");
});

test("InputType: submit型が使用できる", () => {
  const attributes: InputAttributes = { type: "submit" };
  expect(attributes.type).toBe("submit");
});

test("InputType: button型が使用できる", () => {
  const attributes: InputAttributes = { type: "button" };
  expect(attributes.type).toBe("button");
});
