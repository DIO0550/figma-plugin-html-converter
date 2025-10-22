/**
 * @fileoverview label要素のファクトリー関数のテスト
 */

import { test, expect } from "vitest";
import { LabelElement } from "../label-element";

test("LabelElement.create: デフォルト値でlabel要素を作成できる", () => {
  const element = LabelElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("label");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("LabelElement.create: 属性を指定してlabel要素を作成できる", () => {
  const attributes = {
    for: "email-input",
    id: "email-label",
  };
  const element = LabelElement.create(attributes);

  expect(element.attributes).toEqual(attributes);
});

test("LabelElement.create: 子要素を指定してlabel要素を作成できる", () => {
  const children = [{ type: "text" as const, textContent: "Email Address" }];
  const element = LabelElement.create({}, children);

  expect(element.children).toEqual(children);
});

test("LabelElement.create: 属性と子要素の両方を指定してlabel要素を作成できる", () => {
  const attributes = { for: "email-input" };
  const children = [{ type: "text" as const, textContent: "Email Address" }];
  const element = LabelElement.create(attributes, children);

  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual(children);
});

test("LabelElement.create: for属性付きのlabel要素を作成できる", () => {
  const element = LabelElement.create({ for: "username" });

  expect(element.attributes.for).toBe("username");
});

test("LabelElement.create: form属性付きのlabel要素を作成できる", () => {
  const element = LabelElement.create({ form: "login-form" });

  expect(element.attributes.form).toBe("login-form");
});

test("LabelElement.create: GlobalAttributesを含む属性を設定できる", () => {
  const element = LabelElement.create({
    id: "username-label",
    class: "label label-primary",
    for: "username",
  });

  expect(element.attributes.id).toBe("username-label");
  expect(element.attributes.class).toBe("label label-primary");
  expect(element.attributes.for).toBe("username");
});
