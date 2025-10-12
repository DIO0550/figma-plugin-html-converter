import { test, expect } from "vitest";
import { InsElement } from "../ins-element";

test("InsElement.create - デフォルト属性でInsElementを作成する", () => {
  const element = InsElement.create();

  expect(element).toEqual({
    type: "element",
    tagName: "ins",
    attributes: {},
    children: [],
  });
});

test("InsElement.create - 属性を指定してInsElementを作成する", () => {
  const attributes = {
    id: "ins-1",
    class: "inserted-text",
  };
  const element = InsElement.create(attributes);

  expect(element).toEqual({
    type: "element",
    tagName: "ins",
    attributes,
    children: [],
  });
});

test("InsElement.create - cite属性を持つInsElementを作成する", () => {
  const attributes = {
    cite: "https://example.com/reason",
  };
  const element = InsElement.create(attributes);

  expect(element).toEqual({
    type: "element",
    tagName: "ins",
    attributes,
    children: [],
  });
});

test("InsElement.create - datetime属性を持つInsElementを作成する", () => {
  const attributes = {
    datetime: "2024-01-01T12:00:00Z",
  };
  const element = InsElement.create(attributes);

  expect(element).toEqual({
    type: "element",
    tagName: "ins",
    attributes,
    children: [],
  });
});

test("InsElement.create - 子要素を指定してInsElementを作成する", () => {
  const children = [{ type: "text" as const, content: "挿入されたテキスト" }];
  const element = InsElement.create({}, children);

  expect(element).toEqual({
    type: "element",
    tagName: "ins",
    attributes: {},
    children,
  });
});

test("InsElement.create - 属性と子要素を指定してInsElementを作成する", () => {
  const attributes = {
    id: "ins-1",
    cite: "https://example.com",
    datetime: "2024-01-01",
  };
  const children = [
    { type: "text" as const, content: "挿入済み" },
    {
      type: "element" as const,
      tagName: "span" as const,
      attributes: { class: "highlight" },
      children: [],
    },
  ];
  const element = InsElement.create(attributes, children);

  expect(element).toEqual({
    type: "element",
    tagName: "ins",
    attributes,
    children,
  });
});

test("InsElement.create - グローバル属性を正しく設定できる", () => {
  const attributes = {
    id: "global-del",
    class: "text-inserted",
    style: "text-decoration: line-through;",
    "data-version": "1.0",
    "aria-label": "挿入されたコンテンツ",
  };
  const element = InsElement.create(attributes);

  expect(element.attributes).toEqual(attributes);
});

test("InsElement.create - ネストされた子要素を正しく設定できる", () => {
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
  const element = InsElement.create({}, children);

  expect(element.children).toEqual(children);
  expect(element.children).toHaveLength(3);
});
