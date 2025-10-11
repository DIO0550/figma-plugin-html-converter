import { test, expect } from "vitest";
import { SmallElement } from "../small-element";
import type { SmallAttributes } from "../../small-attributes/small-attributes";
import type { HTMLNode } from "../../../../../models/html-node/html-node";
import type { TextNode } from "../../../common/types";

test("SmallElement.create - デフォルト値でSmallElementを作成できる", () => {
  const element = SmallElement.create();

  expect(element).toEqual({
    type: "element",
    tagName: "small",
    attributes: {},
    children: [],
  });
});

test("SmallElement.create - 属性を指定してSmallElementを作成できる", () => {
  const attributes: Partial<SmallAttributes> = {
    id: "small-1",
    class: "small-text",
    style: "font-size: 0.8em; color: gray;",
  };

  const element = SmallElement.create(attributes);

  expect(element.attributes).toEqual(attributes);
  expect(element.attributes?.id).toBe("small-1");
  expect(element.attributes?.class).toBe("small-text");
  expect(element.attributes?.style).toBe("font-size: 0.8em; color: gray;");
});

test("SmallElement.create - 子要素を指定してSmallElementを作成できる", () => {
  const children: HTMLNode[] = [
    { type: "text", content: "This is small text." } as TextNode,
    {
      type: "element",
      tagName: "span",
      attributes: {},
      children: [{ type: "text", content: "Nested content" } as TextNode],
    },
  ];

  const element = SmallElement.create({}, children);

  expect(element.children).toEqual(children);
  expect(element.children).toHaveLength(2);
});

test("SmallElement.create - 属性と子要素の両方を指定してSmallElementを作成できる", () => {
  const attributes: Partial<SmallAttributes> = {
    id: "footer-small",
    class: "copyright",
  };
  const children: HTMLNode[] = [
    { type: "text", content: "© 2024 Example Company" } as TextNode,
  ];

  const element = SmallElement.create(attributes, children);

  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual(children);
});

test("SmallElement.create - 空の属性オブジェクトを渡してもエラーにならない", () => {
  const element = SmallElement.create({});

  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("SmallElement.create - 型が正しくSmallElementとなる", () => {
  const element = SmallElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("small");
});

test("SmallElement.create - data属性を含む属性でSmallElementを作成できる", () => {
  const attributes: Partial<SmallAttributes> = {
    "data-testid": "small-element",
    "data-size": "xs",
  };

  const element = SmallElement.create(attributes);

  expect(element.attributes?.["data-testid"]).toBe("small-element");
  expect(element.attributes?.["data-size"]).toBe("xs");
});

test("SmallElement.create - ARIA属性を含む属性でSmallElementを作成できる", () => {
  const attributes: Partial<SmallAttributes> = {
    "aria-label": "Small print",
    "aria-hidden": "false",
    role: "note",
  };

  const element = SmallElement.create(attributes);

  expect(element.attributes?.["aria-label"]).toBe("Small print");
  expect(element.attributes?.["aria-hidden"]).toBe("false");
  expect(element.attributes?.role).toBe("note");
});
