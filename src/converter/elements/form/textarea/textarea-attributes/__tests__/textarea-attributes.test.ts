/**
 * @fileoverview textarea要素の属性のテスト
 */

import { test, expect } from "vitest";
import type { TextareaAttributes } from "../textarea-attributes";

// 型定義のテスト

test("TextareaAttributes: GlobalAttributesを継承している", () => {
  const attributes: TextareaAttributes = {
    id: "message-textarea",
    class: "form-control",
    style: "min-height: 100px;",
  };

  // GlobalAttributesのプロパティが使用できることを確認
  expect(attributes.id).toBe("message-textarea");
  expect(attributes.class).toBe("form-control");
  expect(attributes.style).toBe("min-height: 100px;");
});

test("TextareaAttributes: name属性を持つ", () => {
  const attributes: TextareaAttributes = {
    name: "message",
  };

  expect(attributes.name).toBe("message");
});

test("TextareaAttributes: placeholder属性を持つ", () => {
  const attributes: TextareaAttributes = {
    placeholder: "メッセージを入力してください",
  };

  expect(attributes.placeholder).toBe("メッセージを入力してください");
});

test("TextareaAttributes: rows属性を持つ", () => {
  const attributes: TextareaAttributes = {
    rows: "10",
  };

  expect(attributes.rows).toBe("10");
});

test("TextareaAttributes: cols属性を持つ", () => {
  const attributes: TextareaAttributes = {
    cols: "50",
  };

  expect(attributes.cols).toBe("50");
});

test("TextareaAttributes: maxlength属性を持つ", () => {
  const attributes: TextareaAttributes = {
    maxlength: "500",
  };

  expect(attributes.maxlength).toBe("500");
});

test("TextareaAttributes: wrap属性を持つ", () => {
  const attributes: TextareaAttributes = {
    wrap: "soft",
  };

  expect(attributes.wrap).toBe("soft");
});

test("TextareaAttributes: required属性を持つ", () => {
  const attributes: TextareaAttributes = {
    required: "required",
  };

  expect(attributes.required).toBe("required");
});

test("TextareaAttributes: disabled属性を持つ", () => {
  const attributes: TextareaAttributes = {
    disabled: "disabled",
  };

  expect(attributes.disabled).toBe("disabled");
});

test("TextareaAttributes: readonly属性を持つ", () => {
  const attributes: TextareaAttributes = {
    readonly: "readonly",
  };

  expect(attributes.readonly).toBe("readonly");
});

test("TextareaAttributes: 複数の属性を同時に持つことができる", () => {
  const attributes: TextareaAttributes = {
    name: "comment",
    placeholder: "コメントを入力",
    rows: "5",
    cols: "40",
    maxlength: "1000",
    wrap: "hard",
    required: "required",
    disabled: "disabled",
    readonly: "readonly",
    id: "comment-area",
    class: "textarea",
  };

  expect(attributes.name).toBe("comment");
  expect(attributes.placeholder).toBe("コメントを入力");
  expect(attributes.rows).toBe("5");
  expect(attributes.cols).toBe("40");
  expect(attributes.maxlength).toBe("1000");
  expect(attributes.wrap).toBe("hard");
  expect(attributes.required).toBe("required");
  expect(attributes.disabled).toBe("disabled");
  expect(attributes.readonly).toBe("readonly");
  expect(attributes.id).toBe("comment-area");
  expect(attributes.class).toBe("textarea");
});

test("TextareaAttributes: すべての属性が省略可能", () => {
  const attributes: TextareaAttributes = {};

  // エラーなくコンパイルできることを確認
  expect(attributes).toBeDefined();
});

// wrap属性の値のテスト

test("TextareaAttributes wrap: soft値が使用できる", () => {
  const attributes: TextareaAttributes = { wrap: "soft" };
  expect(attributes.wrap).toBe("soft");
});

test("TextareaAttributes wrap: hard値が使用できる", () => {
  const attributes: TextareaAttributes = { wrap: "hard" };
  expect(attributes.wrap).toBe("hard");
});
