import { test, expect } from "vitest";
import { StrongElement } from "../strong-element";

test("StrongElement.createはデフォルトのStrongElementを作成できる", () => {
  const element = StrongElement.create();

  expect(element).toEqual({
    type: "element",
    tagName: "strong",
    attributes: {},
    children: [],
  });
});

test("StrongElement.createは属性を指定してStrongElementを作成できる", () => {
  const attributes = {
    id: "test-id",
    class: "test-class",
    style: "font-weight: bold;",
  };

  const element = StrongElement.create(attributes);

  expect(element).toEqual({
    type: "element",
    tagName: "strong",
    attributes,
    children: [],
  });
});

test("StrongElement.createは子要素を指定してStrongElementを作成できる", () => {
  const children = [{ type: "text" as const, content: "重要なテキスト" }];

  const element = StrongElement.create({}, children);

  expect(element).toEqual({
    type: "element",
    tagName: "strong",
    attributes: {},
    children,
  });
});

test("StrongElement.createは属性と子要素を指定してStrongElementを作成できる", () => {
  const attributes = {
    id: "important",
    class: "highlight",
  };
  const children = [{ type: "text" as const, content: "重要" }];

  const element = StrongElement.create(attributes, children);

  expect(element).toEqual({
    type: "element",
    tagName: "strong",
    attributes,
    children,
  });
});

test("StrongElement.createは部分的な属性でもStrongElementを作成できる", () => {
  const attributes = {
    id: "test-id",
  };

  const element = StrongElement.create(attributes);

  expect(element.attributes).toEqual({
    id: "test-id",
  });
});
