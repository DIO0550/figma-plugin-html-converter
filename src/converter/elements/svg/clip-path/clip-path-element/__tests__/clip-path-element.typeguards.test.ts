import { describe, test, expect } from "vitest";
import { ClipPathElement } from "../clip-path-element";

describe("ClipPathElement.isClipPathElement", () => {
  test("正しいclipPath要素構造 - trueを返す", () => {
    // Arrange
    const node = {
      type: "element",
      tagName: "clipPath",
      attributes: { id: "clip1" },
    };

    // Act & Assert
    expect(ClipPathElement.isClipPathElement(node)).toBe(true);
  });

  test("属性が空のclipPath要素 - trueを返す", () => {
    // Arrange
    const node = {
      type: "element",
      tagName: "clipPath",
      attributes: {},
    };

    // Act & Assert
    expect(ClipPathElement.isClipPathElement(node)).toBe(true);
  });

  test("nullの場合 - falseを返す", () => {
    // Act & Assert
    expect(ClipPathElement.isClipPathElement(null)).toBe(false);
  });

  test("undefinedの場合 - falseを返す", () => {
    // Act & Assert
    expect(ClipPathElement.isClipPathElement(undefined)).toBe(false);
  });

  test("文字列の場合 - falseを返す", () => {
    // Act & Assert
    expect(ClipPathElement.isClipPathElement("clipPath")).toBe(false);
  });

  test("数値の場合 - falseを返す", () => {
    // Act & Assert
    expect(ClipPathElement.isClipPathElement(123)).toBe(false);
  });

  test("typeが異なる場合 - falseを返す", () => {
    // Arrange
    const node = {
      type: "text",
      tagName: "clipPath",
      attributes: {},
    };

    // Act & Assert
    expect(ClipPathElement.isClipPathElement(node)).toBe(false);
  });

  test("tagNameが異なる場合 - falseを返す", () => {
    // Arrange
    const node = {
      type: "element",
      tagName: "mask",
      attributes: {},
    };

    // Act & Assert
    expect(ClipPathElement.isClipPathElement(node)).toBe(false);
  });

  test("typeプロパティがない場合 - falseを返す", () => {
    // Arrange
    const node = {
      tagName: "clipPath",
      attributes: {},
    };

    // Act & Assert
    expect(ClipPathElement.isClipPathElement(node)).toBe(false);
  });

  test("tagNameプロパティがない場合 - falseを返す", () => {
    // Arrange
    const node = {
      type: "element",
      attributes: {},
    };

    // Act & Assert
    expect(ClipPathElement.isClipPathElement(node)).toBe(false);
  });

  test("他のSVG要素（defs要素）- falseを返す", () => {
    // Arrange
    const node = {
      type: "element",
      tagName: "defs",
      attributes: {},
    };

    // Act & Assert
    expect(ClipPathElement.isClipPathElement(node)).toBe(false);
  });

  test("他のSVG要素（use要素）- falseを返す", () => {
    // Arrange
    const node = {
      type: "element",
      tagName: "use",
      attributes: {},
    };

    // Act & Assert
    expect(ClipPathElement.isClipPathElement(node)).toBe(false);
  });
});
