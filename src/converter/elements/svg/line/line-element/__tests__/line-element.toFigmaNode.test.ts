import { test, expect } from "vitest";
import { LineElement } from "../line-element";

// LineElement.toFigmaNode
test("LineElement.toFigmaNode - 基本的なline要素 - FRAMEノードを生成する", () => {
  // Arrange
  const element = LineElement.create({
    x1: 10,
    y1: 20,
    x2: 100,
    y2: 80,
  });

  // Act
  const config = LineElement.toFigmaNode(element);

  // Assert
  expect(config.name).toBe("line");
  expect(config.type).toBe("FRAME");
});

test("LineElement.toFigmaNode - 座標を指定 - 正しい位置とサイズを設定する", () => {
  // Arrange
  const element = LineElement.create({
    x1: 10,
    y1: 20,
    x2: 100,
    y2: 80,
  });

  // Act
  const config = LineElement.toFigmaNode(element);

  // Assert
  expect(config.x).toBe(10);
  expect(config.y).toBe(20);
  expect(config.width).toBe(90);
  expect(config.height).toBe(60);
});

test("LineElement.toFigmaNode - stroke属性を指定 - strokesを適用する", () => {
  // Arrange
  const element = LineElement.create({
    x1: 0,
    y1: 0,
    x2: 100,
    y2: 100,
    stroke: "#ff0000",
    "stroke-width": 2,
  });

  // Act
  const config = LineElement.toFigmaNode(element);

  // Assert
  expect(config.strokes).toBeDefined();
  expect(config.strokes?.length).toBe(1);
  expect(config.strokeWeight).toBe(2);
});

test("LineElement.toFigmaNode - stroke属性がない - デフォルトでストロークを設定する", () => {
  // Arrange
  const element = LineElement.create({
    x1: 0,
    y1: 0,
    x2: 100,
    y2: 100,
  });

  // Act
  const config = LineElement.toFigmaNode(element);

  // Assert
  expect(config.strokes).toBeDefined();
});

test("LineElement.toFigmaNode - 逆方向の線 - 正しい境界ボックスを計算する", () => {
  // Arrange
  const element = LineElement.create({
    x1: 100,
    y1: 80,
    x2: 10,
    y2: 20,
  });

  // Act
  const config = LineElement.toFigmaNode(element);

  // Assert
  expect(config.x).toBe(10);
  expect(config.y).toBe(20);
  expect(config.width).toBe(90);
  expect(config.height).toBe(60);
});

test("LineElement.toFigmaNode - 水平線 - 高さ0の境界ボックスを計算する", () => {
  // Arrange
  const element = LineElement.create({
    x1: 0,
    y1: 50,
    x2: 100,
    y2: 50,
  });

  // Act
  const config = LineElement.toFigmaNode(element);

  // Assert
  expect(config.x).toBe(0);
  expect(config.y).toBe(50);
  expect(config.width).toBe(100);
  expect(config.height).toBe(0);
});

test("LineElement.toFigmaNode - 垂直線 - 幅0の境界ボックスを計算する", () => {
  // Arrange
  const element = LineElement.create({
    x1: 50,
    y1: 0,
    x2: 50,
    y2: 100,
  });

  // Act
  const config = LineElement.toFigmaNode(element);

  // Assert
  expect(config.x).toBe(50);
  expect(config.y).toBe(0);
  expect(config.width).toBe(0);
  expect(config.height).toBe(100);
});

test("LineElement.toFigmaNode - デフォルト値のline要素 - 位置0,サイズ0で変換する", () => {
  // Arrange
  const element = LineElement.create();

  // Act
  const config = LineElement.toFigmaNode(element);

  // Assert
  expect(config.x).toBe(0);
  expect(config.y).toBe(0);
  expect(config.width).toBe(0);
  expect(config.height).toBe(0);
});
