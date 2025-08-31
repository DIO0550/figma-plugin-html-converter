import { test, expect } from "vitest";
import { H4Element } from "../h4-element";
import type { HeadingAttributes } from "../../../heading-attributes/heading-attributes";
import type { HTMLNode } from "../../../../../../models/html-node/html-node";
import type { TextNode } from "../../../../common/types";

test("H4Element.create - デフォルト値でH4Elementを作成できる", () => {
  const element = H4Element.create();

  expect(element).toEqual({
    type: "element",
    tagName: "h4",
    attributes: {},
    children: [],
  });
});

test("H4Element.create - 属性を指定してH4Elementを作成できる", () => {
  const attributes: Partial<HeadingAttributes> = {
    id: "heading-4",
    class: "heading-level-4",
    style: "font-size: 20px;",
  };

  const element = H4Element.create(attributes);

  expect(element.attributes).toEqual(attributes);
  expect(element.attributes.id).toBe("heading-4");
  expect(element.attributes.class).toBe("heading-level-4");
  expect(element.attributes.style).toBe("font-size: 20px;");
});

test("H4Element.create - 子要素を指定してH4Elementを作成できる", () => {
  const children: HTMLNode[] = [
    { type: "text", content: "Heading " } as TextNode,
    {
      type: "element",
      tagName: "strong",
      attributes: {},
      children: [{ type: "text", content: "Level 4" } as TextNode],
    },
  ];

  const element = H4Element.create({}, children);

  expect(element.children).toEqual(children);
  expect(element.children).toHaveLength(2);
});

test("H4Element.create - 属性と子要素の両方を指定してH4Elementを作成できる", () => {
  const attributes: Partial<HeadingAttributes> = {
    id: "title-4",
    class: "sub-heading",
  };
  const children: HTMLNode[] = [
    { type: "text", content: "Heading Text" } as TextNode,
  ];

  const element = H4Element.create(attributes, children);

  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual(children);
});
