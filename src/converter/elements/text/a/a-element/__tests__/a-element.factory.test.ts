import { test, expect } from "vitest";
import { AElement } from "../a-element";
import type { HTMLNode } from "../../../../../models/html-node/html-node";
import { createTextNode, createElementNode } from "./test-helpers";

// ===============================
// ファクトリー関数テスト
// ===============================

test("AElement.create() - 引数なしで呼び出した場合、デフォルトのAElementを作成する", () => {
  // Arrange & Act
  const element = AElement.create();

  // Assert
  expect(element).toEqual({
    type: "element",
    tagName: "a",
    attributes: {},
    children: [],
  });
});

test("AElement.create() - href属性を含むAElementを作成できる", () => {
  // Arrange
  const attributes = { href: "https://example.com" };

  // Act
  const element = AElement.create(attributes);

  // Assert
  expect(element).toEqual({
    type: "element",
    tagName: "a",
    attributes: { href: "https://example.com" },
    children: [],
  });
});

test("AElement.create() - 複数の属性を含むAElementを作成できる", () => {
  // Arrange
  const attributes = {
    href: "https://example.com",
    target: "_blank",
    rel: "noopener",
    class: "external-link",
  };

  // Act
  const element = AElement.create(attributes);

  // Assert
  expect(element).toEqual({
    type: "element",
    tagName: "a",
    attributes,
    children: [],
  });
});

test("AElement.create() - 子要素としてテキストノードを含むAElementを作成できる", () => {
  // Arrange
  const children = [createTextNode("Click here")];

  // Act
  const element = AElement.create({}, children);

  // Assert
  expect(element).toEqual({
    type: "element",
    tagName: "a",
    attributes: {},
    children: [{ type: "text", textContent: "Click here" }],
  });
});

test("AElement.create() - 子要素として複数のノードを含むAElementを作成できる", () => {
  // Arrange
  const children = [
    createTextNode("Visit "),
    createElementNode("strong", [createTextNode("our site")]),
    createTextNode(" today"),
  ];

  // Act
  const element = AElement.create({}, children);

  // Assert
  expect(element.children).toHaveLength(3);
  expect(element.children?.[0]).toEqual({
    type: "text",
    textContent: "Visit ",
  });
  expect(element.children?.[1]).toHaveProperty("tagName", "strong");
  expect(element.children?.[2]).toEqual({
    type: "text",
    textContent: " today",
  });
});

test("AElement.create() - 属性と子要素の両方を含むAElementを作成できる", () => {
  // Arrange
  const attributes = { href: "#section1", class: "nav-link" };
  const children = [createTextNode("Section 1")];

  // Act
  const element = AElement.create(attributes, children);

  // Assert
  expect(element).toEqual({
    type: "element",
    tagName: "a",
    attributes,
    children,
  });
});

test("AElement.create() - 空の子要素配列を渡した場合、空の配列として保持する", () => {
  // Arrange
  const children: HTMLNode[] = [];

  // Act
  const element = AElement.create({}, children);

  // Assert
  expect(element.children).toEqual([]);
  expect(element.children).toHaveLength(0);
});

test("AElement.create() - 極端に長いhref値を持つ要素を作成できる", () => {
  // Arrange
  const longUrl = "https://example.com/" + "a".repeat(5000);

  // Act
  const element = AElement.create({ href: longUrl });

  // Assert
  expect(element.attributes?.href).toBe(longUrl);
  expect(element.attributes?.href?.length).toBeGreaterThan(5000);
});

test("AElement.create() - 深くネストした子要素構造を作成できる", () => {
  // Arrange
  const deepChild = createElementNode("span", [
    createElementNode("em", [
      createElementNode("strong", [createTextNode("Deep text")]),
    ]),
  ]);
  const children = [deepChild];

  // Act
  const element = AElement.create({}, children);

  // Assert
  expect(element.children).toHaveLength(1);
  const firstChild = element.children?.[0] as HTMLNode;
  if (firstChild.type === "element") {
    expect(firstChild.tagName).toBe("span");
    const secondChild = firstChild.children?.[0] as HTMLNode;
    if (secondChild?.type === "element") {
      expect(secondChild.tagName).toBe("em");
      const thirdChild = secondChild.children?.[0] as HTMLNode;
      if (thirdChild?.type === "element") {
        expect(thirdChild.tagName).toBe("strong");
      }
    }
  }
});
