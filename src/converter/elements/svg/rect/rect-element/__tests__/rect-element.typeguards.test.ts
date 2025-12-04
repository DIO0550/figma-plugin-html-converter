import { test, expect } from "vitest";
import { RectElement } from "../rect-element";

// RectElement.isRectElement
test("RectElement.isRectElement - 正常なRectElement - trueを返す", () => {
  // Arrange
  const element = RectElement.create({
    x: 10,
    y: 20,
    width: 100,
    height: 50,
  });

  // Act
  const result = RectElement.isRectElement(element);

  // Assert
  expect(result).toBe(true);
});

test("RectElement.isRectElement - null - falseを返す", () => {
  // Arrange & Act
  const result = RectElement.isRectElement(null);

  // Assert
  expect(result).toBe(false);
});

test("RectElement.isRectElement - undefined - falseを返す", () => {
  // Arrange & Act
  const result = RectElement.isRectElement(undefined);

  // Assert
  expect(result).toBe(false);
});

test("RectElement.isRectElement - 異なるタグ名の要素 - falseを返す", () => {
  // Arrange
  const element = {
    type: "element",
    tagName: "circle",
    attributes: {},
  };

  // Act
  const result = RectElement.isRectElement(element);

  // Assert
  expect(result).toBe(false);
});

test("RectElement.isRectElement - 異なるtypeの要素 - falseを返す", () => {
  // Arrange
  const element = {
    type: "text",
    tagName: "rect",
    attributes: {},
  };

  // Act
  const result = RectElement.isRectElement(element);

  // Assert
  expect(result).toBe(false);
});
