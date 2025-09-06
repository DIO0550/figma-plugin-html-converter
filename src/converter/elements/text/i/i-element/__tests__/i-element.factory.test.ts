import { test, expect } from "vitest";
import { IElement } from "../i-element";

test("IElement.createはデフォルトのIElementを作成できる", () => {
  const element = IElement.create();

  expect(element).toEqual({
    type: "element",
    tagName: "i",
    attributes: {},
    children: [],
  });
});

test("IElement.createは属性を指定してIElementを作成できる", () => {
  const attributes = {
    id: "test-id",
    class: "test-class",
    style: "font-style: italic;",
  };

  const element = IElement.create(attributes);

  expect(element).toEqual({
    type: "element",
    tagName: "i",
    attributes,
    children: [],
  });
});

test("IElement.createは子要素を指定してIElementを作成できる", () => {
  const children = [{ type: "text" as const, content: "斜体テキスト" }];

  const element = IElement.create({}, children);

  expect(element).toEqual({
    type: "element",
    tagName: "i",
    attributes: {},
    children,
  });
});

test("IElement.createは属性と子要素を指定してIElementを作成できる", () => {
  const attributes = {
    id: "italic",
    class: "italic",
  };
  const children = [{ type: "text" as const, content: "斜体" }];

  const element = IElement.create(attributes, children);

  expect(element).toEqual({
    type: "element",
    tagName: "i",
    attributes,
    children,
  });
});

test("IElement.createは部分的な属性でもIElementを作成できる", () => {
  const attributes = {
    id: "test-id",
  };

  const element = IElement.create(attributes);

  expect(element.attributes).toEqual({
    id: "test-id",
  });
});
