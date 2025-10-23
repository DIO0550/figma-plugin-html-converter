/**
 * @fileoverview fieldset要素のファクトリー関数のテスト
 */

import { test, expect } from "vitest";
import { FieldsetElement } from "../fieldset-element";

test("FieldsetElement.create: デフォルト値でfieldset要素を作成できる", () => {
  const element = FieldsetElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("fieldset");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("FieldsetElement.create: 属性を指定してfieldset要素を作成できる", () => {
  const attributes = {
    name: "contact-info",
    id: "contact-fieldset",
  };
  const element = FieldsetElement.create(attributes);

  expect(element.attributes).toEqual(attributes);
});

test("FieldsetElement.create: 子要素を指定してfieldset要素を作成できる", () => {
  const children = [
    { type: "element" as const, tagName: "legend" as const, attributes: {} },
    { type: "element" as const, tagName: "input" as const, attributes: {} },
  ];
  const element = FieldsetElement.create({}, children);

  expect(element.children).toEqual(children);
});

test("FieldsetElement.create: 属性と子要素の両方を指定してfieldset要素を作成できる", () => {
  const attributes = { name: "personal-info" };
  const children = [
    { type: "element" as const, tagName: "legend" as const, attributes: {} },
  ];
  const element = FieldsetElement.create(attributes, children);

  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual(children);
});

test("FieldsetElement.create: disabled属性付きのfieldset要素を作成できる", () => {
  const element = FieldsetElement.create({ disabled: true });

  expect(element.attributes.disabled).toBe(true);
});

test("FieldsetElement.create: form属性付きのfieldset要素を作成できる", () => {
  const element = FieldsetElement.create({ form: "registration-form" });

  expect(element.attributes.form).toBe("registration-form");
});

test("FieldsetElement.create: name属性付きのfieldset要素を作成できる", () => {
  const element = FieldsetElement.create({ name: "address" });

  expect(element.attributes.name).toBe("address");
});

test("FieldsetElement.create: GlobalAttributesを含む属性を設定できる", () => {
  const element = FieldsetElement.create({
    id: "address-fieldset",
    class: "fieldset fieldset-primary",
    name: "address",
    disabled: false,
  });

  expect(element.attributes.id).toBe("address-fieldset");
  expect(element.attributes.class).toBe("fieldset fieldset-primary");
  expect(element.attributes.name).toBe("address");
  expect(element.attributes.disabled).toBe(false);
});
