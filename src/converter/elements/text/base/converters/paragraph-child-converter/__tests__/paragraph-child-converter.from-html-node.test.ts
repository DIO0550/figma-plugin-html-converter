import { test, expect } from "vitest";
import { ParagraphChildConverter } from "../paragraph-child-converter";
import { HTMLNode } from "../../../../../../models/html-node/html-node";

// =============================================================================
// ParagraphChildConverter.fromHTMLNode のテスト
// =============================================================================

test("ParagraphChildConverter.fromHTMLNode() - テキストノードを変換できる", () => {
  // Arrange
  const textNode: HTMLNode = {
    type: "text",
    textContent: "テストテキスト",
  };

  // Act
  const result = ParagraphChildConverter.fromHTMLNode(textNode);

  // Assert
  expect(result).toBeDefined();
  expect(result?.kind).toBe("text");
  expect(result?.content).toBe("テストテキスト");
});

test("ParagraphChildConverter.fromHTMLNode() - strong要素を変換できる", () => {
  // Arrange
  const strongNode: HTMLNode = {
    type: "element",
    tagName: "strong",
    children: [{ type: "text", textContent: "太字テキスト" }],
  };

  // Act
  const result = ParagraphChildConverter.fromHTMLNode(strongNode);

  // Assert
  expect(result).toBeDefined();
  expect(result?.kind).toBe("strong");
  expect(result?.content).toBe("太字テキスト");
});

test("ParagraphChildConverter.fromHTMLNode() - em要素を変換できる", () => {
  // Arrange
  const emNode: HTMLNode = {
    type: "element",
    tagName: "em",
    children: [{ type: "text", textContent: "イタリックテキスト" }],
  };

  // Act
  const result = ParagraphChildConverter.fromHTMLNode(emNode);

  // Assert
  expect(result).toBeDefined();
  expect(result?.kind).toBe("em");
  expect(result?.content).toBe("イタリックテキスト");
});

test("ParagraphChildConverter.fromHTMLNode() - b要素を変換できる", () => {
  // Arrange
  const bNode: HTMLNode = {
    type: "element",
    tagName: "b",
    children: [{ type: "text", textContent: "太字テキスト" }],
  };

  // Act
  const result = ParagraphChildConverter.fromHTMLNode(bNode);

  // Assert
  expect(result).toBeDefined();
  expect(result?.kind).toBe("b");
  expect(result?.content).toBe("太字テキスト");
});

test("ParagraphChildConverter.fromHTMLNode() - i要素を変換できる", () => {
  // Arrange
  const iNode: HTMLNode = {
    type: "element",
    tagName: "i",
    children: [{ type: "text", textContent: "イタリックテキスト" }],
  };

  // Act
  const result = ParagraphChildConverter.fromHTMLNode(iNode);

  // Assert
  expect(result).toBeDefined();
  expect(result?.kind).toBe("i");
  expect(result?.content).toBe("イタリックテキスト");
});

test("ParagraphChildConverter.fromHTMLNode() - 不明な要素を変換できる", () => {
  // Arrange
  const unknownNode: HTMLNode = {
    type: "element",
    tagName: "custom",
    children: [{ type: "text", textContent: "カスタムテキスト" }],
  };

  // Act
  const result = ParagraphChildConverter.fromHTMLNode(unknownNode);

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

test("ParagraphChildConverter.fromHTMLNode() - 親スタイルを適用できる", () => {
  // Arrange
  const textNode: HTMLNode = {
    type: "text",
    textContent: "スタイル付きテキスト",
  };
  const parentStyles = { color: "red", fontSize: "16px" };

  // Act
  const result = ParagraphChildConverter.fromHTMLNode(textNode, parentStyles);

  // Assert
  expect(result).toBeDefined();
  expect(result?.kind).toBe("text");
  expect(result?.styles).toEqual(parentStyles);
});

test("ParagraphChildConverter.fromHTMLNode() - 空のコンテンツはnullを返す", () => {
  // Arrange
  const emptyNode: HTMLNode = {
    type: "element",
    tagName: "strong",
    children: [],
  };

  // Act
  const result = ParagraphChildConverter.fromHTMLNode(emptyNode);

  // Assert
  expect(result).toBeNull();
});

test("ParagraphChildConverter.fromHTMLNode() - 非要素ノードはnullを返す", () => {
  // Arrange
  const invalidNode = {
    type: "comment" as const,
    textContent: "コメント",
  } as unknown as HTMLNode;

  // Act
  const result = ParagraphChildConverter.fromHTMLNode(invalidNode);

  // Assert
  expect(result).toBeNull();
});
