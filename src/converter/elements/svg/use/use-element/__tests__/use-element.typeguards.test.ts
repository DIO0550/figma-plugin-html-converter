import { test, expect } from "vitest";
import { UseElement } from "../use-element";

// UseElement.isUseElement - 型ガードのテスト

test("UseElement.isUseElement - 正しいuse要素構造 - trueを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "use",
    attributes: { href: "#rect1" },
  };

  // Act & Assert
  expect(UseElement.isUseElement(node)).toBe(true);
});

test("UseElement.isUseElement - 属性が空のuse要素 - trueを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "use",
    attributes: {},
  };

  // Act & Assert
  expect(UseElement.isUseElement(node)).toBe(true);
});

test("UseElement.isUseElement - null - falseを返す", () => {
  // Act & Assert
  expect(UseElement.isUseElement(null)).toBe(false);
});

test("UseElement.isUseElement - undefined - falseを返す", () => {
  // Act & Assert
  expect(UseElement.isUseElement(undefined)).toBe(false);
});

test("UseElement.isUseElement - 文字列 - falseを返す", () => {
  // Act & Assert
  expect(UseElement.isUseElement("use")).toBe(false);
});

test("UseElement.isUseElement - 数値 - falseを返す", () => {
  // Act & Assert
  expect(UseElement.isUseElement(123)).toBe(false);
});

test("UseElement.isUseElement - typeが異なる - falseを返す", () => {
  // Arrange
  const node = {
    type: "text",
    tagName: "use",
    attributes: {},
  };

  // Act & Assert
  expect(UseElement.isUseElement(node)).toBe(false);
});

test("UseElement.isUseElement - tagNameが異なる - falseを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "rect",
    attributes: {},
  };

  // Act & Assert
  expect(UseElement.isUseElement(node)).toBe(false);
});

test("UseElement.isUseElement - typeプロパティなし - falseを返す", () => {
  // Arrange
  const node = {
    tagName: "use",
    attributes: {},
  };

  // Act & Assert
  expect(UseElement.isUseElement(node)).toBe(false);
});

test("UseElement.isUseElement - tagNameプロパティなし - falseを返す", () => {
  // Arrange
  const node = {
    type: "element",
    attributes: {},
  };

  // Act & Assert
  expect(UseElement.isUseElement(node)).toBe(false);
});

test("UseElement.isUseElement - 他のSVG要素（g要素） - falseを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "g",
    attributes: {},
  };

  // Act & Assert
  expect(UseElement.isUseElement(node)).toBe(false);
});

test("UseElement.isUseElement - 他のSVG要素（defs要素） - falseを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "defs",
    attributes: {},
  };

  // Act & Assert
  expect(UseElement.isUseElement(node)).toBe(false);
});
