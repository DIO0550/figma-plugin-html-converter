import { test, expect } from "vitest";
import { PathParser } from "../path-parser";
import {
  MoveToCommand,
  LineToCommand,
  HorizontalLineToCommand,
  VerticalLineToCommand,
  CubicBezierCommand,
  SmoothCubicBezierCommand,
  QuadraticBezierCommand,
  SmoothQuadraticBezierCommand,
  ArcCommand,
  ClosePathCommand,
} from "../path-command";

// 基本コマンド - 空文字列
test("PathParser.parse - 空文字列を渡す - 空配列を返す", () => {
  // Act
  const result = PathParser.parse("");

  // Assert
  expect(result).toEqual([]);
});

// MoveTo
test("PathParser.parse - MoveTo絶対座標'M10 20'を渡す - MoveToCommand(x=10, y=20, relative=false)を返す", () => {
  // Act
  const result = PathParser.parse("M10 20");

  // Assert
  expect(result).toHaveLength(1);
  expect(MoveToCommand.isMoveToCommand(result[0])).toBe(true);
  expect(result[0]).toMatchObject({
    type: "M",
    x: 10,
    y: 20,
    relative: false,
  });
});

test("PathParser.parse - MoveTo相対座標'm10 20'を渡す - relative=trueのMoveToCommandを返す", () => {
  // Act
  const result = PathParser.parse("m10 20");

  // Assert
  expect(result).toHaveLength(1);
  expect(result[0]).toMatchObject({
    type: "M",
    x: 10,
    y: 20,
    relative: true,
  });
});

// LineTo
test("PathParser.parse - LineTo絶対座標'M0 0 L30 40'を渡す - LineToCommand(x=30, y=40, relative=false)を返す", () => {
  // Act
  const result = PathParser.parse("M0 0 L30 40");

  // Assert
  expect(result).toHaveLength(2);
  expect(LineToCommand.isLineToCommand(result[1])).toBe(true);
  expect(result[1]).toMatchObject({
    type: "L",
    x: 30,
    y: 40,
    relative: false,
  });
});

test("PathParser.parse - LineTo相対座標'M0 0 l30 40'を渡す - relative=trueのLineToCommandを返す", () => {
  // Act
  const result = PathParser.parse("M0 0 l30 40");

  // Assert
  expect(result).toHaveLength(2);
  expect(result[1]).toMatchObject({
    type: "L",
    x: 30,
    y: 40,
    relative: true,
  });
});

// HorizontalLineTo
test("PathParser.parse - HorizontalLineTo絶対座標'M0 0 H50'を渡す - HorizontalLineToCommand(x=50, relative=false)を返す", () => {
  // Act
  const result = PathParser.parse("M0 0 H50");

  // Assert
  expect(result).toHaveLength(2);
  expect(HorizontalLineToCommand.isHorizontalLineToCommand(result[1])).toBe(
    true,
  );
  expect(result[1]).toMatchObject({ type: "H", x: 50, relative: false });
});

test("PathParser.parse - HorizontalLineTo相対座標'M0 0 h50'を渡す - relative=trueのHorizontalLineToCommandを返す", () => {
  // Act
  const result = PathParser.parse("M0 0 h50");

  // Assert
  expect(result).toHaveLength(2);
  expect(result[1]).toMatchObject({ type: "H", x: 50, relative: true });
});

// VerticalLineTo
test("PathParser.parse - VerticalLineTo絶対座標'M0 0 V60'を渡す - VerticalLineToCommand(y=60, relative=false)を返す", () => {
  // Act
  const result = PathParser.parse("M0 0 V60");

  // Assert
  expect(result).toHaveLength(2);
  expect(VerticalLineToCommand.isVerticalLineToCommand(result[1])).toBe(true);
  expect(result[1]).toMatchObject({ type: "V", y: 60, relative: false });
});

test("PathParser.parse - VerticalLineTo相対座標'M0 0 v60'を渡す - relative=trueのVerticalLineToCommandを返す", () => {
  // Act
  const result = PathParser.parse("M0 0 v60");

  // Assert
  expect(result).toHaveLength(2);
  expect(result[1]).toMatchObject({ type: "V", y: 60, relative: true });
});

// ClosePath
test("PathParser.parse - ClosePath大文字'M0 0 L10 10 Z'を渡す - ClosePathCommandを返す", () => {
  // Act
  const result = PathParser.parse("M0 0 L10 10 Z");

  // Assert
  expect(result).toHaveLength(3);
  expect(ClosePathCommand.isClosePathCommand(result[2])).toBe(true);
  expect(result[2]).toMatchObject({ type: "Z" });
});

