import { test, expect } from "vitest";
import { toFigmaNode } from "../p-converter";
import type { PElement } from "../../p-element";

type TextNode = {
  type: "text";
  content: string;
};

test("p要素スタイル - 背景色とパディングのカスタムスタイルを適用できる", () => {
  const element: PElement = {
    type: "element",
    tagName: "p",
    attributes: {
      style: "background-color: #f0f0f0; padding: 10px; margin: 20px;",
    },
    children: [],
  };

  const result = toFigmaNode(element);

  // 背景色の確認
  expect(result.fills).toBeDefined();
  expect(result.fills!).toHaveLength(1);
  expect(result.fills![0].type).toBe("SOLID");
  if (result.fills![0].type === "SOLID") {
    expect(result.fills![0].color.r).toBeCloseTo(240 / 255, 2);
    expect(result.fills![0].color.g).toBeCloseTo(240 / 255, 2);
    expect(result.fills![0].color.b).toBeCloseTo(240 / 255, 2);
  }

  // パディングの確認
  expect(result.paddingTop).toBe(10);
  expect(result.paddingBottom).toBe(10);
  expect(result.paddingLeft).toBe(10);
  expect(result.paddingRight).toBe(10);
});

test("p要素スタイル - 個別のパディング値を適用できる", () => {
  const element: PElement = {
    type: "element",
    tagName: "p",
    attributes: {
      style: "padding: 5px 10px 15px 20px;",
    },
    children: [],
  };

  const result = toFigmaNode(element);

  expect(result.paddingTop).toBe(5);
  expect(result.paddingRight).toBe(10);
  expect(result.paddingBottom).toBe(15);
  expect(result.paddingLeft).toBe(20);
});

test("p要素スタイル - テキストの配置スタイルを処理できる", () => {
  const element: PElement = {
    type: "element",
    tagName: "p",
    attributes: {
      style: "text-align: center;",
    },
    children: [
      {
        type: "text",
        content: "Centered paragraph",
      } as TextNode,
    ],
  };

  const result = toFigmaNode(element);

  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    content: "Centered paragraph",
    style: expect.objectContaining({
      textAlign: "CENTER",
    }),
  });
});

test("p要素スタイル - フォントサイズスタイルを処理できる", () => {
  const element: PElement = {
    type: "element",
    tagName: "p",
    attributes: {
      style: "font-size: 18px;",
    },
    children: [
      {
        type: "text",
        content: "Larger text",
      } as TextNode,
    ],
  };

  const result = toFigmaNode(element);

  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    style: expect.objectContaining({
      fontSize: 18,
    }),
  });
});

test("p要素スタイル - 行の高さスタイルを処理できる", () => {
  const element: PElement = {
    type: "element",
    tagName: "p",
    attributes: {
      style: "line-height: 1.8;",
    },
    children: [
      {
        type: "text",
        content: "Paragraph with custom line height",
      } as TextNode,
    ],
  };

  const result = toFigmaNode(element);

  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    style: expect.objectContaining({
      lineHeight: {
        unit: "PIXELS",
        value: 28.8, // 16 * 1.8
      },
    }),
  });
});

test("p要素スタイル - カラースタイルを処理できる", () => {
  const element: PElement = {
    type: "element",
    tagName: "p",
    attributes: {
      style: "color: #333333;",
    },
    children: [
      {
        type: "text",
        content: "Colored text",
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
            r: 51 / 255,
            g: 51 / 255,
            b: 51 / 255,
            a: 1,
          },
        },
      ],
    }),
  });
});

test("p要素スタイル - 複数のテキストスタイルを組み合わせて適用できる", () => {
  const element: PElement = {
    type: "element",
    tagName: "p",
    attributes: {
      style:
        "font-size: 20px; line-height: 1.5; text-align: right; color: #ff0000;",
    },
    children: [
      {
        type: "text",
        content: "Styled text",
      } as TextNode,
    ],
  };

  const result = toFigmaNode(element);

  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    style: expect.objectContaining({
      fontSize: 20,
      lineHeight: {
        unit: "PIXELS",
        value: 30, // 20 * 1.5
      },
      textAlign: "RIGHT",
      fills: [
        {
          type: "SOLID",
          color: {
            r: 1,
            g: 0,
            b: 0,
            a: 1,
          },
        },
      ],
    }),
  });
});

test("p要素スタイル - ボーダースタイルを適用できる", () => {
  const element: PElement = {
    type: "element",
    tagName: "p",
    attributes: {
      style: "border: 2px solid #000000;",
    },
    children: [],
  };

  const result = toFigmaNode(element);

  expect(result.strokes).toBeDefined();
  expect(result.strokeWeight).toBe(2);
});

test("p要素スタイル - サイズスタイルを適用できる", () => {
  const element: PElement = {
    type: "element",
    tagName: "p",
    attributes: {
      style: "width: 300px; height: 100px;",
    },
    children: [],
  };

  const result = toFigmaNode(element);

  expect(result.width).toBe(300);
  expect(result.height).toBe(100);
});

test("p要素スタイル - border-radiusスタイルを適用できる", () => {
  const element: PElement = {
    type: "element",
    tagName: "p",
    attributes: {
      style: "border-radius: 8px;",
    },
    children: [],
  };

  const result = toFigmaNode(element);

  expect(result.cornerRadius).toBe(8);
});
