import { test, expect } from "vitest";
import { toFigmaNode } from "../blockquote-converter";
import type { BlockquoteElement } from "../../blockquote-element";

test("toFigmaNode - シンプルなblockquote要素をFigmaノードに変換できる", () => {
  const element: BlockquoteElement = {
    type: "element",
    tagName: "blockquote",
    attributes: {},
    children: [],
  };

  const result = toFigmaNode(element);

  expect(result.type).toBe("FRAME");
  expect(result.name).toBe("blockquote");
  expect(result.children).toEqual([]);
  expect(result.layoutMode).toBe("VERTICAL");
  expect(result.layoutSizingHorizontal).toBe("FILL");
});

test("toFigmaNode - 空のblockquote要素でも正しく処理される", () => {
  const element: BlockquoteElement = {
    type: "element",
    tagName: "blockquote",
    attributes: {},
    children: [],
  };

  const result = toFigmaNode(element);
  expect(result).toBeDefined();
  expect(result.type).toBe("FRAME");
});

test("toFigmaNode - テキストコンテンツを持つblockquote要素を変換できる", () => {
  const element: BlockquoteElement = {
    type: "element",
    tagName: "blockquote",
    attributes: {},
    children: [
      { type: "text" as const, textContent: "This is a famous quote." },
    ],
  };

  const result = toFigmaNode(element);

  expect(result.children!).toHaveLength(1);
  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    content: "This is a famous quote.",
  });
});

test("toFigmaNode - cite属性を持つblockquote要素を変換できる", () => {
  const element: BlockquoteElement = {
    type: "element",
    tagName: "blockquote",
    attributes: {
      cite: "https://example.com/source",
    },
    children: [],
  };

  const result = toFigmaNode(element);

  expect(result).toBeDefined();
  expect(result.type).toBe("FRAME");
  expect(result.name).toBe("blockquote");
});

test("toFigmaNode - 複数の子要素を持つblockquote要素を変換できる", () => {
  const element: BlockquoteElement = {
    type: "element",
    tagName: "blockquote",
    attributes: {},
    children: [
      { type: "text" as const, textContent: "First line." },
      { type: "text" as const, textContent: "Second line." },
    ],
  };

  const result = toFigmaNode(element);

  expect(result.children!).toHaveLength(2);
});

test("toFigmaNode - スタイル属性なしでも変換できる", () => {
  const element: BlockquoteElement = {
    type: "element",
    tagName: "blockquote",
    attributes: {
      id: "quote-1",
      class: "quote-block",
    },
    children: [],
  };

  const result = toFigmaNode(element);
  expect(result).toBeDefined();
  expect(result.type).toBe("FRAME");
});
