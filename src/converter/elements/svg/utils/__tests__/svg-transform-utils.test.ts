import { test, expect } from "vitest";
import { SvgTransformUtils, TransformCommand } from "../svg-transform-utils";

// parseTransform - 基本ケース
test("SvgTransformUtils.parseTransform - 空文字列 - 空配列を返す", () => {
  // Arrange
  const input = "";

  // Act
  const result = SvgTransformUtils.parseTransform(input);

  // Assert
  expect(result).toEqual([]);
});

test("SvgTransformUtils.parseTransform - undefined - 空配列を返す", () => {
  // Arrange
  const input = undefined;

  // Act
  const result = SvgTransformUtils.parseTransform(input);

  // Assert
  expect(result).toEqual([]);
});

// parseTransform - translate
test("SvgTransformUtils.parseTransform - translate(10, 20) - tx=10, ty=20のtranslateコマンドを返す", () => {
  // Arrange
  const input = "translate(10, 20)";

  // Act
  const result = SvgTransformUtils.parseTransform(input);

  // Assert
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "translate",
    tx: 10,
    ty: 20,
  });
});

test("SvgTransformUtils.parseTransform - translate(50) - tx=50, ty=0のtranslateコマンドを返す", () => {
  // Arrange
  const input = "translate(50)";

  // Act
  const result = SvgTransformUtils.parseTransform(input);

  // Assert
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "translate",
    tx: 50,
    ty: 0,
  });
});

test("SvgTransformUtils.parseTransform - translate(-10, -20) - 負の値を正しく解析する", () => {
  // Arrange
  const input = "translate(-10, -20)";

  // Act
  const result = SvgTransformUtils.parseTransform(input);

  // Assert
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "translate",
    tx: -10,
    ty: -20,
  });
});

test("SvgTransformUtils.parseTransform - translate(10.5, 20.75) - 小数点を含む値を正しく解析する", () => {
  // Arrange
  const input = "translate(10.5, 20.75)";

  // Act
  const result = SvgTransformUtils.parseTransform(input);

  // Assert
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "translate",
    tx: 10.5,
    ty: 20.75,
  });
});

test("SvgTransformUtils.parseTransform - translate(0, 0) - ゼロ値の移動を正しく解析する", () => {
  // Arrange
  const input = "translate(0, 0)";

  // Act
  const result = SvgTransformUtils.parseTransform(input);

  // Assert
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "translate",
    tx: 0,
    ty: 0,
  });
});

// parseTransform - rotate
test("SvgTransformUtils.parseTransform - rotate(45) - angle=45, cx=0, cy=0のrotateコマンドを返す", () => {
  // Arrange
  const input = "rotate(45)";

  // Act
  const result = SvgTransformUtils.parseTransform(input);

  // Assert
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "rotate",
    angle: 45,
    cx: 0,
    cy: 0,
  });
});

test("SvgTransformUtils.parseTransform - rotate(90, 50, 50) - angle=90, cx=50, cy=50のrotateコマンドを返す", () => {
  // Arrange
  const input = "rotate(90, 50, 50)";

  // Act
  const result = SvgTransformUtils.parseTransform(input);

  // Assert
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "rotate",
    angle: 90,
    cx: 50,
    cy: 50,
  });
});

test("SvgTransformUtils.parseTransform - rotate(-30) - 負の角度を正しく解析する", () => {
  // Arrange
  const input = "rotate(-30)";

  // Act
  const result = SvgTransformUtils.parseTransform(input);

  // Assert
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "rotate",
    angle: -30,
    cx: 0,
    cy: 0,
  });
});

// parseTransform - scale
test("SvgTransformUtils.parseTransform - scale(2) - sx=2, sy=2のscaleコマンドを返す", () => {
  // Arrange
  const input = "scale(2)";

  // Act
  const result = SvgTransformUtils.parseTransform(input);

  // Assert
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "scale",
    sx: 2,
    sy: 2,
  });
});