test("PathParser.parse - ClosePath小文字'M0 0 L10 10 z'を渡す - ClosePathCommandを返す", () => {
  // Act
  const result = PathParser.parse("M0 0 L10 10 z");

  // Assert
  expect(result).toHaveLength(3);
  expect(ClosePathCommand.isClosePathCommand(result[2])).toBe(true);
});

// 曲線コマンド - CubicBezier
test("PathParser.parse - CubicBezier絶対座標'M0 0 C10 20 30 40 50 60'を渡す - CubicBezierCommandを返す", () => {
  // Act
  const result = PathParser.parse("M0 0 C10 20 30 40 50 60");

  // Assert
  expect(result).toHaveLength(2);
  expect(CubicBezierCommand.isCubicBezierCommand(result[1])).toBe(true);
  expect(result[1]).toMatchObject({
    type: "C",
    x1: 10,
    y1: 20,
    x2: 30,
    y2: 40,
    x: 50,
    y: 60,
    relative: false,
  });
});

test("PathParser.parse - CubicBezier相対座標'M0 0 c10 20 30 40 50 60'を渡す - relative=trueのCubicBezierCommandを返す", () => {
  // Act
  const result = PathParser.parse("M0 0 c10 20 30 40 50 60");

  // Assert
  expect(result).toHaveLength(2);
  expect(result[1]).toMatchObject({ type: "C", relative: true });
});

// SmoothCubicBezier
test("PathParser.parse - SmoothCubicBezier絶対座標'M0 0 S30 40 50 60'を渡す - SmoothCubicBezierCommandを返す", () => {
  // Act
  const result = PathParser.parse("M0 0 S30 40 50 60");

  // Assert
  expect(result).toHaveLength(2);
  expect(SmoothCubicBezierCommand.isSmoothCubicBezierCommand(result[1])).toBe(
    true,
  );
  expect(result[1]).toMatchObject({
    type: "S",
    x2: 30,
    y2: 40,
    x: 50,
    y: 60,
    relative: false,
  });
});

test("PathParser.parse - SmoothCubicBezier相対座標'M0 0 s30 40 50 60'を渡す - relative=trueのSmoothCubicBezierCommandを返す", () => {
  // Act
  const result = PathParser.parse("M0 0 s30 40 50 60");

  // Assert
  expect(result).toHaveLength(2);
  expect(result[1]).toMatchObject({ type: "S", relative: true });
});

// QuadraticBezier
test("PathParser.parse - QuadraticBezier絶対座標'M0 0 Q10 20 30 40'を渡す - QuadraticBezierCommandを返す", () => {
  // Act
  const result = PathParser.parse("M0 0 Q10 20 30 40");

  // Assert
  expect(result).toHaveLength(2);
  expect(QuadraticBezierCommand.isQuadraticBezierCommand(result[1])).toBe(true);
  expect(result[1]).toMatchObject({
    type: "Q",
    x1: 10,
    y1: 20,
    x: 30,
    y: 40,
    relative: false,
  });
});

test("PathParser.parse - QuadraticBezier相対座標'M0 0 q10 20 30 40'を渡す - relative=trueのQuadraticBezierCommandを返す", () => {
  // Act
  const result = PathParser.parse("M0 0 q10 20 30 40");

  // Assert
  expect(result).toHaveLength(2);
  expect(result[1]).toMatchObject({ type: "Q", relative: true });
});

// SmoothQuadraticBezier
test("PathParser.parse - SmoothQuadraticBezier絶対座標'M0 0 T30 40'を渡す - SmoothQuadraticBezierCommandを返す", () => {
  // Act
  const result = PathParser.parse("M0 0 T30 40");

  // Assert
  expect(result).toHaveLength(2);
  expect(
    SmoothQuadraticBezierCommand.isSmoothQuadraticBezierCommand(result[1]),
  ).toBe(true);
  expect(result[1]).toMatchObject({
    type: "T",
    x: 30,
    y: 40,
    relative: false,
  });
});

test("PathParser.parse - SmoothQuadraticBezier相対座標'M0 0 t30 40'を渡す - relative=trueのSmoothQuadraticBezierCommandを返す", () => {
  // Act
  const result = PathParser.parse("M0 0 t30 40");

  // Assert
  expect(result).toHaveLength(2);
  expect(result[1]).toMatchObject({ type: "T", relative: true });
});

// Arc
test("PathParser.parse - Arc絶対座標'M0 0 A10 20 45 1 0 30 40'を渡す - ArcCommandを返す", () => {
  // Act
  const result = PathParser.parse("M0 0 A10 20 45 1 0 30 40");

  // Assert
  expect(result).toHaveLength(2);
  expect(ArcCommand.isArcCommand(result[1])).toBe(true);
  expect(result[1]).toMatchObject({
    type: "A",
    rx: 10,
    ry: 20,
    xAxisRotation: 45,
    largeArcFlag: true,
    sweepFlag: false,
    x: 30,
    y: 40,
    relative: false,
  });
});

