import { test, expect } from "vitest";
import { PolygonElement } from "../polygon-element";

// PolygonElement.isPolygonElement
test("PolygonElement.isPolygonElement - polygon要素 - trueを返す", () => {
  // Arrange
  const element = {
    type: "element",
    tagName: "polygon",
    attributes: { points: "100,10 40,198 190,78" },
  };

  // Act
  const result = PolygonElement.isPolygonElement(element);

  // Assert
  expect(result).toBe(true);
});

test("PolygonElement.isPolygonElement - 異なるタグ名 - falseを返す", () => {
  // Arrange
  const element = {
    type: "element",
    tagName: "polyline",
    attributes: { points: "100,10 40,198 190,78" },
  };

  // Act
  const result = PolygonElement.isPolygonElement(element);

  // Assert
  expect(result).toBe(false);
});

test("PolygonElement.isPolygonElement - 異なるtype - falseを返す", () => {
  // Arrange
  const element = {
    type: "text",
    tagName: "polygon",
    attributes: {},
  };

  // Act
  const result = PolygonElement.isPolygonElement(element);

  // Assert
  expect(result).toBe(false);
});

test("PolygonElement.isPolygonElement - null - falseを返す", () => {
  // Arrange & Act
  const result = PolygonElement.isPolygonElement(null);

  // Assert
  expect(result).toBe(false);
});

test("PolygonElement.isPolygonElement - undefined - falseを返す", () => {
  // Arrange & Act
  const result = PolygonElement.isPolygonElement(undefined);

  // Assert
  expect(result).toBe(false);
});

test("PolygonElement.isPolygonElement - プリミティブ値 - falseを返す", () => {
  // Arrange & Act & Assert
  expect(PolygonElement.isPolygonElement("polygon")).toBe(false);
  expect(PolygonElement.isPolygonElement(123)).toBe(false);
  expect(PolygonElement.isPolygonElement(true)).toBe(false);
});
