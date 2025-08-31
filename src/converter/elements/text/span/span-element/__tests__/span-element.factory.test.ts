import { test, expect } from "vitest";
import { SpanElement } from "../span-element";

test("SpanElement.createはデフォルトのSpanElementを作成する", () => {
  const element = SpanElement.create();

  expect(element).toEqual({
    type: "element",
    tagName: "span",
    attributes: {},
    children: [],
  });
});

test("SpanElement.createは属性を指定してSpanElementを作成する", () => {
  const attributes = {
    id: "my-span",
    class: "highlight",
    style: "color: red;",
  };

  const element = SpanElement.create(attributes);

  expect(element).toEqual({
    type: "element",
    tagName: "span",
    attributes,
    children: [],
  });
});

test("SpanElement.createは子要素を指定してSpanElementを作成する", () => {
  const children = [
    {
      type: "text" as const,
      textContent: "Hello World",
    },
  ];

  const element = SpanElement.create({}, children);

  expect(element).toEqual({
    type: "element",
    tagName: "span",
    attributes: {},
    children,
  });
});

test("SpanElement.createは属性と子要素を両方指定してSpanElementを作成する", () => {
  const attributes = {
    class: "bold",
  };
  const children = [
    {
      type: "text" as const,
      textContent: "Important text",
    },
  ];

  const element = SpanElement.create(attributes, children);

  expect(element).toEqual({
    type: "element",
    tagName: "span",
    attributes,
    children,
  });
});

test("SpanElement.createは部分的な属性でSpanElementを作成する", () => {
  const element = SpanElement.create({
    id: "partial",
  });

  expect(element.attributes).toEqual({
    id: "partial",
  });
});

test("SpanElement.createは空の属性オブジェクトでSpanElementを作成する", () => {
  const element = SpanElement.create({});

  expect(element.attributes).toEqual({});
});

test("SpanElement.createは複数の子要素を持つSpanElementを作成する", () => {
  const children = [
    {
      type: "text" as const,
      textContent: "First ",
    },
    {
      type: "element" as const,
      tagName: "strong" as const,
      attributes: {},
      children: [
        {
          type: "text" as const,
          textContent: "bold",
        },
      ],
    },
    {
      type: "text" as const,
      textContent: " text",
    },
  ];

  const element = SpanElement.create({}, children);

  expect(element.children).toEqual(children);
  expect(element.children).toHaveLength(3);
});
