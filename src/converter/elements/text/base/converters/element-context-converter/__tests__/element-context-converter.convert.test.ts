import { test, expect } from "vitest";
import { ElementContextConverter } from "../element-context-converter";
import { HTMLNode } from "../../../../../../models/html-node/html-node";

// =============================================================================
// ElementContextConverter.convert のテスト
// =============================================================================

test("ElementContextConverter.convert() - 見出し要素として変換できる", () => {
  // Arrange
  const textNode: HTMLNode = {
    type: "text",
    textContent: "見出しテキスト",
  };

  // Act
  const result = ElementContextConverter.convert(textNode, undefined, "h1");

  // Assert
  expect(result).toBeDefined();
  expect(result?.node).toBeDefined();
  expect(result?.isText).toBe(true);
});

test("ElementContextConverter.convert() - 段落要素として変換できる", () => {
  // Arrange
  const textNode: HTMLNode = {
    type: "text",
    textContent: "段落テキスト",
  };

  // Act
  const result = ElementContextConverter.convert(textNode, undefined, "p");

  // Assert
  expect(result).toBeDefined();
  expect(result?.node).toBeDefined();
  expect(result?.isText).toBe(true);
});

test("ElementContextConverter.convert() - スタイル付きで変換できる", () => {
  // Arrange
  const textNode: HTMLNode = {
    type: "text",
    textContent: "スタイル付きテキスト",
  };
  const parentStyle = "color: red; font-size: 16px;";

  // Act
  const result = ElementContextConverter.convert(textNode, parentStyle, "p");

  // Assert
  expect(result).toBeDefined();
  expect(result?.node).toBeDefined();
});

test("ElementContextConverter.convert() - strong要素を太字として変換できる", () => {
  // Arrange
  const elementNode: HTMLNode = {
    type: "element",
    tagName: "strong",
    children: [{ type: "text", textContent: "太字テキスト" }],
  };

  // Act
  const result = ElementContextConverter.convert(elementNode, undefined, "p");

  // Assert
  expect(result).toBeDefined();
  expect(result?.node).toBeDefined();
  expect(result?.isBold).toBe(true);
});

test("ElementContextConverter.convert() - em要素をイタリックとして変換できる", () => {
  // Arrange
  const elementNode: HTMLNode = {
    type: "element",
    tagName: "em",
    children: [{ type: "text", textContent: "イタリックテキスト" }],
  };

  // Act
  const result = ElementContextConverter.convert(elementNode, undefined, "p");

  // Assert
  expect(result).toBeDefined();
  expect(result?.node).toBeDefined();
  expect(result?.isItalic).toBe(true);
});

test("ElementContextConverter.convert() - 見出し内のstrong要素を通常テキストとして変換できる", () => {
  // Arrange
  const elementNode: HTMLNode = {
    type: "element",
    tagName: "strong",
    children: [{ type: "text", textContent: "見出し内の太字" }],
  };

  // Act
  const result = ElementContextConverter.convert(elementNode, undefined, "h2");

  // Assert
  expect(result).toBeDefined();
  expect(result?.node).toBeDefined();
  // 見出し内では既に太字なので、strongは無視される
  expect(result?.isBold).toBe(false);
});

test("ElementContextConverter.convert() - 要素タイプが指定されない場合は段落として処理", () => {
  // Arrange
  const textNode: HTMLNode = {
    type: "text",
    textContent: "デフォルトテキスト",
  };

  // Act
  const result = ElementContextConverter.convert(
    textNode,
    undefined,
    undefined,
  );

  // Assert
  expect(result).toBeDefined();
  expect(result?.node).toBeDefined();
});

test("ElementContextConverter.convert() - 空のコンテンツに対してnullを返す", () => {
  // Arrange
  const emptyNode: HTMLNode = {
    type: "element",
    tagName: "span",
    children: [],
  };

  // Act
  const result = ElementContextConverter.convert(emptyNode);

  // Assert
  expect(result).toBeNull();
});
