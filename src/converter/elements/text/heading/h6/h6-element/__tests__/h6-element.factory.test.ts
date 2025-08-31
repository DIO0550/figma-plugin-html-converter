import { test, expect } from "vitest";
import { H6Element } from "../h6-element";
import type { HeadingAttributes } from "../../../heading-attributes/heading-attributes";
import type { HTMLNode } from "../../../../../../models/html-node/html-node";
import type { TextNode } from "../../../../common/types";

test("H6Element.create - デフォルト値でH6Elementを作成できる", () => {
  const element = H6Element.create();

  expect(element).toEqual({
    type: "element",
    tagName: "h6",
    attributes: {},
    children: [],
  });
});

test("H6Element.create - 属性を指定してH6Elementを作成できる", () => {
  const attributes: Partial<HeadingAttributes> = {
    id: "heading-6",
    class: "heading-level-6",
    style: "font-size: 20px;",
  };

  const element = H6Element.create(attributes);

  expect(element.attributes).toEqual(attributes);
  expect(element.attributes.id).toBe("heading-6");
  expect(element.attributes.class).toBe("heading-level-6");
  expect(element.attributes.style).toBe("font-size: 20px;");
});

test("H6Element.create - 子要素を指定してH6Elementを作成できる", () => {
  const children: HTMLNode[] = [
    { type: "text", content: "Heading " } as TextNode,
    {
      type: "element",
      tagName: "strong",
      attributes: {},
      children: [{ type: "text", content: "Level 6" } as TextNode],
    },
  ];

  const element = H6Element.create({}, children);

  expect(element.children).toEqual(children);
  expect(element.children).toHaveLength(2);
});

test("H6Element.create - 属性と子要素の両方を指定してH6Elementを作成できる", () => {
  const attributes: Partial<HeadingAttributes> = {
    id: "title-6",
    class: "sub-heading",
  };
  const children: HTMLNode[] = [
    { type: "text", content: "Heading Text" } as TextNode,
  ];

  const element = H6Element.create(attributes, children);

  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual(children);
});
