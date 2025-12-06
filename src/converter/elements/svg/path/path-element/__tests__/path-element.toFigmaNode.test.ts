import { test, expect } from "vitest";
import { PathElement } from "../path-element";

test("PathElement.toFigmaNode - d属性を持つpath要素を渡す - type='FRAME'、name='path'のFigmaNodeConfigを返す", () => {
  // Arrange
  const element = PathElement.create({ d: "M0 0 L100 100" });

  // Act
  const config = PathElement.toFigmaNode(element);

  // Assert
  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("path");
});

test("PathElement.toFigmaNode - 直線パス'M10 20 L50 80'を渡す - x=10、y=20、width=40、height=60の境界ボックスを返す", () => {
  // Arrange
  const element = PathElement.create({ d: "M10 20 L50 80" });

  // Act
  const config = PathElement.toFigmaNode(element);

  // Assert
  expect(config.x).toBe(10);
  expect(config.y).toBe(20);
  expect(config.width).toBe(40);
  expect(config.height).toBe(60);
});

test("PathElement.toFigmaNode - 複数直線パス'M0 0 L100 0 L100 50 L0 50 Z'を渡す - x=0、y=0、width=100、height=50の境界ボックスを返す", () => {
  // Arrange
  const element = PathElement.create({ d: "M0 0 L100 0 L100 50 L0 50 Z" });

  // Act
  const config = PathElement.toFigmaNode(element);

  // Assert
  expect(config.x).toBe(0);
  expect(config.y).toBe(0);
  expect(config.width).toBe(100);
  expect(config.height).toBe(50);
});

test("PathElement.toFigmaNode - 水平線・垂直線コマンド'M10 10 H50 V40'を渡す - x=10、y=10、width=40、height=30の境界ボックスを返す", () => {
  // Arrange
  const element = PathElement.create({ d: "M10 10 H50 V40" });

  // Act
  const config = PathElement.toFigmaNode(element);

  // Assert
  expect(config.x).toBe(10);
  expect(config.y).toBe(10);
  expect(config.width).toBe(40);
  expect(config.height).toBe(30);
});

test("PathElement.toFigmaNode - fill='#ff0000'を渡す - 赤色のSOLID fillを持つFigmaNodeConfigを返す", () => {
  // Arrange
  const element = PathElement.create({
    d: "M0 0 L100 100",
    fill: "#ff0000",
  });

  // Act
  const config = PathElement.toFigmaNode(element);

  // Assert
  expect(config.fills).toBeDefined();
  expect(config.fills).toHaveLength(1);
  expect(config.fills?.[0]).toMatchObject({
    type: "SOLID",
    color: { r: 1, g: 0, b: 0 },
  });
});

test("PathElement.toFigmaNode - stroke='#00ff00'、stroke-width=3を渡す - 緑色のstrokeとstrokeWeight=3を持つFigmaNodeConfigを返す", () => {
  // Arrange
  const element = PathElement.create({
    d: "M0 0 L100 100",
    stroke: "#00ff00",
    "stroke-width": 3,
  });

  // Act
  const config = PathElement.toFigmaNode(element);

  // Assert
  expect(config.strokes).toBeDefined();
  expect(config.strokes).toHaveLength(1);
  expect(config.strokes?.[0]).toMatchObject({
    type: "SOLID",
    color: { r: 0, g: 1, b: 0 },
  });
  expect(config.strokeWeight).toBe(3);
});

test("PathElement.toFigmaNode - fill='none'を渡す - fills=[]のFigmaNodeConfigを返す", () => {
  // Arrange
  const element = PathElement.create({
    d: "M0 0 L100 100",
    fill: "none",
    stroke: "#000000",
  });

  // Act
  const config = PathElement.toFigmaNode(element);

  // Assert
  expect(config.fills).toEqual([]);
});

test("PathElement.toFigmaNode - d属性が空文字列を渡す - x=0、y=0、width=0、height=0のデフォルト境界ボックスを返す", () => {
  // Arrange
  const element = PathElement.create({ d: "" });

  // Act
  const config = PathElement.toFigmaNode(element);

  // Assert
  expect(config.x).toBe(0);
  expect(config.y).toBe(0);
  expect(config.width).toBe(0);
  expect(config.height).toBe(0);
});

test("PathElement.toFigmaNode - d属性がundefinedを渡す - x=0、y=0、width=0、height=0のデフォルト境界ボックスを返す", () => {
  // Arrange
  const element = PathElement.create({});

  // Act
  const config = PathElement.toFigmaNode(element);

  // Assert
  expect(config.x).toBe(0);
  expect(config.y).toBe(0);
  expect(config.width).toBe(0);
  expect(config.height).toBe(0);
});

test("PathElement.toFigmaNode - 負の座標を含むパス'M-50 -30 L50 30'を渡す - x=-50、y=-30、width=100、height=60の境界ボックスを返す", () => {
  // Arrange
  const element = PathElement.create({ d: "M-50 -30 L50 30" });

  // Act
  const config = PathElement.toFigmaNode(element);

  // Assert
  expect(config.x).toBe(-50);
  expect(config.y).toBe(-30);
  expect(config.width).toBe(100);
  expect(config.height).toBe(60);
});

test("PathElement.toFigmaNode - 相対座標パス'M10 10 l40 60'を渡す - 絶対座標に変換してx=10、y=10、width=40、height=60の境界ボックスを返す", () => {
  // Arrange
  const element = PathElement.create({ d: "M10 10 l40 60" });

  // Act
  const config = PathElement.toFigmaNode(element);

  // Assert
  expect(config.x).toBe(10);
  expect(config.y).toBe(10);
  expect(config.width).toBe(40);
  expect(config.height).toBe(60);
});

test("PathElement.toFigmaNode - ベジェ曲線パス'M0 50 C25 0 75 0 100 50'を渡す - 制御点を含む境界ボックスを返す", () => {
  // Arrange
  const element = PathElement.create({ d: "M0 50 C25 0 75 0 100 50" });

  // Act
  const config = PathElement.toFigmaNode(element);

  // Assert
  // 境界ボックスは制御点を含むため、最小でも以下の範囲
  expect(config.x).toBeLessThanOrEqual(0);
  expect(config.y).toBeLessThanOrEqual(0);
  expect(config.width).toBeGreaterThanOrEqual(100);
  expect(config.height).toBeGreaterThanOrEqual(50);
});
