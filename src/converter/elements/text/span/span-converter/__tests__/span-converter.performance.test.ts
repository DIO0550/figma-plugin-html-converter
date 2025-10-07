import { test, expect, beforeEach, afterEach } from "vitest";
import { SpanConverter } from "../span-converter";
import type { SpanElement } from "../../span-element";
import type { HTMLNode } from "../../../../../models/html-node";
import type { TextNodeConfig } from "../../../../../models/figma-node/text-node-config";

let startTime: number;
let endTime: number;

beforeEach(() => {
  startTime = 0;
  endTime = 0;
});

afterEach(() => {
  // Performance measurement is tracked in startTime and endTime variables
  // Duration can be calculated as endTime - startTime if needed
});

test("10万文字のテキストをSpanConverterは100ms以内に処理する", () => {
  const largeText = "a".repeat(100000);
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [{ type: "text", textContent: largeText }],
  };

  startTime = performance.now();
  const result = SpanConverter.toFigmaNode(element);
  endTime = performance.now();

  const duration = endTime - startTime;
  expect(duration).toBeLessThan(100);
  expect(result.content).toBe(largeText);
});

test("1000個の子要素をSpanConverterは50ms以内に処理する", () => {
  const manyChildren = Array.from({ length: 1000 }, (_, i) => ({
    type: "text" as const,
    textContent: `text${i}`,
  }));

  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: manyChildren,
  };

  startTime = performance.now();
  const result = SpanConverter.toFigmaNode(element);
  endTime = performance.now();

  const duration = endTime - startTime;
  expect(duration).toBeLessThan(50);
  expect(result.content).toContain("text0");
  expect(result.content).toContain("text999");
});

test("深さ10の複雑なネスト構造をSpanConverterは50ms以内に処理する", () => {
  const createNestedStructure = (depth: number): HTMLNode => {
    if (depth === 0) {
      return { type: "text", textContent: "leaf" };
    }
    return {
      type: "element",
      tagName: "strong",
      attributes: {},
      children: [
        createNestedStructure(depth - 1),
        { type: "text", textContent: ` level${depth} ` },
        createNestedStructure(depth - 1),
      ],
    };
  };

  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [createNestedStructure(10)],
  };

  startTime = performance.now();
  const result = SpanConverter.toFigmaNode(element);
  endTime = performance.now();

  const duration = endTime - startTime;
  expect(duration).toBeLessThan(50);
  expect(result.content).toContain("leaf");
});

test("100個のスタイルプロパティをSpanConverterは20ms以内に処理する", () => {
  const manyStyles = Array.from(
    { length: 100 },
    (_, i) => `property-${i}: value-${i}`,
  ).join("; ");

  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      style: manyStyles,
    },
    children: [],
  };

  startTime = performance.now();
  const result = SpanConverter.toFigmaNode(element);
  endTime = performance.now();

  const duration = endTime - startTime;
  expect(duration).toBeLessThan(20);
  expect(result.type).toBe("TEXT");
});

test("複雑なカラー変換をSpanConverterは10ms以内に処理する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      style: "color: #FF5733; background-color: rgba(100, 200, 150, 0.5);",
    },
    children: [],
  };

  startTime = performance.now();
  const result = SpanConverter.toFigmaNode(element);
  endTime = performance.now();

  const duration = endTime - startTime;
  expect(duration).toBeLessThan(10);
  expect(result.style.fills).toBeDefined();
});

test("同じspan要素を10000回繰り返し変換してもSpanConverterの平均実行時間は1ms未満", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      id: "test",
      class: "class1 class2 class3",
      style: "font-size: 20px; color: red;",
    },
    children: [
      { type: "text", textContent: "Hello " },
      { type: "text", textContent: "World" },
    ],
  };

  // メモリ使用量の間接的な測定（実行時間で代用）
  const iterations = 10000;
  startTime = performance.now();

  for (let i = 0; i < iterations; i++) {
    SpanConverter.toFigmaNode(element);
  }

  endTime = performance.now();
  const averageTime = (endTime - startTime) / iterations;

  // 平均実行時間が極端に増加しないことを確認
  expect(averageTime).toBeLessThan(1);
});

test("有効・無効な要素の型チェックをSpanConverter.mapToFigmaは10000回+7000回で200ms以内に実行する", () => {
  const validElement = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [],
  };

  const invalidElements = [
    null,
    undefined,
    {},
    { type: "wrong" },
    { tagName: "wrong" },
    "string",
    123,
  ];

  startTime = performance.now();

  // 有効な要素のチェック
  for (let i = 0; i < 10000; i++) {
    SpanConverter.mapToFigma(validElement);
  }

  // 無効な要素のチェック
  invalidElements.forEach((invalid) => {
    for (let i = 0; i < 1000; i++) {
      SpanConverter.mapToFigma(invalid);
    }
  });

  endTime = performance.now();
  const duration = endTime - startTime;

  expect(duration).toBeLessThan(200);
});

test("100個のspan要素の並行変換をSpanConverterは50ms以内に完了する", async () => {
  const createElement = (id: number): SpanElement => ({
    type: "element",
    tagName: "span",
    attributes: {
      id: `span-${id}`,
      style: "font-size: 16px; color: blue;",
    },
    children: [{ type: "text", textContent: `Content ${id}` }],
  });

  const promises: Promise<TextNodeConfig>[] = [];
  startTime = performance.now();

  // 100個の変換を並行実行
  for (let i = 0; i < 100; i++) {
    promises.push(
      new Promise((resolve) => {
        const result = SpanConverter.toFigmaNode(createElement(i));
        resolve(result);
      }),
    );
  }

  const results = await Promise.all(promises);
  endTime = performance.now();

  const duration = endTime - startTime;
  expect(duration).toBeLessThan(50);
  expect(results).toHaveLength(100);
  expect(results[0].content).toBe("Content 0");
  expect(results[99].content).toBe("Content 99");
});

test("同じspan要素を100回繰り返し変換してもSpanConverterのパフォーマンスは安定する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      style: "font-size: 18px; font-weight: bold; color: #333;",
    },
    children: [{ type: "text", textContent: "Optimized text" }],
  };

  const timings: number[] = [];

  // 100回実行して各回の時間を記録
  for (let i = 0; i < 100; i++) {
    const start = performance.now();
    SpanConverter.toFigmaNode(element);
    const end = performance.now();
    timings.push(end - start);
  }

  // 最初の10回と最後の10回の平均を比較
  const firstTenAvg = timings.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
  const lastTenAvg = timings.slice(-10).reduce((a, b) => a + b, 0) / 10;

  // パフォーマンスが劣化していないことを確認
  // CI環境での実行時間のばらつきを考慮して、より寛容な閾値を設定
  expect(lastTenAvg).toBeLessThanOrEqual(firstTenAvg * 10);
});
