import { test, expect } from "vitest";
import { EllipseElement } from "../ellipse-element";

// EllipseElement.isEllipseElement
test("EllipseElement.isEllipseElement - 正常なEllipseElement - trueを返す", () => {
  // Arrange
  const element = EllipseElement.create({
    cx: 100,
    cy: 50,
    rx: 80,
    ry: 40,
  });

  // Act
  const result = EllipseElement.isEllipseElement(element);

  // Assert
  expect(result).toBe(true);
});

test("EllipseElement.isEllipseElement - null - falseを返す", () => {
  // Arrange & Act
  const result = EllipseElement.isEllipseElement(null);

  // Assert
  expect(result).toBe(false);
});

test("EllipseElement.isEllipseElement - undefined - falseを返す", () => {
  // Arrange & Act
  const result = EllipseElement.isEllipseElement(undefined);

  // Assert
  expect(result).toBe(false);
});

test("EllipseElement.isEllipseElement - 異なるタグ名の要素 - falseを返す", () => {
  // Arrange
  const element = {
    type: "element",
    tagName: "circle",
    attributes: {},
  };

  // Act
  const result = EllipseElement.isEllipseElement(element);

  // Assert
  expect(result).toBe(false);
});

test("EllipseElement.isEllipseElement - 異なるtypeの要素 - falseを返す", () => {
  // Arrange
  const element = {
    type: "text",
    tagName: "ellipse",
    attributes: {},
  };

  // Act
  const result = EllipseElement.isEllipseElement(element);

  // Assert
  expect(result).toBe(false);
});
