import { test, expect } from "vitest";
import { CircleElement } from "../circle-element";

// CircleElement.toFigmaNode
test("CircleElement.toFigmaNode - 基本的なcircle要素 - RECTANGLEノードを生成する", () => {
  // Arrange
  const element = CircleElement.create({
    cx: 50,
    cy: 50,
    r: 25,
  });

  // Act
  const config = CircleElement.toFigmaNode(element);

  // Assert
  expect(config.name).toBe("circle");
  expect(config.type).toBe("RECTANGLE");
});

test("CircleElement.toFigmaNode - 座標と半径を指定 - 正しい位置とサイズを設定する", () => {
  // Arrange
  const element = CircleElement.create({
    cx: 100,
    cy: 100,
    r: 50,
  });

  // Act
  const config = CircleElement.toFigmaNode(element);

  // Assert
  expect(config.x).toBe(50);
  expect(config.y).toBe(50);
  expect(config.width).toBe(100);
  expect(config.height).toBe(100);
});

test("CircleElement.toFigmaNode - fill属性を指定 - fillsを適用する", () => {
  // Arrange
  const element = CircleElement.create({
    cx: 50,
    cy: 50,
    r: 25,
    fill: "#ff0000",
  });

  // Act
  const config = CircleElement.toFigmaNode(element);

  // Assert
  expect(config.fills).toBeDefined();
  expect(config.fills?.length).toBe(1);
  expect(config.fills?.[0].type).toBe("SOLID");
});

test("CircleElement.toFigmaNode - stroke属性を指定 - strokesを適用する", () => {
  // Arrange
  const element = CircleElement.create({
    cx: 50,
    cy: 50,
    r: 25,
    stroke: "#00ff00",
    "stroke-width": 2,
  });

  // Act
  const config = CircleElement.toFigmaNode(element);

  // Assert
  expect(config.strokes).toBeDefined();
  expect(config.strokes?.length).toBe(1);
  expect(config.strokeWeight).toBe(2);
});

test("CircleElement.toFigmaNode - fill属性が'none' - fillsを空配列にする", () => {
  // Arrange
  const element = CircleElement.create({
    cx: 50,
    cy: 50,
    r: 25,
    fill: "none",
  });

  // Act
  const config = CircleElement.toFigmaNode(element);

  // Assert
  expect(config.fills?.length).toBe(0);
});

test("CircleElement.toFigmaNode - 半径を指定 - cornerRadiusを設定して円形にする", () => {
  // Arrange
  const element = CircleElement.create({
    cx: 50,
    cy: 50,
    r: 25,
  });

  // Act
  const config = CircleElement.toFigmaNode(element);

  // Assert
  expect(config.cornerRadius).toBe(25);
});

test("CircleElement.toFigmaNode - デフォルト値のcircle要素 - 位置0,サイズ0で変換する", () => {
  // Arrange
  const element = CircleElement.create();

  // Act
  const config = CircleElement.toFigmaNode(element);

  // Assert
  expect(config.x).toBe(0);
  expect(config.y).toBe(0);
  expect(config.width).toBe(0);
  expect(config.height).toBe(0);
});
