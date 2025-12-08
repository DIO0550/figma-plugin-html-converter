import { test, expect } from "vitest";
import { PolylineElement } from "../polyline-element";

// PolylineElement.toFigmaNode
test("PolylineElement.toFigmaNode - 階段状の折れ線 - FRAMEノードを返す", () => {
  // Arrange
  const element = PolylineElement.create({
    points: "0,40 40,40 40,80 80,80",
  });

  // Act
  const result = PolylineElement.toFigmaNode(element);

  // Assert
  expect(result.type).toBe("FRAME");
  expect(result.name).toBe("polyline");
});

test("PolylineElement.toFigmaNode - 階段状の折れ線 - 正しい境界ボックスを計算する", () => {
  // Arrange
  const element = PolylineElement.create({
    points: "0,40 40,40 40,80 80,80",
  });

  // Act
  const result = PolylineElement.toFigmaNode(element);

  // Assert
  expect(result.x).toBe(0);
  expect(result.y).toBe(40);
  expect(result.width).toBe(80);
  expect(result.height).toBe(40);
});

test("PolylineElement.toFigmaNode - stroke属性あり - strokesが設定される", () => {
  // Arrange
  const element = PolylineElement.create({
    points: "0,40 40,40 40,80 80,80",
    stroke: "#0000ff",
    "stroke-width": 3,
  });

  // Act
  const result = PolylineElement.toFigmaNode(element);

  // Assert
  expect(result.strokes).toBeDefined();
  expect(result.strokes?.length).toBeGreaterThan(0);
  expect(result.strokeWeight).toBe(3);
});

test("PolylineElement.toFigmaNode - fill=none - fillsが空になる", () => {
  // Arrange
  const element = PolylineElement.create({
    points: "0,40 40,40 40,80 80,80",
    fill: "none",
    stroke: "#000000",
  });

  // Act
  const result = PolylineElement.toFigmaNode(element);

  // Assert
  expect(result.fills).toEqual([]);
});

test("PolylineElement.toFigmaNode - points未指定 - ゼロサイズのノードを返す", () => {
  // Arrange
  const element = PolylineElement.create({});

  // Act
  const result = PolylineElement.toFigmaNode(element);

  // Assert
  expect(result.x).toBe(0);
  expect(result.y).toBe(0);
  expect(result.width).toBe(0);
  expect(result.height).toBe(0);
});

test("PolylineElement.toFigmaNode - ジグザグ線 - 正しい境界ボックスを計算する", () => {
  // Arrange
  const element = PolylineElement.create({
    points: "0,0 20,40 40,0 60,40 80,0",
  });

  // Act
  const result = PolylineElement.toFigmaNode(element);

  // Assert
  expect(result.x).toBe(0);
  expect(result.y).toBe(0);
  expect(result.width).toBe(80);
  expect(result.height).toBe(40);
});
