import { test, expect } from "vitest";
import { BlockquoteElement } from "../blockquote-element";
import type { BlockquoteAttributes } from "../../blockquote-attributes/blockquote-attributes";
import type { HTMLNode } from "../../../../../models/html-node/html-node";
import type { TextNode } from "../../../common/types";

test("BlockquoteElement.create - デフォルト値でBlockquoteElementを作成できる", () => {
  const element = BlockquoteElement.create();

  expect(element).toEqual({
    type: "element",
    tagName: "blockquote",
    attributes: {},
    children: [],
  });
});

test("BlockquoteElement.create - 属性を指定してBlockquoteElementを作成できる", () => {
  const attributes: Partial<BlockquoteAttributes> = {
    id: "quote-1",
    class: "quote-block",
    style: "margin-left: 40px;",
    cite: "https://example.com/source",
  };

  const element = BlockquoteElement.create(attributes);

  expect(element.attributes).toEqual(attributes);
  expect(element.attributes?.id).toBe("quote-1");
  expect(element.attributes?.class).toBe("quote-block");
  expect(element.attributes?.style).toBe("margin-left: 40px;");
  expect(element.attributes?.cite).toBe("https://example.com/source");
});

test("BlockquoteElement.create - 子要素を指定してBlockquoteElementを作成できる", () => {
  const children: HTMLNode[] = [
    { type: "text", content: "This is a quote." } as TextNode,
    {
      type: "element",
      tagName: "cite",
      attributes: {},
      children: [{ type: "text", content: "Author Name" } as TextNode],
    },
  ];

  const element = BlockquoteElement.create({}, children);

  expect(element.children).toEqual(children);
  expect(element.children).toHaveLength(2);
});

test("BlockquoteElement.create - 属性と子要素の両方を指定してBlockquoteElementを作成できる", () => {
  const attributes: Partial<BlockquoteAttributes> = {
    id: "main-quote",
    cite: "https://example.com/famous-quote",
  };
  const children: HTMLNode[] = [
    { type: "text", content: "To be or not to be." } as TextNode,
  ];

  const element = BlockquoteElement.create(attributes, children);

  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual(children);
});

test("BlockquoteElement.create - 空の属性オブジェクトを渡してもエラーにならない", () => {
  const element = BlockquoteElement.create({});

  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("BlockquoteElement.create - 型が正しくBlockquoteElementとなる", () => {
  const element = BlockquoteElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("blockquote");
});
