import { test, expect } from "vitest";
import { MarkElement } from "../mark-element";
import type { MarkAttributes } from "../../mark-attributes/mark-attributes";
import type { HTMLNode } from "../../../../../models/html-node/html-node";
import type { TextNode } from "../../../common/types";

test("MarkElement.create - デフォルト値でMarkElementを作成できる", () => {
  const element = MarkElement.create();

  expect(element).toEqual({
    type: "element",
    tagName: "mark",
    attributes: {},
    children: [],
  });
});

test("MarkElement.create - 属性を指定してMarkElementを作成できる", () => {
  const attributes: Partial<MarkAttributes> = {
    id: "mark-1",
    class: "highlight",
    style: "background-color: yellow; color: black;",
  };

  const element = MarkElement.create(attributes);

  expect(element.attributes).toEqual(attributes);
  expect(element.attributes?.id).toBe("mark-1");
  expect(element.attributes?.class).toBe("highlight");
  expect(element.attributes?.style).toBe(
    "background-color: yellow; color: black;",
  );
});

test("MarkElement.create - 子要素を指定してMarkElementを作成できる", () => {
  const children: HTMLNode[] = [
    { type: "text", content: "This is highlighted text." } as TextNode,
    {
      type: "element",
      tagName: "span",
      attributes: {},
      children: [{ type: "text", content: "Nested content" } as TextNode],
    },
  ];

  const element = MarkElement.create({}, children);

  expect(element.children).toEqual(children);
  expect(element.children).toHaveLength(2);
});

test("MarkElement.create - 属性と子要素の両方を指定してMarkElementを作成できる", () => {
  const attributes: Partial<MarkAttributes> = {
    id: "important-mark",
    class: "highlight-important",
  };
  const children: HTMLNode[] = [
    { type: "text", content: "Important highlighted content" } as TextNode,
  ];

  const element = MarkElement.create(attributes, children);

  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual(children);
});

test("MarkElement.create - 空の属性オブジェクトを渡してもエラーにならない", () => {
  const element = MarkElement.create({});

  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("MarkElement.create - 型が正しくMarkElementとなる", () => {
  const element = MarkElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("mark");
});

test("MarkElement.create - data属性を含む属性でMarkElementを作成できる", () => {
  const attributes: Partial<MarkAttributes> = {
    "data-testid": "mark-element",
    "data-highlight": "true",
  };

  const element = MarkElement.create(attributes);

  expect(element.attributes?.["data-testid"]).toBe("mark-element");
  expect(element.attributes?.["data-highlight"]).toBe("true");
});

test("MarkElement.create - ARIA属性を含む属性でMarkElementを作成できる", () => {
  const attributes: Partial<MarkAttributes> = {
    "aria-label": "Highlighted section",
    "aria-hidden": "false",
    role: "mark",
  };

  const element = MarkElement.create(attributes);

  expect(element.attributes?.["aria-label"]).toBe("Highlighted section");
  expect(element.attributes?.["aria-hidden"]).toBe("false");
  expect(element.attributes?.role).toBe("mark");
});
