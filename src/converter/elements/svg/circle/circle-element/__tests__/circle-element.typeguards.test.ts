import { test, expect } from "vitest";
import { CircleElement } from "../circle-element";

// CircleElement.isCircleElement
test("CircleElement.isCircleElement - 正常なCircleElement - trueを返す", () => {
  // Arrange
  const element = CircleElement.create({ cx: 50, cy: 50, r: 25 });

  // Act
  const result = CircleElement.isCircleElement(element);

  // Assert
  expect(result).toBe(true);
});

test("CircleElement.isCircleElement - null - falseを返す", () => {
  // Arrange & Act
  const result = CircleElement.isCircleElement(null);

  // Assert
  expect(result).toBe(false);
});

test("CircleElement.isCircleElement - undefined - falseを返す", () => {
  // Arrange & Act
  const result = CircleElement.isCircleElement(undefined);

  // Assert
  expect(result).toBe(false);
});

test("CircleElement.isCircleElement - 異なるタグ名の要素 - falseを返す", () => {
  // Arrange
  const element = {
    type: "element",
    tagName: "rect",
    attributes: {},
  };

  // Act
  const result = CircleElement.isCircleElement(element);

  // Assert
  expect(result).toBe(false);
});

test("CircleElement.isCircleElement - 異なるtypeの要素 - falseを返す", () => {
  // Arrange
  const element = {
    type: "text",
    tagName: "circle",
    attributes: {},
  };

  // Act
  const result = CircleElement.isCircleElement(element);

  // Assert
  expect(result).toBe(false);
});

test("CircleElement.isCircleElement - プレーンオブジェクト - falseを返す", () => {
  // Arrange
  const element = {
    cx: 50,
    cy: 50,
    r: 25,
  };

  // Act
  const result = CircleElement.isCircleElement(element);

  // Assert
  expect(result).toBe(false);
});
