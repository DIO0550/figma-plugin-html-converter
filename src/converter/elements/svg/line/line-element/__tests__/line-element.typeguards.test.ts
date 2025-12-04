import { test, expect } from "vitest";
import { LineElement } from "../line-element";

// LineElement.isLineElement
test("LineElement.isLineElement - 正常なLineElement - trueを返す", () => {
  // Arrange
  const element = LineElement.create({
    x1: 10,
    y1: 20,
    x2: 100,
    y2: 80,
  });

  // Act
  const result = LineElement.isLineElement(element);

  // Assert
  expect(result).toBe(true);
});

test("LineElement.isLineElement - null - falseを返す", () => {
  // Arrange & Act
  const result = LineElement.isLineElement(null);

  // Assert
  expect(result).toBe(false);
});

test("LineElement.isLineElement - undefined - falseを返す", () => {
  // Arrange & Act
  const result = LineElement.isLineElement(undefined);

  // Assert
  expect(result).toBe(false);
});

test("LineElement.isLineElement - 異なるタグ名の要素 - falseを返す", () => {
  // Arrange
  const element = {
    type: "element",
    tagName: "circle",
    attributes: {},
  };

  // Act
  const result = LineElement.isLineElement(element);

  // Assert
  expect(result).toBe(false);
});

test("LineElement.isLineElement - 異なるtypeの要素 - falseを返す", () => {
  // Arrange
  const element = {
    type: "text",
    tagName: "line",
    attributes: {},
  };

  // Act
  const result = LineElement.isLineElement(element);

  // Assert
  expect(result).toBe(false);
});
