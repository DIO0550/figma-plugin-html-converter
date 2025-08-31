import { test, expect } from "vitest";
import { H2Element } from "../h2-element";
import type { HeadingAttributes } from "../../../heading-attributes/heading-attributes";
import type { HTMLNode } from "../../../../../../models/html-node/html-node";
import type { TextNode } from "../../../../common/types";

test("H2Element.create - デフォルト値でH2Elementを作成できる", () => {
  const element = H2Element.create();

  expect(element).toEqual({
    type: "element",
    tagName: "h2",
    attributes: {},
    children: [],
  });
});

test("H2Element.create - 属性を指定してH2Elementを作成できる", () => {
  const attributes: Partial<HeadingAttributes> = {
    id: "section-title",
    class: "heading-2",
    style: "font-size: 24px;",
  };

  const element = H2Element.create(attributes);

  expect(element.attributes).toEqual(attributes);
  expect(element.attributes.id).toBe("section-title");
  expect(element.attributes.class).toBe("heading-2");
  expect(element.attributes.style).toBe("font-size: 24px;");
});

test("H2Element.create - 子要素を指定してH2Elementを作成できる", () => {
  const children: HTMLNode[] = [
    { type: "text", content: "Section " } as TextNode,
    {
      type: "element",
      tagName: "strong",
      attributes: {},
      children: [{ type: "text", content: "Two" } as TextNode],
    },
  ];

  const element = H2Element.create({}, children);

  expect(element.children).toEqual(children);
  expect(element.children).toHaveLength(2);
});

test("H2Element.create - 属性と子要素の両方を指定してH2Elementを作成できる", () => {
  const attributes: Partial<HeadingAttributes> = {
    id: "title",
    class: "sub-heading",
  };
  const children: HTMLNode[] = [
    { type: "text", content: "Section Title" } as TextNode,
  ];

  const element = H2Element.create(attributes, children);

  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual(children);
});