test("PathParser.parse - Arc相対座標'M0 0 a10 20 45 0 1 30 40'を渡す - フラグと相対座標が正しく設定されたArcCommandを返す", () => {
  // Act
  const result = PathParser.parse("M0 0 a10 20 45 0 1 30 40");

  // Assert
  expect(result).toHaveLength(2);
  expect(result[1]).toMatchObject({
    type: "A",
    largeArcFlag: false,
    sweepFlag: true,
    relative: true,
  });
});

// 複合パス - 三角形
test("PathParser.parse - 三角形パス'M0 0 L50 100 L100 0 Z'を渡す - 4つのコマンド(M, L, L, Z)を返す", () => {
  // Act
  const result = PathParser.parse("M0 0 L50 100 L100 0 Z");

  // Assert
  expect(result).toHaveLength(4);
  expect(MoveToCommand.isMoveToCommand(result[0])).toBe(true);
  expect(LineToCommand.isLineToCommand(result[1])).toBe(true);
  expect(LineToCommand.isLineToCommand(result[2])).toBe(true);
  expect(ClosePathCommand.isClosePathCommand(result[3])).toBe(true);
});

test("PathParser.parse - 四角形パス'M0 0 H100 V100 H0 Z'を渡す - 5つのコマンドを返す", () => {
  // Act
  const result = PathParser.parse("M0 0 H100 V100 H0 Z");

  // Assert
  expect(result).toHaveLength(5);
});

test("PathParser.parse - カンマ区切り'M10,20 L30,40'を渡す - 座標が正しくパースされる", () => {
  // Act
  const result = PathParser.parse("M10,20 L30,40");

  // Assert
  expect(result).toHaveLength(2);
  expect(result[0]).toMatchObject({ x: 10, y: 20 });
  expect(result[1]).toMatchObject({ x: 30, y: 40 });
});

test("PathParser.parse - 連続座標'M0 0 10 20 30 40'を渡す - 暗黙的なLineToコマンドとしてパースする", () => {
  // Act
  const result = PathParser.parse("M0 0 10 20 30 40");

  // Assert
  expect(result).toHaveLength(3);
  expect(MoveToCommand.isMoveToCommand(result[0])).toBe(true);
  expect(LineToCommand.isLineToCommand(result[1])).toBe(true);
  expect(LineToCommand.isLineToCommand(result[2])).toBe(true);
});

test("PathParser.parse - 負の値'M-10 -20 L-30 -40'を渡す - 負の座標が正しくパースされる", () => {
  // Act
  const result = PathParser.parse("M-10 -20 L-30 -40");

  // Assert
  expect(result).toHaveLength(2);
  expect(result[0]).toMatchObject({ x: -10, y: -20 });
  expect(result[1]).toMatchObject({ x: -30, y: -40 });
});

test("PathParser.parse - 小数点'M10.5 20.5 L30.5 40.5'を渡す - 小数点座標が正しくパースされる", () => {
  // Act
  const result = PathParser.parse("M10.5 20.5 L30.5 40.5");

  // Assert
  expect(result).toHaveLength(2);
  expect(result[0]).toMatchObject({ x: 10.5, y: 20.5 });
  expect(result[1]).toMatchObject({ x: 30.5, y: 40.5 });
});

test("PathParser.parse - 指数表記'M1e2 2e-1'を渡す - 指数表記が正しくパースされる", () => {
  // Act
  const result = PathParser.parse("M1e2 2e-1");

  // Assert
  expect(result).toHaveLength(1);
  expect(result[0]).toMatchObject({ x: 100, y: 0.2 });
});

// エッジケース
test("PathParser.parse - 空白のみ'   'を渡す - 空配列を返す", () => {
  // Act
  const result = PathParser.parse("   ");

  // Assert
  expect(result).toEqual([]);
});

test("PathParser.parse - 複数の空白'M  10   20   L  30   40'を渡す - 正しくパースされる", () => {
  // Act
  const result = PathParser.parse("M  10   20   L  30   40");

  // Assert
  expect(result).toHaveLength(2);
});

test("PathParser.parse - 改行を含む'M10 20\\nL30 40'を渡す - 正しくパースされる", () => {
  // Act
  const result = PathParser.parse("M10 20\nL30 40");

  // Assert
  expect(result).toHaveLength(2);
});

test("PathParser.parse - タブを含む'M10\\t20\\tL30\\t40'を渡す - 正しくパースされる", () => {
  // Act
  const result = PathParser.parse("M10\t20\tL30\t40");

  // Assert
  expect(result).toHaveLength(2);
});
