import { test, expect } from "vitest";
import { ClipPathElement } from "../clip-path-element";

// ClipPathElement.isClipPathElement - 型ガードのテスト

test("ClipPathElement.isClipPathElement - 正しいclipPath要素構造 - trueを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "clipPath",
    attributes: { id: "clip1" },
  };

  // Act & Assert
  expect(ClipPathElement.isClipPathElement(node)).toBe(true);
});

test("ClipPathElement.isClipPathElement - 属性が空のclipPath要素 - trueを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "clipPath",
    attributes: {},
  };

  // Act & Assert
  expect(ClipPathElement.isClipPathElement(node)).toBe(true);
});

test("ClipPathElement.isClipPathElement - null - falseを返す", () => {
  // Act & Assert
  expect(ClipPathElement.isClipPathElement(null)).toBe(false);
});

test("ClipPathElement.isClipPathElement - undefined - falseを返す", () => {
  // Act & Assert
  expect(ClipPathElement.isClipPathElement(undefined)).toBe(false);
});

test("ClipPathElement.isClipPathElement - 文字列 - falseを返す", () => {
  // Act & Assert
  expect(ClipPathElement.isClipPathElement("clipPath")).toBe(false);
});

test("ClipPathElement.isClipPathElement - 数値 - falseを返す", () => {
  // Act & Assert
  expect(ClipPathElement.isClipPathElement(123)).toBe(false);
});

test("ClipPathElement.isClipPathElement - typeが異なる - falseを返す", () => {
  // Arrange
  const node = {
    type: "text",
    tagName: "clipPath",
    attributes: {},
  };

  // Act & Assert
  expect(ClipPathElement.isClipPathElement(node)).toBe(false);
});

test("ClipPathElement.isClipPathElement - tagNameが異なる - falseを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "mask",
    attributes: {},
  };

  // Act & Assert
  expect(ClipPathElement.isClipPathElement(node)).toBe(false);
});

test("ClipPathElement.isClipPathElement - typeプロパティなし - falseを返す", () => {
  // Arrange
  const node = {
    tagName: "clipPath",
    attributes: {},
  };

  // Act & Assert
  expect(ClipPathElement.isClipPathElement(node)).toBe(false);
});

test("ClipPathElement.isClipPathElement - tagNameプロパティなし - falseを返す", () => {
  // Arrange
  const node = {
    type: "element",
    attributes: {},
  };

  // Act & Assert
  expect(ClipPathElement.isClipPathElement(node)).toBe(false);
});

test("ClipPathElement.isClipPathElement - 他のSVG要素（defs要素） - falseを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "defs",
    attributes: {},
  };

  // Act & Assert
  expect(ClipPathElement.isClipPathElement(node)).toBe(false);
});

test("ClipPathElement.isClipPathElement - 他のSVG要素（use要素） - falseを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "use",
    attributes: {},
  };

  // Act & Assert
  expect(ClipPathElement.isClipPathElement(node)).toBe(false);
});
