import { test, expect } from "vitest";
import { PolylineElement } from "../polyline-element";

// PolylineElement.isPolylineElement
test("PolylineElement.isPolylineElement - polyline要素 - trueを返す", () => {
  // Arrange
  const element = {
    type: "element",
    tagName: "polyline",
    attributes: { points: "0,40 40,40 40,80 80,80" },
  };

  // Act
  const result = PolylineElement.isPolylineElement(element);

  // Assert
  expect(result).toBe(true);
});

test("PolylineElement.isPolylineElement - 異なるタグ名 - falseを返す", () => {
  // Arrange
  const element = {
    type: "element",
    tagName: "polygon",
    attributes: { points: "0,40 40,40 40,80 80,80" },
  };

  // Act
  const result = PolylineElement.isPolylineElement(element);

  // Assert
  expect(result).toBe(false);
});

test("PolylineElement.isPolylineElement - 異なるtype - falseを返す", () => {
  // Arrange
  const element = {
    type: "text",
    tagName: "polyline",
    attributes: {},
  };

  // Act
  const result = PolylineElement.isPolylineElement(element);

  // Assert
  expect(result).toBe(false);
});

test("PolylineElement.isPolylineElement - null - falseを返す", () => {
  // Arrange & Act
  const result = PolylineElement.isPolylineElement(null);

  // Assert
  expect(result).toBe(false);
});

test("PolylineElement.isPolylineElement - undefined - falseを返す", () => {
  // Arrange & Act
  const result = PolylineElement.isPolylineElement(undefined);

  // Assert
  expect(result).toBe(false);
});

test("PolylineElement.isPolylineElement - プリミティブ値 - falseを返す", () => {
  // Arrange & Act & Assert
  expect(PolylineElement.isPolylineElement("polyline")).toBe(false);
  expect(PolylineElement.isPolylineElement(123)).toBe(false);
  expect(PolylineElement.isPolylineElement(true)).toBe(false);
});
