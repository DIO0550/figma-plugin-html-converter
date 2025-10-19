/**
 * @fileoverview button要素の属性のテスト
 */

import { test, expect } from "vitest";
import type { ButtonAttributes } from "../button-attributes";

// 型定義のテスト

test("ButtonAttributes: GlobalAttributesを継承している", () => {
  const attributes: ButtonAttributes = {
    id: "submit-btn",
    class: "btn btn-primary",
    style: "padding: 10px;",
  };

  // GlobalAttributesのプロパティが使用できることを確認
  expect(attributes.id).toBe("submit-btn");
  expect(attributes.class).toBe("btn btn-primary");
  expect(attributes.style).toBe("padding: 10px;");
});

test("ButtonAttributes: type属性を持つ", () => {
  const attributes: ButtonAttributes = {
    type: "button",
  };

  expect(attributes.type).toBe("button");
});

test("ButtonAttributes: name属性を持つ", () => {
  const attributes: ButtonAttributes = {
    name: "submitButton",
  };

  expect(attributes.name).toBe("submitButton");
});

test("ButtonAttributes: value属性を持つ", () => {
  const attributes: ButtonAttributes = {
    value: "送信",
  };

  expect(attributes.value).toBe("送信");
});

test("ButtonAttributes: disabled属性を持つ", () => {
  const attributes: ButtonAttributes = {
    disabled: "disabled",
  };

  expect(attributes.disabled).toBe("disabled");
});

test("ButtonAttributes: 複数の属性を同時に持つことができる", () => {
  const attributes: ButtonAttributes = {
    type: "submit",
    name: "submit",
    value: "登録",
    disabled: "disabled",
    id: "form-submit",
    class: "btn",
  };

  expect(attributes.type).toBe("submit");
  expect(attributes.name).toBe("submit");
  expect(attributes.value).toBe("登録");
  expect(attributes.disabled).toBe("disabled");
  expect(attributes.id).toBe("form-submit");
  expect(attributes.class).toBe("btn");
});

test("ButtonAttributes: すべての属性が省略可能", () => {
  const attributes: ButtonAttributes = {};

  // エラーなくコンパイルできることを確認
  expect(attributes).toBeDefined();
});

// ButtonTypeのテスト

test("ButtonType: button型が使用できる", () => {
  const attributes: ButtonAttributes = { type: "button" };
  expect(attributes.type).toBe("button");
});

test("ButtonType: submit型が使用できる", () => {
  const attributes: ButtonAttributes = { type: "submit" };
  expect(attributes.type).toBe("submit");
});

test("ButtonType: reset型が使用できる", () => {
  const attributes: ButtonAttributes = { type: "reset" };
  expect(attributes.type).toBe("reset");
});
