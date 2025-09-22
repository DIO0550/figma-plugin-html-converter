import { test, expect } from "vitest";
import { HeadingChildConverter } from "../heading-child-converter";
import { HTMLNode } from "../../../../../../models/html-node/html-node";

// =============================================================================
// HeadingChildConverter.convertAll のテスト
// =============================================================================

test("HeadingChildConverter.convertAll() - 複数の子要素を変換できる", () => {
  // Arrange
  const children: HTMLNode[] = [
    { type: "text", textContent: "見出し1" },
    {
      type: "element",
      tagName: "em",
      children: [{ type: "text", textContent: "イタリック" }],
    },
    { type: "text", textContent: "見出し2" },
  ];

  // Act
  const results = HeadingChildConverter.convertAll(children, undefined, "h1");

  // Assert
  expect(results).toHaveLength(3);
  expect(results[0].isText).toBe(true);
  expect(results[1].isItalic).toBe(true);
  expect(results[2].isText).toBe(true);
});

test("HeadingChildConverter.convertAll() - strong要素を通常テキストとして処理する", () => {
  // Arrange
  const children: HTMLNode[] = [
    {
      type: "element",
      tagName: "strong",
      children: [{ type: "text", textContent: "太字" }],
    },
    {
      type: "element",
      tagName: "b",
      children: [{ type: "text", textContent: "太字2" }],
    },
  ];

  // Act
  const results = HeadingChildConverter.convertAll(children, undefined, "h2");

  // Assert
  expect(results).toHaveLength(2);
  // 見出しでは太字は無視される
  expect(results[0].isBold).toBe(false);
  expect(results[1].isBold).toBe(false);
});

test("HeadingChildConverter.convertAll() - 空の配列を処理できる", () => {
  // Arrange
  const children: HTMLNode[] = [];

  // Act
  const results = HeadingChildConverter.convertAll(children);

  // Assert
  expect(results).toEqual([]);
});