test("SvgTransformUtils.parseTransform - scale(2, 3) - sx=2, sy=3のscaleコマンドを返す", () => {
  // Arrange
  const input = "scale(2, 3)";

  // Act
  const result = SvgTransformUtils.parseTransform(input);

  // Assert
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "scale",
    sx: 2,
    sy: 3,
  });
});

test("SvgTransformUtils.parseTransform - scale(0.5) - 小数のスケールを正しく解析する", () => {
  // Arrange
  const input = "scale(0.5)";

  // Act
  const result = SvgTransformUtils.parseTransform(input);

  // Assert
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "scale",
    sx: 0.5,
    sy: 0.5,
  });
});

test("SvgTransformUtils.parseTransform - scale(-1, 1) - 負のスケール値（水平反転）を正しく解析する", () => {
  // Arrange
  const input = "scale(-1, 1)";

  // Act
  const result = SvgTransformUtils.parseTransform(input);

  // Assert
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "scale",
    sx: -1,
    sy: 1,
  });
});

test("SvgTransformUtils.parseTransform - scale(1, -1) - 負のスケール値（垂直反転）を正しく解析する", () => {
  // Arrange
  const input = "scale(1, -1)";

  // Act
  const result = SvgTransformUtils.parseTransform(input);

  // Assert
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "scale",
    sx: 1,
    sy: -1,
  });
});

// parseTransform - skewX/skewY
test("SvgTransformUtils.parseTransform - skewX(30) - angle=30のskewXコマンドを返す", () => {
  // Arrange
  const input = "skewX(30)";

  // Act
  const result = SvgTransformUtils.parseTransform(input);

  // Assert
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "skewX",
    angle: 30,
  });
});

test("SvgTransformUtils.parseTransform - skewY(45) - angle=45のskewYコマンドを返す", () => {
  // Arrange
  const input = "skewY(45)";

  // Act
  const result = SvgTransformUtils.parseTransform(input);

  // Assert
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "skewY",
    angle: 45,
  });
});

// parseTransform - matrix
test("SvgTransformUtils.parseTransform - matrix(1, 0, 0, 1, 10, 20) - 6パラメータのmatrixコマンドを返す", () => {
  // Arrange
  const input = "matrix(1, 0, 0, 1, 10, 20)";

  // Act
  const result = SvgTransformUtils.parseTransform(input);

  // Assert
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "matrix",
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 10,
    f: 20,
  });
});

// parseTransform - 複数の変換
test("SvgTransformUtils.parseTransform - translate(10, 20) rotate(45) - スペース区切りの複数変換を順序通りに解析する", () => {
  // Arrange
  const input = "translate(10, 20) rotate(45)";

  // Act
  const result = SvgTransformUtils.parseTransform(input);

  // Assert
  expect(result).toHaveLength(2);
  expect(result[0]).toEqual({
    type: "translate",
    tx: 10,
    ty: 20,
  });
  expect(result[1]).toEqual({
    type: "rotate",
    angle: 45,
    cx: 0,
    cy: 0,
  });
});

test("SvgTransformUtils.parseTransform - scale(2), translate(50, 50) - カンマ区切りの複数変換を順序通りに解析する", () => {
  // Arrange
  const input = "scale(2), translate(50, 50)";

  // Act
  const result = SvgTransformUtils.parseTransform(input);

  // Assert
  expect(result).toHaveLength(2);
  expect(result[0]).toEqual({
    type: "scale",
    sx: 2,
    sy: 2,
  });
  expect(result[1]).toEqual({
    type: "translate",
    tx: 50,
    ty: 50,
  });
});

// calculateTransformedBounds
test("SvgTransformUtils.calculateTransformedBounds - translateコマンド - 位置が移動しサイズは維持される", () => {
  // Arrange
  const bounds = { x: 0, y: 0, width: 100, height: 50 };
  const commands: TransformCommand[] = [{ type: "translate", tx: 10, ty: 20 }];

  // Act
  const result = SvgTransformUtils.calculateTransformedBounds(bounds, commands);

  // Assert
  expect(result.x).toBe(10);
  expect(result.y).toBe(20);
  expect(result.width).toBe(100);
  expect(result.height).toBe(50);
});

