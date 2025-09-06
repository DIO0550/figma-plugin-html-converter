import { test, expect } from "vitest";
import { BElement } from "../b-element";

test("BElement.createはデフォルトのBElementを作成できる", () => {
  const element = BElement.create();

  expect(element).toEqual({
    type: "element",
    tagName: "b",
    attributes: {},
    children: [],
  });
});

test("BElement.createは属性を指定してBElementを作成できる", () => {
  const attributes = {
    id: "test-id",
    class: "test-class",
    style: "font-weight: bold;",
  };

  const element = BElement.create(attributes);

  expect(element).toEqual({
    type: "element",
    tagName: "b",
    attributes,
    children: [],
  });
});

test("BElement.createは子要素を指定してBElementを作成できる", () => {
  const children = [{ type: "text" as const, content: "太字テキスト" }];

  const element = BElement.create({}, children);

  expect(element).toEqual({
    type: "element",
    tagName: "b",
    attributes: {},
    children,
  });
});

test("BElement.createは属性と子要素を指定してBElementを作成できる", () => {
  const attributes = {
    id: "bold",
    class: "bold",
  };
  const children = [{ type: "text" as const, content: "太字" }];

  const element = BElement.create(attributes, children);

  expect(element).toEqual({
    type: "element",
    tagName: "b",
    attributes,
    children,
  });
});

test("BElement.createは部分的な属性でもBElementを作成できる", () => {
  const attributes = {
    id: "test-id",
  };

  const element = BElement.create(attributes);

  expect(element.attributes).toEqual({
    id: "test-id",
  });
});
