import { test, expect } from "vitest";
import { PolygonElement } from "../polygon-element";

// PolygonElement.toFigmaNode
test("PolygonElement.toFigmaNode - 三角形 - FRAMEノードを返す", () => {
  // Arrange
  const element = PolygonElement.create({
    points: "100,10 40,198 190,78",
  });

  // Act
  const result = PolygonElement.toFigmaNode(element);

  // Assert
  expect(result.type).toBe("FRAME");
  expect(result.name).toBe("polygon");
});

test("PolygonElement.toFigmaNode - 三角形 - 正しい境界ボックスを計算する", () => {
  // Arrange
  const element = PolygonElement.create({
    points: "100,10 40,198 190,78",
  });

  // Act
  const result = PolygonElement.toFigmaNode(element);

  // Assert
  expect(result.x).toBe(40);
  expect(result.y).toBe(10);
  expect(result.width).toBe(150);
  expect(result.height).toBe(188);
});

test("PolygonElement.toFigmaNode - fill属性あり - fillsが設定される", () => {
  // Arrange
  const element = PolygonElement.create({
    points: "100,10 40,198 190,78",
    fill: "#ff0000",
  });

  // Act
  const result = PolygonElement.toFigmaNode(element);

  // Assert
  expect(result.fills).toBeDefined();
  expect(result.fills?.length).toBeGreaterThan(0);
});

test("PolygonElement.toFigmaNode - stroke属性あり - strokesが設定される", () => {
  // Arrange
  const element = PolygonElement.create({
    points: "100,10 40,198 190,78",
    stroke: "#0000ff",
    "stroke-width": 3,
  });

  // Act
  const result = PolygonElement.toFigmaNode(element);

  // Assert
  expect(result.strokes).toBeDefined();
  expect(result.strokes?.length).toBeGreaterThan(0);
  expect(result.strokeWeight).toBe(3);
});

test("PolygonElement.toFigmaNode - points未指定 - ゼロサイズのノードを返す", () => {
  // Arrange
  const element = PolygonElement.create({});

  // Act
  const result = PolygonElement.toFigmaNode(element);

  // Assert
  expect(result.x).toBe(0);
  expect(result.y).toBe(0);
  expect(result.width).toBe(0);
  expect(result.height).toBe(0);
});

test("PolygonElement.toFigmaNode - 五角形 - 正しい境界ボックスを計算する", () => {
  // Arrange (星形の五角形)
  const element = PolygonElement.create({
    points: "100,10 40,198 190,78 10,78 160,198",
  });

  // Act
  const result = PolygonElement.toFigmaNode(element);

  // Assert
  expect(result.x).toBe(10);
  expect(result.y).toBe(10);
  expect(result.width).toBe(180);
  expect(result.height).toBe(188);
});
