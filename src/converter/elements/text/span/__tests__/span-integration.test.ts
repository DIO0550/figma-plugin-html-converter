import { test, expect } from "vitest";
import { SpanConverter } from "../span-converter";
import { SpanElement } from "../span-element";
import type { SpanElement as SpanElementType } from "../span-element";
import type { TextNodeConfig } from "../../../../models/figma-node/text-node-config";
import type { HTMLNode } from "../../../../models/html-node";

test("div要素内のspan要素がインライン要素として正しく振る舞う", () => {
  // divコンテナ内でのspan要素の動作を検証
  const spanElement = SpanElement.create(
    { class: "highlight", style: "color: blue;" },
    [{ type: "text", textContent: "インライン要素" }],
  );

  expect(SpanElement.isSpanElement(spanElement)).toBe(true);

  const figmaNode = SpanConverter.toFigmaNode(spanElement);
  expect(figmaNode.type).toBe("TEXT");
  expect(figmaNode.content).toBe("インライン要素");
});

test("ネストされたspan要素をSpanConverterは正しく処理してテキストを結合する", () => {
  const innerSpan: SpanElementType = {
    type: "element",
    tagName: "span",
    attributes: { style: "font-weight: bold;" },
    children: [{ type: "text", textContent: "強調" }],
  };

  const outerSpan: SpanElementType = {
    type: "element",
    tagName: "span",
    attributes: { style: "color: red;" },
    children: [
      { type: "text", textContent: "通常テキスト " },
      innerSpan as HTMLNode,
      { type: "text", textContent: " 続き" },
    ],
  };

  const result = SpanConverter.toFigmaNode(outerSpan);
  expect(result.content).toBe("通常テキスト 強調 続き");
  expect(result.style.fills).toBeDefined();
});

test("他のインライン要素（strong, em）との混在をSpanConverterは処理して全テキストを抽出する", () => {
  const complexSpan: SpanElementType = {
    type: "element",
    tagName: "span",
    attributes: { id: "complex" },
    children: [
      { type: "text", textContent: "通常 " },
      {
        type: "element",
        tagName: "strong",
        attributes: {},
        children: [{ type: "text", textContent: "太字" }],
      },
      { type: "text", textContent: " と " },
      {
        type: "element",
        tagName: "em",
        attributes: {},
        children: [{ type: "text", textContent: "斜体" }],
      },
      { type: "text", textContent: " の混在" },
    ],
  };

  const result = SpanConverter.toFigmaNode(complexSpan);
  expect(result.content).toBe("通常 太字 と 斜体 の混在");
  expect(result.name).toBe("span#complex");
});

test("ファクトリーで作成した要素をコンバーターで変換すると正しいFigmaノードが生成される", () => {
  // ファクトリーメソッドでの生成
  const element = SpanElement.create(
    {
      id: "factory-test",
      class: "primary secondary",
      style: "font-size: 24px; color: #0066CC;",
    },
    [
      { type: "text", textContent: "Factory " },
      { type: "text", textContent: "Created" },
    ],
  );

  // 型ガードでの検証
  expect(SpanElement.isSpanElement(element)).toBe(true);

  // アクセサーでの属性取得
  expect(SpanElement.getId(element)).toBe("factory-test");
  expect(SpanElement.getClass(element)).toBe("primary secondary");
  expect(SpanElement.getStyle(element)).toBe(
    "font-size: 24px; color: #0066CC;",
  );

  // コンバーターでの変換
  const figmaNode = SpanConverter.toFigmaNode(element);
  expect(figmaNode.type).toBe("TEXT");
  expect(figmaNode.name).toBe("span#factory-test.primary.secondary");
  expect(figmaNode.content).toBe("Factory Created");
  expect(figmaNode.style.fontSize).toBe(24);
});

test("mapToFigmaが有効なspan要素を正しく型チェックして変換する", () => {
  const validNode = {
    type: "element" as const,
    tagName: "span" as const,
    attributes: {
      style: "text-decoration: underline;",
    },
    children: [{ type: "text" as const, textContent: "Mapped content" }],
  };

  const result = SpanConverter.mapToFigma(validNode);
  expect(result).not.toBeNull();
  expect(result?.type).toBe("TEXT");
  expect((result as TextNodeConfig)?.content).toBe("Mapped content");
});

