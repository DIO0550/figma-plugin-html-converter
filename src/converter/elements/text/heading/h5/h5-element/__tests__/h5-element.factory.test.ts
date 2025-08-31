import { test, expect } from "vitest";
import { H5Element } from "../h5-element";
import type { HeadingAttributes } from "../../../heading-attributes/heading-attributes";
import type { HTMLNode } from "../../../../../../models/html-node/html-node";
import type { TextNode } from "../../../../common/types";

test("H5Element.create - デフォルト値でH5Elementを作成できる", () => {
  const element = H5Element.create();

  expect(element).toEqual({
    type: "element",
    tagName: "h5",
    attributes: {},
    children: [],
  });
});

test("H5Element.create - 属性を指定してH5Elementを作成できる", () => {
  const attributes: Partial<HeadingAttributes> = {
    id: "heading-5",
    class: "heading-level-5",
    style: "font-size: 20px;",
  };

  const element = H5Element.create(attributes);

  expect(element.attributes).toEqual(attributes);
  expect(element.attributes.id).toBe("heading-5");
  expect(element.attributes.class).toBe("heading-level-5");
  expect(element.attributes.style).toBe("font-size: 20px;");
});

test("H5Element.create - 子要素を指定してH5Elementを作成できる", () => {
  const children: HTMLNode[] = [
    { type: "text", content: "Heading " } as TextNode,
    {
      type: "element",
      tagName: "strong",
      attributes: {},
      children: [{ type: "text", content: "Level 5" } as TextNode],
    },
  ];

  const element = H5Element.create({}, children);

  expect(element.children).toEqual(children);
  expect(element.children).toHaveLength(2);
});

test("H5Element.create - 属性と子要素の両方を指定してH5Elementを作成できる", () => {
  const attributes: Partial<HeadingAttributes> = {
    id: "title-5",
    class: "sub-heading",
  };
  const children: HTMLNode[] = [
    { type: "text", content: "Heading Text" } as TextNode,
  ];

  const element = H5Element.create(attributes, children);

  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual(children);
});
