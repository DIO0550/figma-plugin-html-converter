import { test, expect } from "vitest";
import { SvgCoordinateUtils } from "../svg-coordinate-utils";

// SvgCoordinateUtils.parseNumericAttribute
test("SvgCoordinateUtils.parseNumericAttribute - 整数文字列 - 数値にパースする", () => {
  // Arrange & Act
  const result = SvgCoordinateUtils.parseNumericAttribute("100");

  // Assert
  expect(result).toBe(100);
});

test("SvgCoordinateUtils.parseNumericAttribute - 小数点を含む文字列 - 数値にパースする", () => {
  // Arrange & Act
  const result = SvgCoordinateUtils.parseNumericAttribute("50.5");

  // Assert
  expect(result).toBe(50.5);
});

test("SvgCoordinateUtils.parseNumericAttribute - 負の数値文字列 - 数値にパースする", () => {
  // Arrange & Act
  const result = SvgCoordinateUtils.parseNumericAttribute("-25");

  // Assert
  expect(result).toBe(-25);
});

test("SvgCoordinateUtils.parseNumericAttribute - 単位付きの値 - 数値部分を抽出する", () => {
  // Arrange & Act
  const result = SvgCoordinateUtils.parseNumericAttribute("100px");

  // Assert
  expect(result).toBe(100);
});

test("SvgCoordinateUtils.parseNumericAttribute - 数値型の値 - そのまま返す", () => {
  // Arrange & Act
  const result = SvgCoordinateUtils.parseNumericAttribute(75);

  // Assert
  expect(result).toBe(75);
});

test("SvgCoordinateUtils.parseNumericAttribute - undefined - デフォルト値を返す", () => {
  // Arrange & Act
  const result = SvgCoordinateUtils.parseNumericAttribute(undefined, 0);

  // Assert
  expect(result).toBe(0);
});

test("SvgCoordinateUtils.parseNumericAttribute - 無効な文字列 - デフォルト値を返す", () => {
  // Arrange & Act
  const result = SvgCoordinateUtils.parseNumericAttribute("invalid", 0);

  // Assert
  expect(result).toBe(0);
});

test("SvgCoordinateUtils.parseNumericAttribute - 空文字列 - デフォルト値を返す", () => {
  // Arrange & Act
  const result = SvgCoordinateUtils.parseNumericAttribute("", 10);

  // Assert
  expect(result).toBe(10);
});

// SvgCoordinateUtils.calculateCircleBounds
test("SvgCoordinateUtils.calculateCircleBounds - 正の座標と半径 - 境界ボックスを計算する", () => {
  // Arrange & Act
  const bounds = SvgCoordinateUtils.calculateCircleBounds(50, 50, 25);

  // Assert
  expect(bounds.x).toBe(25);
  expect(bounds.y).toBe(25);
  expect(bounds.width).toBe(50);
  expect(bounds.height).toBe(50);
});

test("SvgCoordinateUtils.calculateCircleBounds - 原点にある円 - 負の座標を含む境界ボックスを計算する", () => {
  // Arrange & Act
  const bounds = SvgCoordinateUtils.calculateCircleBounds(0, 0, 10);

  // Assert
  expect(bounds.x).toBe(-10);
  expect(bounds.y).toBe(-10);
  expect(bounds.width).toBe(20);
  expect(bounds.height).toBe(20);
});

// SvgCoordinateUtils.calculateEllipseBounds
test("SvgCoordinateUtils.calculateEllipseBounds - 異なるrxとry - 楕円の境界ボックスを計算する", () => {
  // Arrange & Act
  const bounds = SvgCoordinateUtils.calculateEllipseBounds(100, 50, 40, 20);

  // Assert
  expect(bounds.x).toBe(60);
  expect(bounds.y).toBe(30);
  expect(bounds.width).toBe(80);
  expect(bounds.height).toBe(40);
});

// SvgCoordinateUtils.calculateLineBounds
test("SvgCoordinateUtils.calculateLineBounds - 左上から右下への直線 - 境界ボックスを計算する", () => {
  // Arrange & Act
  const bounds = SvgCoordinateUtils.calculateLineBounds(10, 20, 100, 80);

  // Assert
  expect(bounds.x).toBe(10);
  expect(bounds.y).toBe(20);
  expect(bounds.width).toBe(90);
  expect(bounds.height).toBe(60);
});

test("SvgCoordinateUtils.calculateLineBounds - 右下から左上への直線 - 正しい境界ボックスを計算する", () => {
  // Arrange & Act
  const bounds = SvgCoordinateUtils.calculateLineBounds(100, 80, 10, 20);

  // Assert
  expect(bounds.x).toBe(10);
  expect(bounds.y).toBe(20);
  expect(bounds.width).toBe(90);
  expect(bounds.height).toBe(60);
});

test("SvgCoordinateUtils.calculateLineBounds - 水平線 - 高さ0の境界ボックスを計算する", () => {
  // Arrange & Act
  const bounds = SvgCoordinateUtils.calculateLineBounds(0, 50, 100, 50);

  // Assert
  expect(bounds.x).toBe(0);
  expect(bounds.y).toBe(50);
  expect(bounds.width).toBe(100);
  expect(bounds.height).toBe(0);
});

test("SvgCoordinateUtils.calculateLineBounds - 垂直線 - 幅0の境界ボックスを計算する", () => {
  // Arrange & Act
  const bounds = SvgCoordinateUtils.calculateLineBounds(50, 0, 50, 100);

  // Assert
  expect(bounds.x).toBe(50);
  expect(bounds.y).toBe(0);
  expect(bounds.width).toBe(0);
  expect(bounds.height).toBe(100);
});

// SvgCoordinateUtils.calculateRectBounds
test("SvgCoordinateUtils.calculateRectBounds - 座標とサイズを指定 - 境界ボックスを計算する", () => {
  // Arrange & Act
  const bounds = SvgCoordinateUtils.calculateRectBounds(10, 20, 100, 50);

  // Assert
  expect(bounds.x).toBe(10);
  expect(bounds.y).toBe(20);
  expect(bounds.width).toBe(100);
  expect(bounds.height).toBe(50);
});
