/**
 * @fileoverview textarea要素のファクトリーメソッドのテスト
 */

import { test, expect } from "vitest";
import { TextareaElement } from "../textarea-element";

test("TextareaElement.create: デフォルト値でtextarea要素を作成できる", () => {
  const element = TextareaElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("textarea");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("TextareaElement.create: 属性を指定してtextarea要素を作成できる", () => {
  const element = TextareaElement.create({
    name: "message",
    placeholder: "メッセージを入力",
  });

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("textarea");
  expect(element.attributes.name).toBe("message");
  expect(element.attributes.placeholder).toBe("メッセージを入力");
});

test("TextareaElement.create: rows属性を設定できる", () => {
  const element = TextareaElement.create({ rows: "10" });

  expect(element.attributes.rows).toBe("10");
});

test("TextareaElement.create: cols属性を設定できる", () => {
  const element = TextareaElement.create({ cols: "50" });

  expect(element.attributes.cols).toBe("50");
});

test("TextareaElement.create: maxlength属性を設定できる", () => {
  const element = TextareaElement.create({ maxlength: "500" });

  expect(element.attributes.maxlength).toBe("500");
});

test("TextareaElement.create: wrap属性を設定できる", () => {
  const element = TextareaElement.create({ wrap: "soft" });

  expect(element.attributes.wrap).toBe("soft");
});

test("TextareaElement.create: 子要素を指定してtextarea要素を作成できる", () => {
  const children = [{ type: "text" as const, content: "既存のテキスト" }];

  const element = TextareaElement.create({}, children);

  expect(element.children).toEqual(children);
  expect(element.children).toHaveLength(1);
});

test("TextareaElement.create: GlobalAttributesを含む属性を設定できる", () => {
  const element = TextareaElement.create({
    id: "comment",
    class: "form-textarea",
    style: "min-height: 100px;",
    name: "comment",
  });

  expect(element.attributes.id).toBe("comment");
  expect(element.attributes.class).toBe("form-textarea");
  expect(element.attributes.style).toBe("min-height: 100px;");
});

test("TextareaElement.create: required属性を設定できる", () => {
  const element = TextareaElement.create({
    name: "description",
    required: "required",
  });

  expect(element.attributes.required).toBe("required");
});

test("TextareaElement.create: disabled属性を設定できる", () => {
  const element = TextareaElement.create({
    name: "comment",
    disabled: "disabled",
  });

  expect(element.attributes.disabled).toBe("disabled");
});

test("TextareaElement.create: readonly属性を設定できる", () => {
  const element = TextareaElement.create({
    name: "terms",
    readonly: "readonly",
  });

  expect(element.attributes.readonly).toBe("readonly");
});

test("TextareaElement.create: 複数の属性と子要素を同時に設定できる", () => {
  const children = [{ type: "text" as const, content: "初期テキスト" }];

  const element = TextareaElement.create(
    {
      id: "user-message",
      class: "textarea",
      name: "message",
      placeholder: "メッセージを入力してください",
      rows: "5",
      cols: "40",
      maxlength: "1000",
      required: "required",
    },
    children,
  );

  expect(element.attributes.id).toBe("user-message");
  expect(element.attributes.class).toBe("textarea");
  expect(element.attributes.name).toBe("message");
  expect(element.attributes.placeholder).toBe("メッセージを入力してください");
  expect(element.attributes.rows).toBe("5");
  expect(element.attributes.cols).toBe("40");
  expect(element.attributes.maxlength).toBe("1000");
  expect(element.attributes.required).toBe("required");
  expect(element.children).toEqual(children);
});
