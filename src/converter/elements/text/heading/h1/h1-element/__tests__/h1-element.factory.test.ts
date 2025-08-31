import { test, expect } from "vitest";
import { H1Element } from "../h1-element";
import type { HeadingAttributes } from "../../../heading-attributes/heading-attributes";
import type { HTMLNode } from "../../../../../../models/html-node/html-node";
import type { TextNode } from "../../../../common/types";

test("H1Element.create - デフォルト値でH1Elementを作成できる", () => {
  const element = H1Element.create();

  expect(element).toEqual({
    type: "element",
    tagName: "h1",
    attributes: {},
    children: [],
  });
});

test("H1Element.create - 属性を指定してH1Elementを作成できる", () => {
  const attributes: Partial<HeadingAttributes> = {
    id: "main-title",
    class: "heading-1",
    style: "font-size: 32px;",
  };

  const element = H1Element.create(attributes);

  expect(element.attributes).toEqual(attributes);
  expect(element.attributes.id).toBe("main-title");
  expect(element.attributes.class).toBe("heading-1");
  expect(element.attributes.style).toBe("font-size: 32px;");
});

test("H1Element.create - 子要素を指定してH1Elementを作成できる", () => {
  const children: HTMLNode[] = [
    { type: "text", content: "Chapter " } as TextNode,
    {
      type: "element",
      tagName: "strong",
      attributes: {},
      children: [{ type: "text", content: "One" } as TextNode],
    },
  ];

  const element = H1Element.create({}, children);

  expect(element.children).toEqual(children);
  expect(element.children).toHaveLength(2);
});

test("H1Element.create - 属性と子要素の両方を指定してH1Elementを作成できる", () => {
  const attributes: Partial<HeadingAttributes> = {
    id: "title",
    class: "main-heading",
  };
  const children: HTMLNode[] = [
    { type: "text", content: "Welcome" } as TextNode,
  ];

  const element = H1Element.create(attributes, children);

  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual(children);
});
