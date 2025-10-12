import { test, expect } from "vitest";
import { DelElement } from "../del-element";

test("DelElement.create - デフォルト属性でDelElementを作成する", () => {
  const element = DelElement.create();

  expect(element).toEqual({
    type: "element",
    tagName: "del",
    attributes: {},
    children: [],
  });
});

test("DelElement.create - 属性を指定してDelElementを作成する", () => {
  const attributes = {
    id: "del-1",
    class: "deleted-text",
  };
  const element = DelElement.create(attributes);

  expect(element).toEqual({
    type: "element",
    tagName: "del",
    attributes,
    children: [],
  });
});

test("DelElement.create - cite属性を持つDelElementを作成する", () => {
  const attributes = {
    cite: "https://example.com/reason",
  };
  const element = DelElement.create(attributes);

  expect(element).toEqual({
    type: "element",
    tagName: "del",
    attributes,
    children: [],
  });
});

test("DelElement.create - datetime属性を持つDelElementを作成する", () => {
  const attributes = {
    datetime: "2024-01-01T12:00:00Z",
  };
  const element = DelElement.create(attributes);

  expect(element).toEqual({
    type: "element",
    tagName: "del",
    attributes,
    children: [],
  });
});

test("DelElement.create - 子要素を指定してDelElementを作成する", () => {
  const children = [{ type: "text" as const, content: "削除されたテキスト" }];
  const element = DelElement.create({}, children);

  expect(element).toEqual({
    type: "element",
    tagName: "del",
    attributes: {},
    children,
  });
});

test("DelElement.create - 属性と子要素を指定してDelElementを作成する", () => {
  const attributes = {
    id: "del-1",
    cite: "https://example.com",
    datetime: "2024-01-01",
  };
  const children = [
    { type: "text" as const, content: "削除済み" },
    {
      type: "element" as const,
      tagName: "span" as const,
      attributes: { class: "highlight" },
      children: [],
    },
  ];
  const element = DelElement.create(attributes, children);

  expect(element).toEqual({
    type: "element",
    tagName: "del",
    attributes,
    children,
  });
});

test("DelElement.create - グローバル属性を正しく設定できる", () => {
  const attributes = {
    id: "global-del",
    class: "text-deleted",
    style: "text-decoration: line-through;",
    "data-version": "1.0",
    "aria-label": "削除されたコンテンツ",
  };
  const element = DelElement.create(attributes);

  expect(element.attributes).toEqual(attributes);
});

test("DelElement.create - ネストされた子要素を正しく設定できる", () => {
  const children = [
    { type: "text" as const, content: "前のテキスト" },
    {
      type: "element" as const,
      tagName: "strong" as const,
      attributes: {},
      children: [{ type: "text" as const, content: "強調" }],
    },
    { type: "text" as const, content: "後のテキスト" },
  ];
  const element = DelElement.create({}, children);

  expect(element.children).toEqual(children);
  expect(element.children).toHaveLength(3);
});
