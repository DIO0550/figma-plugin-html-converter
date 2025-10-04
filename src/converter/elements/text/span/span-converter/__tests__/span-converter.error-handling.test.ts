import { test, expect } from "vitest";
import { SpanConverter } from "../span-converter";
import type { SpanElement } from "../../span-element";
import type { HTMLNode } from "../../../../../models/html-node";

test("循環参照を持つ子要素を処理してもSpanConverterはクラッシュしない", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const circularElement: any = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [],
  };
  // 循環参照を作成
  circularElement.children = [circularElement];

  expect(() => SpanConverter.toFigmaNode(circularElement)).not.toThrow();
});

test("極端に深いネスト（1000レベル）でもSpanConverterはスタックオーバーフローしない", () => {
  let deepNest: HTMLNode = { type: "text", textContent: "deepest" };
  for (let i = 0; i < 1000; i++) {
    deepNest = {
      type: "element",
      tagName: "strong",
      attributes: {},
      children: [deepNest],
    };
  }

  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [deepNest],
  };

  expect(() => SpanConverter.toFigmaNode(element)).not.toThrow();
});

test("不正なstyle属性値を含むspan要素でもSpanConverterはクラッシュしない", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      style: "font-size: invalid; color: not-a-color; font-weight: ???",
    },
    children: [],
  };

  expect(() => SpanConverter.toFigmaNode(element)).not.toThrow();
  const result = SpanConverter.toFigmaNode(element);
  expect(result.type).toBe("TEXT");
});

test("undefinedやnullを含む子要素を持つspan要素をSpanConverterは適切に処理して有効なテキストのみ抽出する", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element: any = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [
      null,
      undefined,
      { type: "text", textContent: "valid" },
      { type: "invalid" },
    ],
  };

  expect(() => SpanConverter.toFigmaNode(element)).not.toThrow();
  const result = SpanConverter.toFigmaNode(element);
  expect(result.content).toBe("valid");
});

test("巨大な属性値（10000文字のクラス名）を持つspan要素でもSpanConverterはメモリエラーを起こさない", () => {
  const hugeClass = "class-".repeat(10000);
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      class: hugeClass,
    },
    children: [],
  };

  expect(() => SpanConverter.toFigmaNode(element)).not.toThrow();
  const result = SpanConverter.toFigmaNode(element);
  expect(result.name).toContain("span.");
});

test("不正なRGBカラー値（999,999,999）を含むstyleをSpanConverterは255にクランプして処理する", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      style: "color: rgb(999, 999, 999); background: invalid",
    },
    children: [],
  };

  const result = SpanConverter.toFigmaNode(element);
  // RGB値は0-255の範囲にクランプされ、正規化される（999→255→1.0）
  expect(result.style.fills).toEqual([
    {
      type: "SOLID",
      color: {
        r: 1,
        g: 1,
        b: 1,
        a: 1,
      },
    },
  ]);
});

test("不正なfont-size値（huge, -10px）をSpanConverterはデフォルト値16pxにフォールバックする", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      style: "font-size: huge; font-size: -10px",
    },
    children: [],
  };

  const result = SpanConverter.toFigmaNode(element);
  expect(result.style.fontSize).toBe(16); // デフォルト値
});

test("セミコロンなしのスタイル定義を含むspan要素でもSpanConverterはクラッシュしない", () => {
  const element: SpanElement = {
    type: "element",
    tagName: "span",
    attributes: {
      style: "color: red font-size: 20px font-weight: bold",
    },
    children: [],
  };

  expect(() => SpanConverter.toFigmaNode(element)).not.toThrow();
});

test("完全に不正な構造のオブジェクトに対してSpanConverter.mapToFigmaはnullを返す", () => {
  const invalid = { foo: "bar" };
  expect(SpanConverter.mapToFigma(invalid)).toBeNull();
});

test("空オブジェクトに対してSpanConverter.mapToFigmaはnullを返す", () => {
  expect(SpanConverter.mapToFigma({})).toBeNull();
});

test("型が一部欠けているオブジェクトに対してSpanConverter.mapToFigmaはnullを返す", () => {
  const partial = { type: "element" };
  expect(SpanConverter.mapToFigma(partial)).toBeNull();
});

test("様々な不正な入力に対してSpanConverter.mapToFigmaはエラーをスローしない", () => {
  const testCases = [
    null,
    undefined,
    123,
    "string",
    [],
    { type: null, tagName: "span" },
    { type: "element", tagName: null },
  ];

  testCases.forEach((testCase) => {
    expect(() => SpanConverter.mapToFigma(testCase)).not.toThrow();
  });
});
