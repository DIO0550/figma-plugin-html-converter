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

// SvgCoordinateUtils.parsePoints
test("SvgCoordinateUtils.parsePoints - カンマ区切りの座標ペア - 点の配列を返す", () => {
  // Arrange & Act
  const points = SvgCoordinateUtils.parsePoints("100,10 40,198 190,78");

  // Assert
  expect(points).toEqual([
    { x: 100, y: 10 },
    { x: 40, y: 198 },
    { x: 190, y: 78 },
  ]);
});

test("SvgCoordinateUtils.parsePoints - スペースのみの区切り - 点の配列を返す", () => {
  // Arrange & Act
  const points = SvgCoordinateUtils.parsePoints("100 10 40 198 190 78");

  // Assert
  expect(points).toEqual([
    { x: 100, y: 10 },
    { x: 40, y: 198 },
    { x: 190, y: 78 },
  ]);
});

test("SvgCoordinateUtils.parsePoints - 負の値を含む座標 - 正しくパースする", () => {
  // Arrange & Act
  const points = SvgCoordinateUtils.parsePoints("-10,20 30,-40 -50,-60");

  // Assert
  expect(points).toEqual([
    { x: -10, y: 20 },
    { x: 30, y: -40 },
    { x: -50, y: -60 },
  ]);
});

test("SvgCoordinateUtils.parsePoints - 小数点を含む座標 - 正しくパースする", () => {
  // Arrange & Act
  const points = SvgCoordinateUtils.parsePoints("10.5,20.3 30.7,40.9");

  // Assert
  expect(points).toEqual([
    { x: 10.5, y: 20.3 },
    { x: 30.7, y: 40.9 },
  ]);
});

test("SvgCoordinateUtils.parsePoints - 空文字列 - 空配列を返す", () => {
  // Arrange & Act
  const points = SvgCoordinateUtils.parsePoints("");

  // Assert
  expect(points).toEqual([]);
});

test("SvgCoordinateUtils.parsePoints - undefined - 空配列を返す", () => {
  // Arrange & Act
  const points = SvgCoordinateUtils.parsePoints(undefined);

  // Assert
  expect(points).toEqual([]);
});

test("SvgCoordinateUtils.parsePoints - 奇数個の数値 - 完全なペアのみ返す", () => {
  // Arrange & Act
  const points = SvgCoordinateUtils.parsePoints("10,20 30,40 50");

  // Assert
  expect(points).toEqual([
    { x: 10, y: 20 },
    { x: 30, y: 40 },
  ]);
});

test("SvgCoordinateUtils.parsePoints - 余分な空白を含む - 正しくパースする", () => {
  // Arrange & Act
  const points = SvgCoordinateUtils.parsePoints("  10,20   30,40  ");

  // Assert
  expect(points).toEqual([
    { x: 10, y: 20 },
    { x: 30, y: 40 },
  ]);
});

// SvgCoordinateUtils.calculatePointsBounds
test("SvgCoordinateUtils.calculatePointsBounds - 複数の点 - 境界ボックスを計算する", () => {
  // Arrange
  const points = [
    { x: 100, y: 10 },
    { x: 40, y: 198 },
    { x: 190, y: 78 },
  ];

  // Act
  const bounds = SvgCoordinateUtils.calculatePointsBounds(points);

  // Assert
  expect(bounds.x).toBe(40);
  expect(bounds.y).toBe(10);
  expect(bounds.width).toBe(150);
  expect(bounds.height).toBe(188);
});

test("SvgCoordinateUtils.calculatePointsBounds - 空の配列 - ゼロの境界ボックスを返す", () => {
  // Arrange & Act
  const bounds = SvgCoordinateUtils.calculatePointsBounds([]);

  // Assert
  expect(bounds.x).toBe(0);
  expect(bounds.y).toBe(0);
  expect(bounds.width).toBe(0);
  expect(bounds.height).toBe(0);
});

test("SvgCoordinateUtils.calculatePointsBounds - 単一の点 - 幅と高さ0の境界ボックスを返す", () => {
  // Arrange
  const points = [{ x: 50, y: 30 }];

  // Act
  const bounds = SvgCoordinateUtils.calculatePointsBounds(points);

  // Assert
  expect(bounds.x).toBe(50);
  expect(bounds.y).toBe(30);
  expect(bounds.width).toBe(0);
  expect(bounds.height).toBe(0);
});

test("SvgCoordinateUtils.calculatePointsBounds - 負の座標を含む - 正しい境界ボックスを計算する", () => {
  // Arrange
  const points = [
    { x: -10, y: -20 },
    { x: 30, y: 40 },
  ];

  // Act
  const bounds = SvgCoordinateUtils.calculatePointsBounds(points);

  // Assert
  expect(bounds.x).toBe(-10);
  expect(bounds.y).toBe(-20);
  expect(bounds.width).toBe(40);
  expect(bounds.height).toBe(60);
});
