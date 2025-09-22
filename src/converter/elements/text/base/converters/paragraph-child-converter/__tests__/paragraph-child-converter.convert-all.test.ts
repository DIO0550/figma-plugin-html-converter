import { test, expect } from "vitest";
import { ParagraphChildConverter } from "../paragraph-child-converter";
import { HTMLNode } from "../../../../../../models/html-node/html-node";

// =============================================================================
// ParagraphChildConverter.convertAll のテスト
// =============================================================================

test("ParagraphChildConverter.convertAll() - 複数の子要素を変換できる", () => {
  // Arrange
  const children: HTMLNode[] = [
    { type: "text", textContent: "テキスト1" },
    {
      type: "element",
      tagName: "strong",
      children: [{ type: "text", textContent: "太字" }],
    },
    {
      type: "element",
      tagName: "em",
      children: [{ type: "text", textContent: "イタリック" }],
    },
  ];

  // Act
  const results = ParagraphChildConverter.convertAll(children);

  // Assert
  expect(results).toHaveLength(3);
  expect(results[0].isText).toBe(true);
  expect(results[1].isBold).toBe(true);
  expect(results[2].isItalic).toBe(true);
});

test("ParagraphChildConverter.convertAll() - 空の配列を処理できる", () => {
  // Arrange
  const children: HTMLNode[] = [];

  // Act
  const results = ParagraphChildConverter.convertAll(children);

  // Assert
  expect(results).toEqual([]);
});

test("ParagraphChildConverter.convertAll() - nullの結果をフィルタリングする", () => {
  // Arrange
  const children: HTMLNode[] = [
    { type: "text", textContent: "有効" },
    {
      type: "element",
      tagName: "span",
      children: [], // 空のコンテンツ
    },
    { type: "text", textContent: "有効2" },
  ];

  // Act
  const results = ParagraphChildConverter.convertAll(children);

  // Assert
  expect(results).toHaveLength(2);
});
