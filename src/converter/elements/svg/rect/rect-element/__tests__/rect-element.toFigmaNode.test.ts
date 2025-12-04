import { test, expect } from "vitest";
import { RectElement } from "../rect-element";

// RectElement.toFigmaNode
test("RectElement.toFigmaNode - 基本的なrect要素 - RECTANGLEノードを生成する", () => {
  // Arrange
  const element = RectElement.create({
    x: 10,
    y: 20,
    width: 100,
    height: 50,
  });

  // Act
  const config = RectElement.toFigmaNode(element);

  // Assert
  expect(config.name).toBe("rect");
  expect(config.type).toBe("RECTANGLE");
});

test("RectElement.toFigmaNode - 座標とサイズを指定 - 正しい位置とサイズを設定する", () => {
  // Arrange
  const element = RectElement.create({
    x: 10,
    y: 20,
    width: 100,
    height: 50,
  });

  // Act
  const config = RectElement.toFigmaNode(element);

  // Assert
  expect(config.x).toBe(10);
  expect(config.y).toBe(20);
  expect(config.width).toBe(100);
  expect(config.height).toBe(50);
});

test("RectElement.toFigmaNode - fill属性を指定 - fillsを適用する", () => {
  // Arrange
  const element = RectElement.create({
    x: 0,
    y: 0,
    width: 100,
    height: 50,
    fill: "#ff0000",
  });

  // Act
  const config = RectElement.toFigmaNode(element);

  // Assert
  expect(config.fills).toBeDefined();
  expect(config.fills?.length).toBe(1);
  expect(config.fills?.[0].type).toBe("SOLID");
});

test("RectElement.toFigmaNode - stroke属性を指定 - strokesを適用する", () => {
  // Arrange
  const element = RectElement.create({
    x: 0,
    y: 0,
    width: 100,
    height: 50,
    stroke: "#00ff00",
    "stroke-width": 2,
  });

  // Act
  const config = RectElement.toFigmaNode(element);

  // Assert
  expect(config.strokes).toBeDefined();
  expect(config.strokes?.length).toBe(1);
  expect(config.strokeWeight).toBe(2);
});

test("RectElement.toFigmaNode - fill属性が'none' - fillsを空配列にする", () => {
  // Arrange
  const element = RectElement.create({
    x: 0,
    y: 0,
    width: 100,
    height: 50,
    fill: "none",
  });

  // Act
  const config = RectElement.toFigmaNode(element);

  // Assert
  expect(config.fills?.length).toBe(0);
});

test("RectElement.toFigmaNode - rx属性を指定 - cornerRadiusを設定する", () => {
  // Arrange
  const element = RectElement.create({
    x: 0,
    y: 0,
    width: 100,
    height: 50,
    rx: 10,
  });

  // Act
  const config = RectElement.toFigmaNode(element);

  // Assert
  expect(config.cornerRadius).toBe(10);
});

test("RectElement.toFigmaNode - ry属性のみ指定（rxがない場合） - cornerRadiusを設定する", () => {
  // Arrange
  const element = RectElement.create({
    x: 0,
    y: 0,
    width: 100,
    height: 50,
    ry: 15,
  });

  // Act
  const config = RectElement.toFigmaNode(element);

  // Assert
  expect(config.cornerRadius).toBe(15);
});

test("RectElement.toFigmaNode - デフォルト値のrect要素 - 位置0,サイズ0で変換する", () => {
  // Arrange
  const element = RectElement.create();

  // Act
  const config = RectElement.toFigmaNode(element);

  // Assert
  expect(config.x).toBe(0);
  expect(config.y).toBe(0);
  expect(config.width).toBe(0);
  expect(config.height).toBe(0);
});
