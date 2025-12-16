import { describe, test, expect } from "vitest";
import { UseElement } from "../use-element";

describe("UseElement.isUseElement", () => {
  test("正しいuse要素構造 - trueを返す", () => {
    // Arrange
    const node = {
      type: "element",
      tagName: "use",
      attributes: { href: "#rect1" },
    };

    // Act & Assert
    expect(UseElement.isUseElement(node)).toBe(true);
  });

  test("属性が空のuse要素 - trueを返す", () => {
    // Arrange
    const node = {
      type: "element",
      tagName: "use",
      attributes: {},
    };

    // Act & Assert
    expect(UseElement.isUseElement(node)).toBe(true);
  });

  test("nullの場合 - falseを返す", () => {
    // Act & Assert
    expect(UseElement.isUseElement(null)).toBe(false);
  });

  test("undefinedの場合 - falseを返す", () => {
    // Act & Assert
    expect(UseElement.isUseElement(undefined)).toBe(false);
  });

  test("文字列の場合 - falseを返す", () => {
    // Act & Assert
    expect(UseElement.isUseElement("use")).toBe(false);
  });

  test("数値の場合 - falseを返す", () => {
    // Act & Assert
    expect(UseElement.isUseElement(123)).toBe(false);
  });

  test("typeが異なる場合 - falseを返す", () => {
    // Arrange
    const node = {
      type: "text",
      tagName: "use",
      attributes: {},
    };

    // Act & Assert
    expect(UseElement.isUseElement(node)).toBe(false);
  });

  test("tagNameが異なる場合 - falseを返す", () => {
    // Arrange
    const node = {
      type: "element",
      tagName: "rect",
      attributes: {},
    };

    // Act & Assert
    expect(UseElement.isUseElement(node)).toBe(false);
  });

  test("typeプロパティがない場合 - falseを返す", () => {
    // Arrange
    const node = {
      tagName: "use",
      attributes: {},
    };

    // Act & Assert
    expect(UseElement.isUseElement(node)).toBe(false);
  });

  test("tagNameプロパティがない場合 - falseを返す", () => {
    // Arrange
    const node = {
      type: "element",
      attributes: {},
    };

    // Act & Assert
    expect(UseElement.isUseElement(node)).toBe(false);
  });

  test("他のSVG要素（g要素）- falseを返す", () => {
    // Arrange
    const node = {
      type: "element",
      tagName: "g",
      attributes: {},
    };

    // Act & Assert
    expect(UseElement.isUseElement(node)).toBe(false);
  });

  test("他のSVG要素（defs要素）- falseを返す", () => {
    // Arrange
    const node = {
      type: "element",
      tagName: "defs",
      attributes: {},
    };

    // Act & Assert
    expect(UseElement.isUseElement(node)).toBe(false);
  });
});