test("SvgTransformUtils.calculateTransformedBounds - scaleコマンド - サイズが拡大される", () => {
  // Arrange
  const bounds = { x: 0, y: 0, width: 100, height: 50 };
  const commands: TransformCommand[] = [{ type: "scale", sx: 2, sy: 2 }];

  // Act
  const result = SvgTransformUtils.calculateTransformedBounds(bounds, commands);

  // Assert
  expect(result.width).toBe(200);
  expect(result.height).toBe(100);
});

test("SvgTransformUtils.calculateTransformedBounds - translate後にscale - 移動してから拡大される", () => {
  // Arrange
  const bounds = { x: 0, y: 0, width: 100, height: 50 };
  const commands: TransformCommand[] = [
    { type: "translate", tx: 10, ty: 20 },
    { type: "scale", sx: 2, sy: 2 },
  ];

  // Act
  const result = SvgTransformUtils.calculateTransformedBounds(bounds, commands);

  // Assert
  expect(result.x).toBe(20);
  expect(result.y).toBe(40);
  expect(result.width).toBe(200);
  expect(result.height).toBe(100);
});

test("SvgTransformUtils.calculateTransformedBounds - 空のコマンド配列 - 元の境界をそのまま返す", () => {
  // Arrange
  const bounds = { x: 10, y: 20, width: 100, height: 50 };
  const commands: TransformCommand[] = [];

  // Act
  const result = SvgTransformUtils.calculateTransformedBounds(bounds, commands);

  // Assert
  expect(result).toEqual(bounds);
});

test("SvgTransformUtils.calculateTransformedBounds - 負のscaleコマンド - width/heightは絶対値になる", () => {
  // Arrange
  const bounds = { x: 10, y: 20, width: 100, height: 50 };
  const commands: TransformCommand[] = [{ type: "scale", sx: -1, sy: 1 }];

  // Act
  const result = SvgTransformUtils.calculateTransformedBounds(bounds, commands);

  // Assert
  // 負のスケールは反転を意味するが、Figmaでは負のwidth/heightは許容されないため
  // 絶対値を使用する（x, yは負の値のままだが、位置座標なので問題ない）
  expect(result.x).toBe(-10);
  expect(result.y).toBe(20);
  expect(result.width).toBe(100); // Math.absにより正の値
  expect(result.height).toBe(50);
});

// calculateTransformedBounds - 簡易実装のコマンド（境界をそのまま返す）
test("SvgTransformUtils.calculateTransformedBounds - rotateコマンド - 簡易実装のため境界をそのまま返す", () => {
  // Arrange
  const bounds = { x: 10, y: 20, width: 100, height: 50 };
  const commands: TransformCommand[] = [
    { type: "rotate", angle: 45, cx: 0, cy: 0 },
  ];

  // Act
  const result = SvgTransformUtils.calculateTransformedBounds(bounds, commands);

  // Assert
  expect(result).toEqual(bounds);
});

test("SvgTransformUtils.calculateTransformedBounds - skewXコマンド - 簡易実装のため境界をそのまま返す", () => {
  // Arrange
  const bounds = { x: 10, y: 20, width: 100, height: 50 };
  const commands: TransformCommand[] = [{ type: "skewX", angle: 30 }];

  // Act
  const result = SvgTransformUtils.calculateTransformedBounds(bounds, commands);

  // Assert
  expect(result).toEqual(bounds);
});

test("SvgTransformUtils.calculateTransformedBounds - skewYコマンド - 簡易実装のため境界をそのまま返す", () => {
  // Arrange
  const bounds = { x: 10, y: 20, width: 100, height: 50 };
  const commands: TransformCommand[] = [{ type: "skewY", angle: 30 }];

  // Act
  const result = SvgTransformUtils.calculateTransformedBounds(bounds, commands);

  // Assert
  expect(result).toEqual(bounds);
});

