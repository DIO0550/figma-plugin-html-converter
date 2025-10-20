/**
 * @fileoverview button要素のファクトリーメソッドのテスト
 */

import { test, expect } from "vitest";
import { ButtonElement } from "../button-element";

test("ButtonElement.create: デフォルト値でbutton要素を作成できる", () => {
  const element = ButtonElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("button");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("ButtonElement.create: 属性を指定してbutton要素を作成できる", () => {
  const element = ButtonElement.create({
    type: "submit",
    name: "submitBtn",
  });

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("button");
  expect(element.attributes.type).toBe("submit");
  expect(element.attributes.name).toBe("submitBtn");
});

test("ButtonElement.create: button型のbutton要素を作成できる", () => {
  const element = ButtonElement.create({ type: "button" });

  expect(element.attributes.type).toBe("button");
});

test("ButtonElement.create: submit型のbutton要素を作成できる", () => {
  const element = ButtonElement.create({ type: "submit" });

  expect(element.attributes.type).toBe("submit");
});

test("ButtonElement.create: reset型のbutton要素を作成できる", () => {
  const element = ButtonElement.create({ type: "reset" });

  expect(element.attributes.type).toBe("reset");
});

test("ButtonElement.create: 子要素を指定してbutton要素を作成できる", () => {
  const children = [{ type: "text" as const, content: "クリック" }];

  const element = ButtonElement.create({}, children);

  expect(element.children).toEqual(children);
  expect(element.children).toHaveLength(1);
});

test("ButtonElement.create: GlobalAttributesを含む属性を設定できる", () => {
  const element = ButtonElement.create({
    id: "submit-btn",
    class: "btn btn-primary",
    style: "padding: 10px;",
    type: "submit",
  });

  expect(element.attributes.id).toBe("submit-btn");
  expect(element.attributes.class).toBe("btn btn-primary");
  expect(element.attributes.style).toBe("padding: 10px;");
});

test("ButtonElement.create: disabled属性を設定できる", () => {
  const element = ButtonElement.create({
    type: "button",
    disabled: "disabled",
  });

  expect(element.attributes.disabled).toBe("disabled");
});

test("ButtonElement.create: value属性を設定できる", () => {
  const element = ButtonElement.create({
    type: "submit",
    value: "送信する",
  });

  expect(element.attributes.value).toBe("送信する");
});

test("ButtonElement.create: 複数の属性と子要素を同時に設定できる", () => {
  const children = [{ type: "text" as const, content: "送信" }];

  const element = ButtonElement.create(
    {
      id: "form-submit",
      class: "btn",
      type: "submit",
      name: "submit",
      value: "送信",
    },
    children,
  );

  expect(element.attributes.id).toBe("form-submit");
  expect(element.attributes.class).toBe("btn");
  expect(element.attributes.type).toBe("submit");
  expect(element.attributes.name).toBe("submit");
  expect(element.attributes.value).toBe("送信");
  expect(element.children).toEqual(children);
});
