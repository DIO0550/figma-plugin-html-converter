import { test, expect } from "vitest";
import { HeadingChildConverter } from "../heading-child-converter";
import { HTMLNode } from "../../../../../../models/html-node/html-node";

// =============================================================================
// HeadingChildConverter.fromHTMLNode のテスト
// =============================================================================

test("HeadingChildConverter.fromHTMLNode() - テキストノードを変換できる", () => {
  // Arrange
  const textNode: HTMLNode = {
    type: "text",
    textContent: "見出しテキスト",
  };

  // Act
  const result = HeadingChildConverter.fromHTMLNode(textNode);

  // Assert
  expect(result).toBeDefined();
  expect(result?.kind).toBe("text");
  expect(result?.content).toBe("見出しテキスト");
});

test("HeadingChildConverter.fromHTMLNode() - strong要素を通常テキストとして変換する", () => {
  // Arrange
  const strongNode: HTMLNode = {
    type: "element",
    tagName: "strong",
    children: [{ type: "text", textContent: "太字テキスト" }],
  };

  // Act
  const result = HeadingChildConverter.fromHTMLNode(strongNode);

  // Assert
  expect(result).toBeDefined();
  // 見出しは既に太字なので、strongは通常のテキストとして扱われる
  expect(result?.kind).toBe("text");
  expect(result?.content).toBe("太字テキスト");
});

test("HeadingChildConverter.fromHTMLNode() - b要素を通常テキストとして変換する", () => {
  // Arrange
  const bNode: HTMLNode = {
    type: "element",
    tagName: "b",
    children: [{ type: "text", textContent: "太字テキスト" }],
  };

  // Act
  const result = HeadingChildConverter.fromHTMLNode(bNode);

  // Assert
  expect(result).toBeDefined();
  // 見出しは既に太字なので、bは通常のテキストとして扱われる
  expect(result?.kind).toBe("text");
  expect(result?.content).toBe("太字テキスト");
});

test("HeadingChildConverter.fromHTMLNode() - em要素をイタリックとして変換する", () => {
  // Arrange
  const emNode: HTMLNode = {
    type: "element",
    tagName: "em",
    children: [{ type: "text", textContent: "イタリックテキスト" }],
  };

  // Act
  const result = HeadingChildConverter.fromHTMLNode(emNode);

  // Assert
  expect(result).toBeDefined();
  expect(result?.kind).toBe("em");
  expect(result?.content).toBe("イタリックテキスト");
});

test("HeadingChildConverter.fromHTMLNode() - i要素をイタリックとして変換する", () => {
  // Arrange
  const iNode: HTMLNode = {
    type: "element",
    tagName: "i",
    children: [{ type: "text", textContent: "イタリックテキスト" }],
  };

  // Act
  const result = HeadingChildConverter.fromHTMLNode(iNode);

  // Assert
  expect(result).toBeDefined();
  expect(result?.kind).toBe("i");
  expect(result?.content).toBe("イタリックテキスト");
});

test("HeadingChildConverter.fromHTMLNode() - 不明な要素を変換できる", () => {
  // Arrange
  const unknownNode: HTMLNode = {
    type: "element",
    tagName: "custom",
    children: [{ type: "text", textContent: "カスタムテキスト" }],
  };

  // Act
  const result = HeadingChildConverter.fromHTMLNode(unknownNode);

  // Assert
  expect(result).toBeDefined();
  expect(result?.kind).toBe("other");
  expect(
    result && "tagName" in result
      ? (result as { tagName: string }).tagName
      : undefined,
  ).toBe("custom");
  expect(result?.content).toBe("カスタムテキスト");
});

test("HeadingChildConverter.fromHTMLNode() - 親スタイルを適用できる", () => {
  // Arrange
  const textNode: HTMLNode = {
    type: "text",
    textContent: "スタイル付き見出し",
  };
  const parentStyles = { color: "blue", fontSize: "24px" };

  // Act
  const result = HeadingChildConverter.fromHTMLNode(textNode, parentStyles);

  // Assert
  expect(result).toBeDefined();
  expect(result?.kind).toBe("text");
  expect(result?.styles).toEqual(parentStyles);
});

test("HeadingChildConverter.fromHTMLNode() - 空のコンテンツはnullを返す", () => {
  // Arrange
  const emptyNode: HTMLNode = {
    type: "element",
    tagName: "strong",
    children: [],
  };

  // Act
  const result = HeadingChildConverter.fromHTMLNode(emptyNode);

  // Assert
  expect(result).toBeNull();
});
