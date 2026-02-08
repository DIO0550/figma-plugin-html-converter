import { test, expect } from "vitest";
import { createTextChildrenConverter } from "./children-converter-helpers";
import type { BaseElement } from "../elements/base/base-element";

test("createTextChildrenConverter - 子要素がない場合 - 空配列を返す", () => {
  // Arrange
  const element: BaseElement<"p", { style?: string }> = {
    type: "element",
    tagName: "p",
    attributes: {},
    children: [],
  };
  const converter = createTextChildrenConverter("p");

  // Act
  const result = converter(element);

  // Assert
  expect(result).toEqual([]);
});

test("createTextChildrenConverter - テキストノード1つ - 変換できる", () => {
  // Arrange
  const element: BaseElement<"p", { style?: string }> = {
    type: "element",
    tagName: "p",
    attributes: {},
    children: [
      {
        type: "text",
        textContent: "Hello World",
      },
    ],
  };
  const converter = createTextChildrenConverter("p");

  // Act
  const result = converter(element);

  // Assert
  expect(result).toHaveLength(1);
  expect(result[0]).toBeDefined();
  expect(result[0].type).toBe("TEXT");
});

test("createTextChildrenConverter - 複数の子要素 - 変換できる", () => {
  // Arrange
  const element: BaseElement<"p", { style?: string }> = {
    type: "element",
    tagName: "p",
    attributes: {},
    children: [
      {
        type: "text",
        textContent: "Hello",
      },
      {
        type: "text",
        textContent: "World",
      },
    ],
  };
  const converter = createTextChildrenConverter("p");

  // Act
  const result = converter(element);

  // Assert
  expect(result).toHaveLength(2);
});

test("createTextChildrenConverter - 親要素にスタイルあり - 子要素に伝播できる", () => {
  // Arrange
  const element: BaseElement<"p", { style?: string }> = {
    type: "element",
    tagName: "p",
    attributes: {
      style: "color: red;",
    },
    children: [
      {
        type: "text",
        textContent: "Styled text",
      },
    ],
  };
  const converter = createTextChildrenConverter("p");

  // Act
  const result = converter(element);

  // Assert
  expect(result).toHaveLength(1);
  expect(result[0]).toBeDefined();
});

test("createTextChildrenConverter - 見出し要素 - 変換できる", () => {
  // Arrange
  const element: BaseElement<"h1", { style?: string }> = {
    type: "element",
    tagName: "h1",
    attributes: {},
    children: [
      {
        type: "text",
        textContent: "Heading",
      },
    ],
  };
  const converter = createTextChildrenConverter("h1");

  // Act
  const result = converter(element);

  // Assert
  expect(result).toHaveLength(1);
  expect(result[0]).toBeDefined();
});

test("createTextChildrenConverter - null/undefinedの結果 - フィルタリングする", () => {
  // Arrange
  const element: BaseElement<"p", { style?: string }> = {
    type: "element",
    tagName: "p",
    attributes: {},
    children: [
      {
        type: "text",
        textContent: "Valid text",
      },
      {
        type: "comment",
        comment: "This should be filtered",
      },
    ],
  };
  const converter = createTextChildrenConverter("p");

  // Act
  const result = converter(element);

  // Assert
  expect(result.length).toBeGreaterThan(0);
  expect(result.every((node) => node !== null)).toBe(true);
});

test("createTextChildrenConverter - テキストノード - FigmaNodeConfigの配列を返す", () => {
  // Arrange
  const element: BaseElement<"p", { style?: string }> = {
    type: "element",
    tagName: "p",
    attributes: {},
    children: [
      {
        type: "text",
        textContent: "Test",
      },
    ],
  };
  const converter = createTextChildrenConverter("p");

  // Act
  const result = converter(element);

  // Assert
  expect(result).toHaveLength(1);
  expect(result[0]).toBeDefined();
  // FigmaNodeConfigの基本プロパティを確認
  expect(result[0]).toHaveProperty("type");
  expect(result[0]).toHaveProperty("name");
});

test("createTextChildrenConverter - blockquote要素 - 正しく動作する", () => {
  // Arrange - blockquote
  const blockquoteElement: BaseElement<"blockquote", { style?: string }> = {
    type: "element",
    tagName: "blockquote",
    attributes: {},
    children: [
      {
        type: "text",
        textContent: "Quote",
      },
    ],
  };
  const blockquoteConverter = createTextChildrenConverter("blockquote");

  // Act
  const blockquoteResult = blockquoteConverter(blockquoteElement);

  // Assert
  expect(blockquoteResult).toHaveLength(1);
  expect(blockquoteResult[0]).toBeDefined();
});

test("createTextChildrenConverter - pre要素 - 変換できる", () => {
  // Arrange
  const element: BaseElement<"pre", { style?: string }> = {
    type: "element",
    tagName: "pre",
    attributes: {},
    children: [
      {
        type: "text",
        textContent: "Code block",
      },
    ],
  };
  const converter = createTextChildrenConverter("pre");

  // Act
  const result = converter(element);

  // Assert
  expect(result).toHaveLength(1);
  expect(result[0]).toBeDefined();
});
