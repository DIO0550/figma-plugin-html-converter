import { test, expect } from "vitest";
import { EmElement } from "../em-element";

test("EmElement.createはデフォルトのEmElementを作成できる", () => {
  const element = EmElement.create();

  expect(element).toEqual({
    type: "element",
    tagName: "em",
    attributes: {},
    children: [],
  });
});

test("EmElement.createは属性を指定してEmElementを作成できる", () => {
  const attributes = {
    id: "test-id",
    class: "test-class",
    style: "font-style: italic;",
  };

  const element = EmElement.create(attributes);

  expect(element).toEqual({
    type: "element",
    tagName: "em",
    attributes,
    children: [],
  });
});

test("EmElement.createは子要素を指定してEmElementを作成できる", () => {
  const children = [{ type: "text" as const, content: "強調テキスト" }];

  const element = EmElement.create({}, children);

  expect(element).toEqual({
    type: "element",
    tagName: "em",
    attributes: {},
    children,
  });
});

test("EmElement.createは属性と子要素を指定してEmElementを作成できる", () => {
  const attributes = {
    id: "emphasis",
    class: "italic",
  };
  const children = [{ type: "text" as const, content: "強調" }];

  const element = EmElement.create(attributes, children);

  expect(element).toEqual({
    type: "element",
    tagName: "em",
    attributes,
    children,
  });
});

test("EmElement.createは部分的な属性でもEmElementを作成できる", () => {
  const attributes = {
    id: "test-id",
  };

  const element = EmElement.create(attributes);

  expect(element.attributes).toEqual({
    id: "test-id",
  });
});
