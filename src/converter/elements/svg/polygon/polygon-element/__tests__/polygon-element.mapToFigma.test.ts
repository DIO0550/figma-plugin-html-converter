import { test, expect } from "vitest";
import { PolygonElement } from "../polygon-element";

// PolygonElement.mapToFigma
test("PolygonElement.mapToFigma - polygon要素 - FigmaNodeConfigを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "polygon",
    attributes: { points: "100,10 40,198 190,78" },
  };

  // Act
  const result = PolygonElement.mapToFigma(node);

  // Assert
  expect(result).not.toBeNull();
  expect(result?.type).toBe("FRAME");
  expect(result?.name).toBe("polygon");
});

test("PolygonElement.mapToFigma - 異なるタグ名 - nullを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "polyline",
    attributes: { points: "100,10 40,198 190,78" },
  };

  // Act
  const result = PolygonElement.mapToFigma(node);

  // Assert
  expect(result).toBeNull();
});

test("PolygonElement.mapToFigma - null - nullを返す", () => {
  // Arrange & Act
  const result = PolygonElement.mapToFigma(null);

  // Assert
  expect(result).toBeNull();
});

test("PolygonElement.mapToFigma - fill属性付き - 正しくマッピングする", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "polygon",
    attributes: {
      points: "100,10 40,198 190,78",
      fill: "#ff0000",
    },
  };

  // Act
  const result = PolygonElement.mapToFigma(node);

  // Assert
  expect(result).not.toBeNull();
  expect(result?.fills).toBeDefined();
});
