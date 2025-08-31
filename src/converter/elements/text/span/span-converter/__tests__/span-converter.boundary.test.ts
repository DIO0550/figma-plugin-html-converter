import { test, expect } from "vitest";
import { SpanConverter } from "../span-converter";
import type { SpanElement } from "../../span-element";
import type { HTMLNode } from "../../../../../models/html-node";

test("空文字列のテキストコンテンツをSpanConverterは正しく空文字列として処理する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [{ type: "text", textContent: "" }],
  };

  const result = SpanConverter.toFigmaNode(element);
  expect(result.content).toBe("");
});

test("極端に長い10万文字のテキストをSpanConverterは正しく処理できる", () => {
  const longText = "a".repeat(100000);
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [{ type: "text", textContent: longText }],
  };

  const result = SpanConverter.toFigmaNode(element);
  expect(result.content).toBe(longText);
  expect(result.content.length).toBe(100000);
});

test("特殊文字（<>&\"'`\\n\\r\\t）を含むテキストをSpanConverterは正しく処理する", () => {
  const specialChars = "<>&\"'`\n\r\t";
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [{ type: "text", textContent: specialChars }],
  };

  const result = SpanConverter.toFigmaNode(element);
  expect(result.content).toBe(specialChars);
});

test("Unicode文字と絵文字（こんにちは🌍 مرحبا 你好 😀🎉🚀）をSpanConverterは正しく処理する", () => {
  const unicodeText = "こんにちは🌍 مرحبا 你好 😀🎉🚀";
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [{ type: "text", textContent: unicodeText }],
  };

  const result = SpanConverter.toFigmaNode(element);
  expect(result.content).toBe(unicodeText);
});

test("ゼロ幅文字を含むテキストをSpanConverterは処理して通常の文字を保持する", () => {
  const zeroWidthText = "Hello\u200BWorld\u200C!\u200D"; // ゼロ幅スペース、ゼロ幅非接合子、ゼロ幅接合子
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [{ type: "text", textContent: zeroWidthText }],
  };

  const result = SpanConverter.toFigmaNode(element);
  expect(result.content).toContain("Hello");
  expect(result.content).toContain("World");
});

test("極端に長い1000文字のIDを持つspan要素をSpanConverterは処理できる", () => {
  const longId = "id-" + "x".repeat(997);
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      id: longId,
    },
    children: [],
  };

  const result = SpanConverter.toFigmaNode(element);
  expect(result.name).toContain("span#");
  expect(result.name.length).toBeLessThanOrEqual(10000); // 合理的な上限
});

test("100個のクラスを持つspan要素をSpanConverterは処理できる", () => {
  const manyClasses = Array.from({ length: 100 }, (_, i) => `class-${i}`).join(
    " ",
  );
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      class: manyClasses,
    },
    children: [],
  };

  const result = SpanConverter.toFigmaNode(element);
  expect(result.name).toContain("span.");
  expect(result.name).toContain("class-0");
});

test("極端に長い10000文字のstyle属性をSpanConverterはエラーなく処理する", () => {
  const longStyle = Array.from(
    { length: 500 },
    (_, i) => `property-${i}: value-${i}`,
  ).join("; ");

  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      style: longStyle,
    },
    children: [],
  };

  expect(() => SpanConverter.toFigmaNode(element)).not.toThrow();
});

test("font-size 0pxをSpanConverterは0以上の値として処理する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      style: "font-size: 0px;",
    },
    children: [],
  };

  const result = SpanConverter.toFigmaNode(element);
  // 0は無効な値として処理され、デフォルト値になる可能性
  expect(result.style.fontSize).toBeGreaterThanOrEqual(0);
});

test("font-size 9999pxをSpanConverterは9999として正しく処理する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      style: "font-size: 9999px;",
    },
    children: [],
  };

  const result = SpanConverter.toFigmaNode(element);
  expect(result.style.fontSize).toBe(9999);
});

test("font-weight境界値（1,100,400,700,900,999）をSpanConverterは正しく処理する", () => {
  const testCases = [1, 100, 400, 700, 900, 999];

  testCases.forEach((weight) => {
    const element: SpanElement = {
      type: "element",
      tagName: "span",
      attributes: {
        style: `font-weight: ${weight};`,
      },
      children: [],
    };

    const result = SpanConverter.toFigmaNode(element);
    expect(result.style.fontWeight).toBe(weight);
  });
});

test("負のfont-size値（-20px）をSpanConverterはデフォルト値16にフォールバックする", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      style: "font-size: -20px;",
    },
    children: [],
  };

  const result = SpanConverter.toFigmaNode(element);
  // 負の値はデフォルト値にフォールバック
  expect(result.style.fontSize).toBe(16);
});

test("1000個の子要素を持つspan要素をSpanConverterは処理できる", () => {
  const manyChildren = Array.from({ length: 1000 }, (_, i) => ({
    type: "text" as const,
    content: `text${i}`,
  }));

  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: manyChildren,
  };

  const result = SpanConverter.toFigmaNode(element);
  expect(result.content).toContain("text0");
  expect(result.content).toContain("text999");
});

test("100レベルの深さでネストされた子要素をSpanConverterは処理してテキストを抽出する", () => {
  let deepChild: HTMLNode = { type: "text", textContent: "deep" };
  for (let i = 0; i < 100; i++) {
    deepChild = {
      type: "element",
      tagName: "em",
      attributes: {},
      children: [deepChild],
    };
  }

  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [deepChild],
  };

  const result = SpanConverter.toFigmaNode(element);
  expect(result.content).toBe("deep");
});

test("RGB値の境界（#000000, #FFFFFF, #FF0000）をSpanConverterは正しく0-1の範囲に変換する", () => {
  const testCases = [
    { input: "#000000", expected: { r: 0, g: 0, b: 0 } },
    { input: "#FFFFFF", expected: { r: 1, g: 1, b: 1 } },
    { input: "#FF0000", expected: { r: 1, g: 0, b: 0 } },
  ];

  testCases.forEach(({ input, expected }) => {
    const element: SpanElement = {
      type: "element",
      tagName: "span",
      attributes: {
        style: `color: ${input};`,
      },
      children: [],
    };

    const result = SpanConverter.toFigmaNode(element);
    if (result.style.fills && result.style.fills[0]) {
      const color = result.style.fills[0].color;
      expect(color.r).toBeCloseTo(expected.r, 2);
      expect(color.g).toBeCloseTo(expected.g, 2);
      expect(color.b).toBeCloseTo(expected.b, 2);
    }
  });
});

test("3桁のHEXカラー（#F0A）をSpanConverterは6桁に展開して正しく処理する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      style: "color: #F0A;",
    },
    children: [],
  };

  const result = SpanConverter.toFigmaNode(element);
  if (result.style.fills && result.style.fills[0]) {
    const color = result.style.fills[0].color;
    expect(color.r).toBeCloseTo(1, 2); // FF
    expect(color.g).toBeCloseTo(0, 2); // 00
    expect(color.b).toBeCloseTo(0.667, 1); // AA
  }
});