test("SvgTransformUtils.calculateTransformedBounds - matrixコマンド - 簡易実装のため境界をそのまま返す", () => {
  // Arrange
  const bounds = { x: 10, y: 20, width: 100, height: 50 };
  const commands: TransformCommand[] = [
    { type: "matrix", a: 1, b: 0, c: 0, d: 1, e: 10, f: 20 },
  ];

  // Act
  const result = SvgTransformUtils.calculateTransformedBounds(bounds, commands);

  // Assert
  expect(result).toEqual(bounds);
});

// extractTranslation
test("SvgTransformUtils.extractTranslation - 単一のtranslateコマンド - 移動量を抽出する", () => {
  // Arrange
  const commands: TransformCommand[] = [{ type: "translate", tx: 10, ty: 20 }];

  // Act
  const result = SvgTransformUtils.extractTranslation(commands);

  // Assert
  expect(result).toEqual({ x: 10, y: 20 });
});

test("SvgTransformUtils.extractTranslation - 複数のtranslateコマンド - 移動量を合算する", () => {
  // Arrange
  const commands: TransformCommand[] = [
    { type: "translate", tx: 10, ty: 20 },
    { type: "translate", tx: 5, ty: 10 },
  ];

  // Act
  const result = SvgTransformUtils.extractTranslation(commands);

  // Assert
  expect(result).toEqual({ x: 15, y: 30 });
});

test("SvgTransformUtils.extractTranslation - translateがない場合 - {x: 0, y: 0}を返す", () => {
  // Arrange
  const commands: TransformCommand[] = [{ type: "scale", sx: 2, sy: 2 }];

  // Act
  const result = SvgTransformUtils.extractTranslation(commands);

  // Assert
  expect(result).toEqual({ x: 0, y: 0 });
});

test("SvgTransformUtils.extractTranslation - 空配列 - {x: 0, y: 0}を返す", () => {
  // Arrange
  const commands: TransformCommand[] = [];

  // Act
  const result = SvgTransformUtils.extractTranslation(commands);

  // Assert
  expect(result).toEqual({ x: 0, y: 0 });
});

// parseArgs - エッジケース
test("SvgTransformUtils.parseArgs - 複数の連続空白 - 正しく数値配列に変換する", () => {
  // Arrange
  const input = "10  20";

  // Act
  const result = SvgTransformUtils.parseArgs(input);

  // Assert
  expect(result).toEqual([10, 20]);
});

test("SvgTransformUtils.parseArgs - カンマと空白の混在 - 正しく数値配列に変換する", () => {
  // Arrange
  const input = "10, 20  ,  30";

  // Act
  const result = SvgTransformUtils.parseArgs(input);

  // Assert
  expect(result).toEqual([10, 20, 30]);
});

test("SvgTransformUtils.parseArgs - 前後の空白 - 正しく数値配列に変換する", () => {
  // Arrange
  const input = "  10,20  ";

  // Act
  const result = SvgTransformUtils.parseArgs(input);

  // Assert
  expect(result).toEqual([10, 20]);
});

test("SvgTransformUtils.parseArgs - 不正な値を含む - NaNはフィルタリングされる", () => {
  // Arrange
  const input = "10,abc,20";

  // Act
  const result = SvgTransformUtils.parseArgs(input);

  // Assert
  expect(result).toEqual([10, 20]);
});

test("SvgTransformUtils.parseArgs - 空文字列 - 空配列を返す", () => {
  // Arrange
  const input = "";

  // Act
  const result = SvgTransformUtils.parseArgs(input);

  // Assert
  expect(result).toEqual([]);
});

test("SvgTransformUtils.parseArgs - 空白のみ - 空配列を返す", () => {
  // Arrange
  const input = "   ";

  // Act
  const result = SvgTransformUtils.parseArgs(input);

  // Assert
  expect(result).toEqual([]);
});
