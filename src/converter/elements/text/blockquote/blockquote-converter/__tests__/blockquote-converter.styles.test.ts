import { test, expect } from "vitest";
import { toFigmaNode } from "../blockquote-converter";
import type { BlockquoteElement } from "../../blockquote-element";
import type { TextNode } from "../../../common/types";

test("blockquote要素スタイル - 背景色とパディングのカスタムスタイルを適用できる", () => {
  const element: BlockquoteElement = {
    type: "element",
    tagName: "blockquote",
    attributes: {
      style: "background-color: #f5f5f5; padding: 16px; margin: 20px;",
    },
    children: [],
  };

  const result = toFigmaNode(element);

  // 背景色の確認
  expect(result.fills).toBeDefined();
  expect(result.fills!).toHaveLength(1);
  expect(result.fills![0].type).toBe("SOLID");
  if (result.fills![0].type === "SOLID") {
    expect(result.fills![0].color.r).toBeCloseTo(245 / 255, 2);
    expect(result.fills![0].color.g).toBeCloseTo(245 / 255, 2);
    expect(result.fills![0].color.b).toBeCloseTo(245 / 255, 2);
  }

  // パディングの確認
  expect(result.paddingTop).toBe(16);
  expect(result.paddingBottom).toBe(16);
  expect(result.paddingLeft).toBe(16);
  expect(result.paddingRight).toBe(16);
});

test("blockquote要素スタイル - 個別のパディング値を適用できる", () => {
  const element: BlockquoteElement = {
    type: "element",
    tagName: "blockquote",
    attributes: {
      style: "padding: 10px 20px 15px 40px;",
    },
    children: [],
  };

  const result = toFigmaNode(element);

  expect(result.paddingTop).toBe(10);
  expect(result.paddingRight).toBe(20);
  expect(result.paddingBottom).toBe(15);
  expect(result.paddingLeft).toBe(40);
});

test("blockquote要素スタイル - 左マージンスタイル（引用インデント）を適用できる", () => {
  const element: BlockquoteElement = {
    type: "element",
    tagName: "blockquote",
    attributes: {
      style: "margin-left: 40px;",
    },
    children: [],
  };

  const result = toFigmaNode(element);

  expect(result).toBeDefined();
  expect(result.type).toBe("FRAME");
});

test("blockquote要素スタイル - ボーダースタイルを適用できる", () => {
  const element: BlockquoteElement = {
    type: "element",
    tagName: "blockquote",
    attributes: {
      style: "border: 2px solid #cccccc;",
    },
    children: [],
  };

  const result = toFigmaNode(element);

  expect(result.strokes).toBeDefined();
  expect(result.strokeWeight).toBe(2);
});

test("blockquote要素スタイル - サイズスタイルを適用できる", () => {
  const element: BlockquoteElement = {
    type: "element",
    tagName: "blockquote",
    attributes: {
      style: "width: 400px; height: 200px;",
    },
    children: [],
  };

  const result = toFigmaNode(element);

  expect(result.width).toBe(400);
  expect(result.height).toBe(200);
});

test("blockquote要素スタイル - border-radiusスタイルを適用できる", () => {
  const element: BlockquoteElement = {
    type: "element",
    tagName: "blockquote",
    attributes: {
      style: "border-radius: 4px;",
    },
    children: [],
  };

  const result = toFigmaNode(element);

  expect(result.cornerRadius).toBe(4);
});

test("blockquote要素スタイル - テキストの配置スタイルを処理できる", () => {
  const element: BlockquoteElement = {
    type: "element",
    tagName: "blockquote",
    attributes: {
      style: "text-align: center;",
    },
    children: [
      {
        type: "text",
        textContent: "Centered quote",
      } as TextNode,
    ],
  };

  const result = toFigmaNode(element);

  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    content: "Centered quote",
    style: expect.objectContaining({
      textAlign: "CENTER",
    }),
  });
});

test("blockquote要素スタイル - フォントサイズスタイルを処理できる", () => {
  const element: BlockquoteElement = {
    type: "element",
    tagName: "blockquote",
    attributes: {
      style: "font-size: 16px;",
    },
    children: [
      {
        type: "text",
        textContent: "Quoted text",
      } as TextNode,
    ],
  };

  const result = toFigmaNode(element);

  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    style: expect.objectContaining({
      fontSize: 16,
    }),
  });
});

test("blockquote要素スタイル - カラースタイルを処理できる", () => {
  const element: BlockquoteElement = {
    type: "element",
    tagName: "blockquote",
    attributes: {
      style: "color: #666666;",
    },
    children: [
      {
        type: "text",
        textContent: "Gray quote",
      } as TextNode,
    ],
  };

  const result = toFigmaNode(element);

  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    style: expect.objectContaining({
      fills: [
        {
          type: "SOLID",
          color: {
            r: 102 / 255,
            g: 102 / 255,
            b: 102 / 255,
            a: 1,
          },
        },
      ],
    }),
  });
});
