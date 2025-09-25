import { test, expect } from "vitest";
import { HeadingChildConverter } from "../heading-child-converter";
import { HTMLNode } from "../../../../../../models/html-node/html-node";

// =============================================================================
// HeadingChildConverter.convert のテスト
// =============================================================================

test("HeadingChildConverter.convert() - テキストノードを完全に変換できる", () => {
  // Arrange
  const textNode: HTMLNode = {
    type: "text",
    textContent: "見出しテキスト",
  };

  // Act
  const result = HeadingChildConverter.convert(textNode);

  // Assert
  expect(result).toBeDefined();
  expect(result?.node).toBeDefined();
  expect(result?.isText).toBe(true);
  expect(result?.isBold).toBe(false);
  expect(result?.isItalic).toBe(false);
});

test("HeadingChildConverter.convert() - strong要素を通常テキストとして変換する", () => {
  // Arrange
  const strongNode: HTMLNode = {
    type: "element",
    tagName: "strong",
    children: [{ type: "text", textContent: "太字見出し" }],
  };

  // Act
  const result = HeadingChildConverter.convert(strongNode, undefined, "h2");

  // Assert
  expect(result).toBeDefined();
  // 見出しでは太字は無視される
  expect(result?.isBold).toBe(false);
  expect(result?.isText).toBe(true);
});

test("HeadingChildConverter.convert() - em要素をイタリックとして変換する", () => {
  // Arrange
  const emNode: HTMLNode = {
    type: "element",
    tagName: "em",
    children: [{ type: "text", textContent: "イタリック見出し" }],
  };

  // Act
  const result = HeadingChildConverter.convert(emNode, undefined, "h3");

  // Assert
  expect(result).toBeDefined();
  expect(result?.isItalic).toBe(true);
  expect(result?.isBold).toBe(false);
});

test("HeadingChildConverter.convert() - 親スタイルを適用できる", () => {
  // Arrange
  const textNode: HTMLNode = {
    type: "text",
    textContent: "スタイル付き見出し",
  };
  const parentStyle = "color: green; font-size: 32px;";

  // Act
  const result = HeadingChildConverter.convert(textNode, parentStyle, "h1");

  // Assert
  expect(result).toBeDefined();
  expect(result?.node).toBeDefined();
});

test("HeadingChildConverter.convert() - デフォルトでh1として処理する", () => {
  // Arrange
  const textNode: HTMLNode = {
    type: "text",
    textContent: "見出し",
  };

  // Act
  const result = HeadingChildConverter.convert(textNode);

  // Assert
  expect(result).toBeDefined();
  expect(result?.node).toBeDefined();
});
