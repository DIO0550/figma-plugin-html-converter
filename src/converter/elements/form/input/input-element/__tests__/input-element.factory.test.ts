/**
 * @fileoverview input要素のファクトリーメソッドのテスト
 */

import { test, expect } from "vitest";
import { InputElement } from "../input-element";

test("InputElement.create: デフォルト値でinput要素を作成できる", () => {
  const element = InputElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("input");
  expect(element.attributes).toEqual({});
});

test("InputElement.create: 属性を指定してinput要素を作成できる", () => {
  const element = InputElement.create({
    type: "email",
    name: "email",
    placeholder: "Enter your email",
  });

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("input");
  expect(element.attributes.type).toBe("email");
  expect(element.attributes.name).toBe("email");
  expect(element.attributes.placeholder).toBe("Enter your email");
});

test("InputElement.create: text型のinput要素を作成できる", () => {
  const element = InputElement.create({ type: "text", value: "Hello" });

  expect(element.attributes.type).toBe("text");
  expect(element.attributes.value).toBe("Hello");
});

test("InputElement.create: password型のinput要素を作成できる", () => {
  const element = InputElement.create({
    type: "password",
    name: "password",
  });

  expect(element.attributes.type).toBe("password");
  expect(element.attributes.name).toBe("password");
});

test("InputElement.create: checkbox型のinput要素を作成できる", () => {
  const element = InputElement.create({
    type: "checkbox",
    name: "agree",
    checked: "checked",
  });

  expect(element.attributes.type).toBe("checkbox");
  expect(element.attributes.name).toBe("agree");
  expect(element.attributes.checked).toBe("checked");
});

test("InputElement.create: radio型のinput要素を作成できる", () => {
  const element = InputElement.create({
    type: "radio",
    name: "gender",
    value: "male",
  });

  expect(element.attributes.type).toBe("radio");
  expect(element.attributes.name).toBe("gender");
  expect(element.attributes.value).toBe("male");
});

test("InputElement.create: number型のinput要素を作成できる", () => {
  const element = InputElement.create({
    type: "number",
    min: "0",
    max: "100",
    step: "1",
  });

  expect(element.attributes.type).toBe("number");
  expect(element.attributes.min).toBe("0");
  expect(element.attributes.max).toBe("100");
  expect(element.attributes.step).toBe("1");
});

test("InputElement.create: file型のinput要素を作成できる", () => {
  const element = InputElement.create({
    type: "file",
    accept: "image/*",
  });

  expect(element.attributes.type).toBe("file");
  expect(element.attributes.accept).toBe("image/*");
});

test("InputElement.create: date型のinput要素を作成できる", () => {
  const element = InputElement.create({
    type: "date",
    min: "2024-01-01",
    max: "2024-12-31",
  });

  expect(element.attributes.type).toBe("date");
  expect(element.attributes.min).toBe("2024-01-01");
  expect(element.attributes.max).toBe("2024-12-31");
});

test("InputElement.create: GlobalAttributesを含む属性を設定できる", () => {
  const element = InputElement.create({
    id: "username",
    class: "form-input",
    style: "width: 200px;",
    type: "text",
  });

  expect(element.attributes.id).toBe("username");
  expect(element.attributes.class).toBe("form-input");
  expect(element.attributes.style).toBe("width: 200px;");
});

test("InputElement.create: required属性を設定できる", () => {
  const element = InputElement.create({
    type: "text",
    required: "required",
  });

  expect(element.attributes.required).toBe("required");
});

test("InputElement.create: disabled属性を設定できる", () => {
  const element = InputElement.create({
    type: "text",
    disabled: "disabled",
  });

  expect(element.attributes.disabled).toBe("disabled");
});

test("InputElement.create: readonly属性を設定できる", () => {
  const element = InputElement.create({
    type: "text",
    readonly: "readonly",
  });

  expect(element.attributes.readonly).toBe("readonly");
});

test("InputElement.create: 複数の属性を同時に設定できる", () => {
  const element = InputElement.create({
    id: "email-input",
    class: "form-control",
    type: "email",
    name: "email",
    value: "test@example.com",
    placeholder: "Enter email",
    required: "required",
  });

  expect(element.attributes.id).toBe("email-input");
  expect(element.attributes.class).toBe("form-control");
  expect(element.attributes.type).toBe("email");
  expect(element.attributes.name).toBe("email");
  expect(element.attributes.value).toBe("test@example.com");
  expect(element.attributes.placeholder).toBe("Enter email");
  expect(element.attributes.required).toBe("required");
});
