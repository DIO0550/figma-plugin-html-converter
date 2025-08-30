import { test, expect } from "vitest";
import { PElement } from "../p-element";
import type { PAttributes } from "../../p-attributes/p-attributes";
import type { HTMLNode } from "../../../../../models/html-node/html-node";

type TextNode = {
  type: "text";
  content: string;
};

test("PElement.create - デフォルト値でPElementを作成できる", () => {
  const element = PElement.create();

  expect(element).toEqual({
    type: "element",
    tagName: "p",
    attributes: {},
    children: [],
  });
});

test("PElement.create - 属性を指定してPElementを作成できる", () => {
  const attributes: Partial<PAttributes> = {
    id: "para-1",
    class: "text-body",
    style: "color: blue;",
  };

  const element = PElement.create(attributes);

  expect(element.attributes).toEqual(attributes);
  expect(element.attributes.id).toBe("para-1");
  expect(element.attributes.class).toBe("text-body");
  expect(element.attributes.style).toBe("color: blue;");
});

test("PElement.create - 子要素を指定してPElementを作成できる", () => {
  const children: HTMLNode[] = [
    { type: "text", content: "Hello " } as TextNode,
    {
      type: "element",
      tagName: "strong",
      attributes: {},
      children: [{ type: "text", content: "World" } as TextNode],
    },
  ];

  const element = PElement.create({}, children);

  expect(element.children).toEqual(children);
  expect(element.children).toHaveLength(2);
});

test("PElement.create - 属性と子要素の両方を指定してPElementを作成できる", () => {
  const attributes: Partial<PAttributes> = {
    id: "main-paragraph",
    class: "lead",
  };
  const children: HTMLNode[] = [
    { type: "text", content: "This is the main paragraph." } as TextNode,
  ];

  const element = PElement.create(attributes, children);

  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual(children);
});

test("PElement.create - 空の属性オブジェクトを渡してもエラーにならない", () => {
  const element = PElement.create({});

  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("PElement.create - 型が正しくPElementとなる", () => {
  const element = PElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("p");
});
