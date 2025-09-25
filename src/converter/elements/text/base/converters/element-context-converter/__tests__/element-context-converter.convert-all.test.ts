import { test, expect } from "vitest";
import { ElementContextConverter } from "../element-context-converter";
import { HTMLNode } from "../../../../../../models/html-node/html-node";

// =============================================================================
// ElementContextConverter.convertAll のテスト
// =============================================================================

test("ElementContextConverter.convertAll() - 複数の子要素を変換できる", () => {
  // Arrange
  const children: HTMLNode[] = [
    { type: "text", textContent: "テキスト1" },
    {
      type: "element",
      tagName: "strong",
      children: [{ type: "text", textContent: "太字テキスト" }],
    },
    { type: "text", textContent: "テキスト2" },
  ];

  // Act
  const results = ElementContextConverter.convertAll(children, undefined, "p");

  // Assert
  expect(results).toHaveLength(3);
  expect(results[0].isText).toBe(true);
  expect(results[1].isBold).toBe(true);
  expect(results[2].isText).toBe(true);
});

test("ElementContextConverter.convertAll() - 見出し要素として複数変換できる", () => {
  // Arrange
  const children: HTMLNode[] = [
    { type: "text", textContent: "見出し1" },
    {
      type: "element",
      tagName: "em",
      children: [{ type: "text", textContent: "イタリック見出し" }],
    },
  ];

  // Act
  const results = ElementContextConverter.convertAll(children, undefined, "h3");

  // Assert
  expect(results).toHaveLength(2);
  expect(results[0].isText).toBe(true);
  expect(results[1].isItalic).toBe(true);
});

test("ElementContextConverter.convertAll() - 空の配列に対して空配列を返す", () => {
  // Arrange
  const children: HTMLNode[] = [];

  // Act
  const results = ElementContextConverter.convertAll(children);

  // Assert
  expect(results).toEqual([]);
});

test("ElementContextConverter.convertAll() - nullの結果をフィルタリングする", () => {
  // Arrange
  const children: HTMLNode[] = [
    { type: "text", textContent: "有効なテキスト" },
    {
      type: "element",
      tagName: "span",
      children: [], // 空のコンテンツ
    },
    { type: "text", textContent: "別の有効なテキスト" },
  ];

  // Act
  const results = ElementContextConverter.convertAll(children, undefined, "p");

  // Assert
  expect(results).toHaveLength(2);
  expect(results[0].node).toBeDefined();
  expect(results[1].node).toBeDefined();
});

test("ElementContextConverter.convertAll() - インライン要素として処理できる", () => {
  // Arrange
  const children: HTMLNode[] = [
    { type: "text", textContent: "インラインテキスト" },
  ];

  // Act
  const results = ElementContextConverter.convertAll(
    children,
    undefined,
    "span",
  );

  // Assert
  expect(results).toHaveLength(1);
  expect(results[0].isText).toBe(true);
});

test("ElementContextConverter.convertAll() - コード要素として処理できる", () => {
  // Arrange
  const children: HTMLNode[] = [{ type: "text", textContent: "const x = 42;" }];

  // Act
  const results = ElementContextConverter.convertAll(
    children,
    undefined,
    "code",
  );

  // Assert
  expect(results).toHaveLength(1);
  expect(results[0].isText).toBe(true);
});

test("ElementContextConverter.convertAll() - 引用要素として処理できる", () => {
  // Arrange
  const children: HTMLNode[] = [
    { type: "text", textContent: "引用されたテキスト" },
  ];

  // Act
  const results = ElementContextConverter.convertAll(
    children,
    undefined,
    "blockquote",
  );

  // Assert
  expect(results).toHaveLength(1);
  expect(results[0].isText).toBe(true);
});

test("ElementContextConverter.convertAll() - リスト要素として処理できる", () => {
  // Arrange
  const children: HTMLNode[] = [
    { type: "text", textContent: "リストアイテム" },
  ];

  // Act
  const results = ElementContextConverter.convertAll(children, undefined, "li");

  // Assert
  expect(results).toHaveLength(1);
  expect(results[0].isText).toBe(true);
});
