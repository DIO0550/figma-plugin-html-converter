import { test, expect } from "vitest";
import { toFigmaNode } from "../pre-converter";
import type { PreElement } from "../../pre-element";

import type { TextNode } from "../../common/types";

test("pre要素スタイル - 背景色とパディングのカスタムスタイルを適用できる", () => {
  const element: PreElement = {
    type: "element",
    tagName: "pre",
    attributes: {
      style: "background-color: #f5f5f5; padding: 16px;",
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

test("pre要素スタイル - 個別のパディング値を適用できる", () => {
  const element: PreElement = {
    type: "element",
    tagName: "pre",
    attributes: {
      style: "padding: 8px 12px 16px 20px;",
    },
    children: [],
  };

  const result = toFigmaNode(element);

  expect(result.paddingTop).toBe(8);
  expect(result.paddingRight).toBe(12);
  expect(result.paddingBottom).toBe(16);
  expect(result.paddingLeft).toBe(20);
});

test("pre要素スタイル - フォントサイズスタイルを処理できる", () => {
  const element: PreElement = {
    type: "element",
    tagName: "pre",
    attributes: {
      style: "font-size: 14px;",
    },
    children: [
      {
        type: "text",
        textContent: "Code text",
      } as TextNode,
    ],
  };

  const result = toFigmaNode(element);

  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    style: expect.objectContaining({
      fontSize: 14,
    }),
  });
});

test("pre要素スタイル - 行の高さスタイルを処理できる", () => {
  const element: PreElement = {
    type: "element",
    tagName: "pre",
    attributes: {
      style: "line-height: 1.6;",
    },
    children: [
      {
        type: "text",
        textContent: "Code with line height",
      } as TextNode,
    ],
  };

  const result = toFigmaNode(element);

  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    style: expect.objectContaining({
      lineHeight: {
        unit: "PIXELS",
        value: 25.6, // 16 * 1.6
      },
    }),
  });
});

test("pre要素スタイル - カラースタイルを処理できる", () => {
  const element: PreElement = {
    type: "element",
    tagName: "pre",
    attributes: {
      style: "color: #24292e;",
    },
    children: [
      {
        type: "text",
        textContent: "Colored code",
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
            r: 36 / 255,
            g: 41 / 255,
            b: 46 / 255,
            a: 1,
          },
        },
      ],
    }),
  });
});

test("pre要素スタイル - 複数のテキストスタイルを組み合わせて適用できる", () => {
  const element: PreElement = {
    type: "element",
    tagName: "pre",
    attributes: {
      style: "font-size: 13px; line-height: 1.5; color: #586069;",
    },
    children: [
      {
        type: "text",
        textContent: "Styled code",
      } as TextNode,
    ],
  };

  const result = toFigmaNode(element);

  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    style: expect.objectContaining({
      fontSize: 13,
      lineHeight: {
        unit: "PIXELS",
        value: 19.5, // 13 * 1.5
      },
      fills: [
        {
          type: "SOLID",
          color: {
            r: 88 / 255,
            g: 96 / 255,
            b: 105 / 255,
            a: 1,
          },
        },
      ],
    }),
  });
});

test("pre要素スタイル - ボーダースタイルを適用できる", () => {
  const element: PreElement = {
    type: "element",
    tagName: "pre",
    attributes: {
      style: "border: 1px solid #d1d5da;",
    },
    children: [],
  };

  const result = toFigmaNode(element);

  expect(result.strokes).toBeDefined();
  expect(result.strokeWeight).toBe(1);
});

test("pre要素スタイル - サイズスタイルを適用できる", () => {
  const element: PreElement = {
    type: "element",
    tagName: "pre",
    attributes: {
      style: "width: 600px; height: 200px;",
    },
    children: [],
  };

  const result = toFigmaNode(element);

  expect(result.width).toBe(600);
  expect(result.height).toBe(200);
});

test("pre要素スタイル - border-radiusスタイルを適用できる", () => {
  const element: PreElement = {
    type: "element",
    tagName: "pre",
    attributes: {
      style: "border-radius: 6px;",
    },
    children: [],
  };

  const result = toFigmaNode(element);

  expect(result.cornerRadius).toBe(6);
});

test("pre要素スタイル - white-spaceスタイルを保持する", () => {
  const element: PreElement = {
    type: "element",
    tagName: "pre",
    attributes: {
      style: "white-space: pre-wrap;",
    },
    children: [
      {
        type: "text",
        textContent: "  Code with spaces  ",
      } as TextNode,
    ],
  };

  const result = toFigmaNode(element);

  // white-spaceの処理は内部で行われるため、contentが保持されていることを確認
  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    content: "  Code with spaces  ",
  });
});
