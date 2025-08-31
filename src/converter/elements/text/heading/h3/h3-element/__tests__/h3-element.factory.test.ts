import { test, expect } from "vitest";
import { H3Element } from "../h3-element";
import type { HeadingAttributes } from "../../../heading-attributes/heading-attributes";
import type { HTMLNode } from "../../../../../../models/html-node/html-node";
import type { TextNode } from "../../../../common/types";

test("H3Element.create - デフォルト値でH3Elementを作成できる", () => {
  const element = H3Element.create();

  expect(element).toEqual({
    type: "element",
    tagName: "h3",
    attributes: {},
    children: [],
  });
});

test("H3Element.create - 属性を指定してH3Elementを作成できる", () => {
  const attributes: Partial<HeadingAttributes> = {
    id: "heading-3",
    class: "heading-level-3",
    style: "font-size: 20px;",
  };

  const element = H3Element.create(attributes);

  expect(element.attributes).toEqual(attributes);
  expect(element.attributes.id).toBe("heading-3");
  expect(element.attributes.class).toBe("heading-level-3");
  expect(element.attributes.style).toBe("font-size: 20px;");
});

test("H3Element.create - 子要素を指定してH3Elementを作成できる", () => {
  const children: HTMLNode[] = [
    { type: "text", content: "Heading " } as TextNode,
    {
      type: "element",
      tagName: "strong",
      attributes: {},
      children: [{ type: "text", content: "Level 3" } as TextNode],
    },
  ];

  const element = H3Element.create({}, children);

  expect(element.children).toEqual(children);
  expect(element.children).toHaveLength(2);
});

test("H3Element.create - 属性と子要素の両方を指定してH3Elementを作成できる", () => {
  const attributes: Partial<HeadingAttributes> = {
    id: "title-3",
    class: "sub-heading",
  };
  const children: HTMLNode[] = [
    { type: "text", content: "Heading Text" } as TextNode,
  ];

  const element = H3Element.create(attributes, children);

  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual(children);
});
