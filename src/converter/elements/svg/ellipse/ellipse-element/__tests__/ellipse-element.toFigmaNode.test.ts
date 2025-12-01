import { test, expect } from "vitest";
import { EllipseElement } from "../ellipse-element";

// EllipseElement.toFigmaNode
test("EllipseElement.toFigmaNode - 基本的なellipse要素 - RECTANGLEノードを生成する", () => {
  // Arrange
  const element = EllipseElement.create({
    cx: 100,
    cy: 50,
    rx: 80,
    ry: 40,
  });

  // Act
  const config = EllipseElement.toFigmaNode(element);

  // Assert
  expect(config.name).toBe("ellipse");
  expect(config.type).toBe("RECTANGLE");
});

test("EllipseElement.toFigmaNode - 座標と半径を指定 - 正しい位置とサイズを設定する", () => {
  // Arrange
  const element = EllipseElement.create({
    cx: 100,
    cy: 50,
    rx: 80,
    ry: 40,
  });

  // Act
  const config = EllipseElement.toFigmaNode(element);

  // Assert
  expect(config.x).toBe(20);
  expect(config.y).toBe(10);
  expect(config.width).toBe(160);
  expect(config.height).toBe(80);
});

test("EllipseElement.toFigmaNode - fill属性を指定 - fillsを適用する", () => {
  // Arrange
  const element = EllipseElement.create({
    cx: 100,
    cy: 50,
    rx: 80,
    ry: 40,
    fill: "#ff0000",
  });

  // Act
  const config = EllipseElement.toFigmaNode(element);

  // Assert
  expect(config.fills).toBeDefined();
  expect(config.fills?.length).toBe(1);
  expect(config.fills?.[0].type).toBe("SOLID");
});

test("EllipseElement.toFigmaNode - stroke属性を指定 - strokesを適用する", () => {
  // Arrange
  const element = EllipseElement.create({
    cx: 100,
    cy: 50,
    rx: 80,
    ry: 40,
    stroke: "#00ff00",
    "stroke-width": 2,
  });

  // Act
  const config = EllipseElement.toFigmaNode(element);

  // Assert
  expect(config.strokes).toBeDefined();
  expect(config.strokes?.length).toBe(1);
  expect(config.strokeWeight).toBe(2);
});

test("EllipseElement.toFigmaNode - fill属性が'none' - fillsを空配列にする", () => {
  // Arrange
  const element = EllipseElement.create({
    cx: 100,
    cy: 50,
    rx: 80,
    ry: 40,
    fill: "none",
  });

  // Act
  const config = EllipseElement.toFigmaNode(element);

  // Assert
  expect(config.fills?.length).toBe(0);
});

test("EllipseElement.toFigmaNode - rx, ry属性を指定 - cornerRadiusを設定して楕円形にする", () => {
  // Arrange
  const element = EllipseElement.create({
    cx: 100,
    cy: 50,
    rx: 80,
    ry: 40,
  });

  // Act
  const config = EllipseElement.toFigmaNode(element);

  // Assert
  expect(config.cornerRadius).toBeDefined();
});

test("EllipseElement.toFigmaNode - デフォルト値のellipse要素 - 位置0,サイズ0で変換する", () => {
  // Arrange
  const element = EllipseElement.create();

  // Act
  const config = EllipseElement.toFigmaNode(element);

  // Assert
  expect(config.x).toBe(0);
  expect(config.y).toBe(0);
  expect(config.width).toBe(0);
  expect(config.height).toBe(0);
});
