import { test, expect } from "vitest";
import { ParagraphChildConverter } from "../paragraph-child-converter";
import { HTMLNode } from "../../../../../../models/html-node/html-node";

// =============================================================================
// ParagraphChildConverter.convert のテスト
// =============================================================================

test("ParagraphChildConverter.convert() - テキストノードを完全に変換できる", () => {
  // Arrange
  const textNode: HTMLNode = {
    type: "text",
    textContent: "段落テキスト",
  };

  // Act
  const result = ParagraphChildConverter.convert(textNode);

  // Assert
  expect(result).toBeDefined();
  expect(result?.node).toBeDefined();
  expect(result?.isText).toBe(true);
  expect(result?.isBold).toBe(false);
  expect(result?.isItalic).toBe(false);
});

test("ParagraphChildConverter.convert() - strong要素を太字として変換できる", () => {
  // Arrange
  const strongNode: HTMLNode = {
    type: "element",
    tagName: "strong",
    children: [{ type: "text", textContent: "太字テキスト" }],
  };

  // Act
  const result = ParagraphChildConverter.convert(strongNode);

  // Assert
  expect(result).toBeDefined();
  expect(result?.isBold).toBe(true);
  expect(result?.isItalic).toBe(false);
});

test("ParagraphChildConverter.convert() - em要素をイタリックとして変換できる", () => {
  // Arrange
  const emNode: HTMLNode = {
    type: "element",
    tagName: "em",
    children: [{ type: "text", textContent: "イタリックテキスト" }],
  };

  // Act
  const result = ParagraphChildConverter.convert(emNode);

  // Assert
  expect(result).toBeDefined();
  expect(result?.isBold).toBe(false);
  expect(result?.isItalic).toBe(true);
});

test("ParagraphChildConverter.convert() - 親スタイルを適用できる", () => {
  // Arrange
  const textNode: HTMLNode = {
    type: "text",
    textContent: "スタイル付きテキスト",
  };
  const parentStyle = "color: red; font-size: 16px;";

  // Act
  const result = ParagraphChildConverter.convert(textNode, parentStyle);

  // Assert
  expect(result).toBeDefined();
  expect(result?.node).toBeDefined();
});

test("ParagraphChildConverter.convert() - 要素タイプを指定できる", () => {
  // Arrange
  const textNode: HTMLNode = {
    type: "text",
    textContent: "テキスト",
  };

  // Act
  const result = ParagraphChildConverter.convert(textNode, undefined, "div");

  // Assert
  expect(result).toBeDefined();
  expect(result?.node).toBeDefined();
});
