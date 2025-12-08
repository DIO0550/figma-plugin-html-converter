import { test, expect } from "vitest";
import { PolylineElement } from "../polyline-element";

// PolylineElement.mapToFigma
test("PolylineElement.mapToFigma - polyline要素 - FigmaNodeConfigを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "polyline",
    attributes: { points: "0,40 40,40 40,80 80,80" },
  };

  // Act
  const result = PolylineElement.mapToFigma(node);

  // Assert
  expect(result).not.toBeNull();
  expect(result?.type).toBe("FRAME");
  expect(result?.name).toBe("polyline");
});

test("PolylineElement.mapToFigma - 異なるタグ名 - nullを返す", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "polygon",
    attributes: { points: "0,40 40,40 40,80 80,80" },
  };

  // Act
  const result = PolylineElement.mapToFigma(node);

  // Assert
  expect(result).toBeNull();
});

test("PolylineElement.mapToFigma - null - nullを返す", () => {
  // Arrange & Act
  const result = PolylineElement.mapToFigma(null);

  // Assert
  expect(result).toBeNull();
});

test("PolylineElement.mapToFigma - stroke属性付き - 正しくマッピングする", () => {
  // Arrange
  const node = {
    type: "element",
    tagName: "polyline",
    attributes: {
      points: "0,40 40,40 40,80 80,80",
      stroke: "#0000ff",
      "stroke-width": 2,
    },
  };

  // Act
  const result = PolylineElement.mapToFigma(node);

  // Assert
  expect(result).not.toBeNull();
  expect(result?.strokes).toBeDefined();
});
