import { test, expect } from "vitest";
import { PathElement } from "../path-element";

test("PathElement.isPathElement - PathElement.createで作成した要素を渡す - trueを返す", () => {
  // Arrange
  const element = PathElement.create({ d: "M0 0 L100 100" });

  // Act
  const result = PathElement.isPathElement(element);

  // Assert
  expect(result).toBe(true);
});

test("PathElement.isPathElement - nullを渡す - falseを返す", () => {
  // Act
  const result = PathElement.isPathElement(null);

  // Assert
  expect(result).toBe(false);
});

test("PathElement.isPathElement - undefinedを渡す - falseを返す", () => {
  // Act
  const result = PathElement.isPathElement(undefined);

  // Assert
  expect(result).toBe(false);
});

test("PathElement.isPathElement - 空オブジェクトを渡す - falseを返す", () => {
  // Act
  const result = PathElement.isPathElement({});

  // Assert
  expect(result).toBe(false);
});

test("PathElement.isPathElement - tagName='rect'の要素を渡す - falseを返す", () => {
  // Arrange
  const element = {
    type: "element",
    tagName: "rect",
    attributes: {},
  };

  // Act
  const result = PathElement.isPathElement(element);

  // Assert
  expect(result).toBe(false);
});

test("PathElement.isPathElement - type='text'の要素を渡す - falseを返す", () => {
  // Arrange
  const element = {
    type: "text",
    tagName: "path",
    attributes: {},
  };

  // Act
  const result = PathElement.isPathElement(element);

  // Assert
  expect(result).toBe(false);
});

test("PathElement.isPathElement - typeプロパティがない要素を渡す - falseを返す", () => {
  // Arrange
  const element = {
    tagName: "path",
    attributes: {},
  };

  // Act
  const result = PathElement.isPathElement(element);

  // Assert
  expect(result).toBe(false);
});

test("PathElement.isPathElement - tagNameプロパティがない要素を渡す - falseを返す", () => {
  // Arrange
  const element = {
    type: "element",
    attributes: {},
  };

  // Act
  const result = PathElement.isPathElement(element);

  // Assert
  expect(result).toBe(false);
});
