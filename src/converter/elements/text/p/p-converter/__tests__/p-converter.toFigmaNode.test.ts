import { test, expect } from "vitest";
import { toFigmaNode } from "../p-converter";
import type { PElement } from "../../p-element";

test("toFigmaNode - シンプルなp要素をFigmaノードに変換できる", () => {
  const element: PElement = {
    type: "element",
    tagName: "p",
    attributes: {},
    children: [],
  };

  const result = toFigmaNode(element);

  expect(result.type).toBe("FRAME");
  expect(result.name).toBe("p");
  expect(result.children).toEqual([]);
  expect(result.layoutMode).toBe("VERTICAL");
  expect(result.layoutSizingHorizontal).toBe("FILL");
});

test("toFigmaNode - 空のp要素でも正しく処理される", () => {
  const element: PElement = {
    type: "element",
    tagName: "p",
    attributes: {},
    children: [],
  };

  const result = toFigmaNode(element);
  expect(result).toBeDefined();
  expect(result.type).toBe("FRAME");
});

test("toFigmaNode - テキストコンテンツを持つp要素を変換できる", () => {
  const element: PElement = {
    type: "element",
    tagName: "p",
    attributes: {},
    children: [{ type: "text" as const, textContent: "Hello, World!" }],
  };

  const result = toFigmaNode(element);

  expect(result.children!).toHaveLength(1);
  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    content: "Hello, World!",
  });
});

test("toFigmaNode - 複数のテキストノードを処理できる", () => {
  const element: PElement = {
    type: "element",
    tagName: "p",
    attributes: {},
    children: [
      { type: "text" as const, textContent: "First " },
      { type: "text" as const, textContent: "Second" },
    ],
  };

  const result = toFigmaNode(element);

  expect(result.children!).toHaveLength(2);
  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    content: "First ",
  });
  expect(result.children![1]).toMatchObject({
    type: "TEXT",
    content: "Second",
  });
});

test("toFigmaNode - インライン要素を含むp要素を変換できる - strong要素", () => {
  const element: PElement = {
    type: "element",
    tagName: "p",
    attributes: {},
    children: [
      { type: "text" as const, textContent: "Normal text " },
      {
        type: "element" as const,
        tagName: "strong",
        attributes: {},
        children: [{ type: "text" as const, textContent: "Bold text" }],
      },
    ],
  };

  const result = toFigmaNode(element);

  expect(result.children!).toHaveLength(2);
  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    content: "Normal text ",
  });
  expect(result.children![1]).toMatchObject({
    type: "TEXT",
    content: "Bold text",
    style: expect.objectContaining({
      fontWeight: 700,
    }),
  });
});

test("toFigmaNode - インライン要素を含むp要素を変換できる - em要素", () => {
  const element: PElement = {
    type: "element",
    tagName: "p",
    attributes: {},
    children: [
      {
        type: "element" as const,
        tagName: "em",
        attributes: {},
        children: [{ type: "text" as const, textContent: "Italic text" }],
      },
    ],
  };

  const result = toFigmaNode(element);

  expect(result.children!).toHaveLength(1);
  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    content: "Italic text",
    style: expect.objectContaining({
      fontStyle: "ITALIC",
    }),
  });
});

test("toFigmaNode - b要素を太字として処理できる", () => {
  const element: PElement = {
    type: "element",
    tagName: "p",
    attributes: {},
    children: [
      {
        type: "element" as const,
        tagName: "b",
        attributes: {},
        children: [{ type: "text" as const, textContent: "Bold text" }],
      },
    ],
  };

  const result = toFigmaNode(element);

  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    content: "Bold text",
    style: expect.objectContaining({
      fontWeight: 700,
    }),
  });
});

test("toFigmaNode - i要素を斜体として処理できる", () => {
  const element: PElement = {
    type: "element",
    tagName: "p",
    attributes: {},
    children: [
      {
        type: "element" as const,
        tagName: "i",
        attributes: {},
        children: [{ type: "text" as const, textContent: "Italic text" }],
      },
    ],
  };

  const result = toFigmaNode(element);

  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    content: "Italic text",
    style: expect.objectContaining({
      fontStyle: "ITALIC",
    }),
  });
});

test("toFigmaNode - 未知の要素をテキストとして処理できる", () => {
  const element: PElement = {
    type: "element",
    tagName: "p",
    attributes: {},
    children: [
      {
        type: "element" as const,
        tagName: "span",
        attributes: {},
        children: [{ type: "text" as const, textContent: "Span text" }],
      },
    ],
  };

  const result = toFigmaNode(element);

  expect(result.children!).toHaveLength(1);
  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    content: "Span text",
  });
});