test("実際のHTMLパターン：ツールチップspan要素をSpanConverterは正しく処理する", () => {
  const tooltipSpan: SpanElementType = {
    type: "element",
    tagName: "span",
    attributes: {
      class: "tooltip",
      style: "position: relative; cursor: help;",
      title: "詳細情報",
    },
    children: [{ type: "text", textContent: "ホバーしてください" }],
  };

  const result = SpanConverter.toFigmaNode(tooltipSpan);
  expect(result.name).toBe("span.tooltip");
  expect(result.content).toBe("ホバーしてください");
});

test("実際のHTMLパターン：バッジspan要素をSpanConverterは正しく処理する", () => {
  const badgeSpan: SpanElementType = {
    type: "element",
    tagName: "span",
    attributes: {
      class: "badge badge-primary",
      style:
        "background-color: #007bff; color: white; padding: 0.25em 0.4em; border-radius: 0.25rem;",
    },
    children: [{ type: "text", textContent: "NEW" }],
  };

  const result = SpanConverter.toFigmaNode(badgeSpan);
  expect(result.name).toBe("span.badge.badge-primary");
  expect(result.content).toBe("NEW");
});

test("実際のHTMLパターン：インラインコードspan要素をSpanConverterは正しく処理する", () => {
  const codeSpan: SpanElementType = {
    type: "element",
    tagName: "span",
    attributes: {
      class: "code-inline",
      style:
        "font-family: 'Courier New', monospace; background-color: #f4f4f4;",
    },
    children: [{ type: "text", textContent: "const x = 42;" }],
  };

  const result = SpanConverter.toFigmaNode(codeSpan);
  expect(result.name).toBe("span.code-inline");
  expect(result.content).toBe("const x = 42;");
  expect(result.style.fontFamily).toBe("Courier New");
});

test("空のspan要素の完全なフローでSpanElementとSpanConverterが正しく連携する", () => {
  const emptySpan = SpanElement.create();

  expect(SpanElement.isSpanElement(emptySpan)).toBe(true);
  expect(SpanElement.getId(emptySpan)).toBeUndefined();
  expect(SpanElement.getClass(emptySpan)).toBeUndefined();
  expect(SpanElement.getStyle(emptySpan)).toBeUndefined();

  const figmaNode = SpanConverter.toFigmaNode(emptySpan);
  expect(figmaNode.type).toBe("TEXT");
  expect(figmaNode.content).toBe("");
  expect(figmaNode.name).toBe("span");
});

test("すべての属性を持つspan要素の完全なフローでSpanElementとSpanConverterが正しく連携する", () => {
  const fullSpan = SpanElement.create(
    {
      id: "full-test",
      class: "class1 class2 class3",
      style: "font-size: 18px; font-weight: 600; color: #333333;",
      title: "Full test element",
      lang: "ja",
      dir: "ltr",
    },
    [{ type: "text", textContent: "完全なテスト要素" }],
  );

  // 各アクセサーのテスト
  expect(SpanElement.getId(fullSpan)).toBe("full-test");
  expect(SpanElement.getClass(fullSpan)).toBe("class1 class2 class3");
  expect(SpanElement.getStyle(fullSpan)).toContain("font-size: 18px");

  // コンバージョンのテスト
  const figmaNode = SpanConverter.toFigmaNode(fullSpan);
  expect(figmaNode.name).toBe("span#full-test.class1.class2.class3");
  expect(figmaNode.content).toBe("完全なテスト要素");
  expect(figmaNode.style.fontSize).toBe(18);
  expect(figmaNode.style.fontWeight).toBe(600);
});

test("同じspan要素入力に対してSpanConverterは常に同じ出力を返す", () => {
  const element: SpanElementType = {
    type: "element",
    tagName: "span",
    attributes: {
      id: "consistency-test",
      style: "font-size: 20px;",
    },
    children: [{ type: "text", textContent: "Consistent" }],
  };

  const result1 = SpanConverter.toFigmaNode(element);
  const result2 = SpanConverter.toFigmaNode(element);
  const result3 = SpanConverter.toFigmaNode(element);

  expect(result1).toEqual(result2);
  expect(result2).toEqual(result3);
});

test("属性の順序が異なってもSpanConverterは同じ結果を生成する", () => {
  const element1: SpanElementType = {
    type: "element",
    tagName: "span",
    attributes: {
      id: "order-test",
      class: "test",
      style: "color: red;",
    },
    children: [],
  };

  const element2: SpanElementType = {
    type: "element",
    tagName: "span",
    attributes: {
      style: "color: red;",
      id: "order-test",
      class: "test",
    },
    children: [],
  };

  const result1 = SpanConverter.toFigmaNode(element1);
  const result2 = SpanConverter.toFigmaNode(element2);

  expect(result1.name).toBe(result2.name);
  expect(result1.style).toEqual(result2.style);
});
