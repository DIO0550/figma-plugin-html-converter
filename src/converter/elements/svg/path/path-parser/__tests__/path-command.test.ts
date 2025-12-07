import { test, expect } from "vitest";
import {
  PathCommand,
  MoveToCommand,
  LineToCommand,
  HorizontalLineToCommand,
  VerticalLineToCommand,
  CubicBezierCommand,
  QuadraticBezierCommand,
  ArcCommand,
  ClosePathCommand,
} from "../path-command";

// MoveToCommand
test("MoveToCommand.create - 絶対座標を指定 - type='M'、x=10、y=20、relative=falseのMoveToCommandを返す", () => {
  // Arrange
  const x = 10;
  const y = 20;
  const isRelative = false;

  // Act
  const command = MoveToCommand.create(x, y, isRelative);

  // Assert
  expect(command.type).toBe("M");
  expect(command.x).toBe(10);
  expect(command.y).toBe(20);
  expect(command.relative).toBe(false);
});

test("MoveToCommand.create - 相対座標を指定 - relative=trueのMoveToCommandを返す", () => {
  // Arrange
  const x = 10;
  const y = 20;
  const isRelative = true;

  // Act
  const command = MoveToCommand.create(x, y, isRelative);

  // Assert
  expect(command.type).toBe("M");
  expect(command.relative).toBe(true);
});

test("MoveToCommand.isMoveToCommand - 正常なMoveToCommandを渡す - trueを返す", () => {
  // Arrange
  const command = MoveToCommand.create(10, 20, false);

  // Act
  const result = MoveToCommand.isMoveToCommand(command);

  // Assert
  expect(result).toBe(true);
});

test("MoveToCommand.isMoveToCommand - LineToCommandを渡す - falseを返す", () => {
  // Arrange
  const command = LineToCommand.create(10, 20, false);

  // Act
  const result = MoveToCommand.isMoveToCommand(command);

  // Assert
  expect(result).toBe(false);
});

// LineToCommand
test("LineToCommand.create - 絶対座標を指定 - type='L'、x=30、y=40、relative=falseのLineToCommandを返す", () => {
  // Arrange
  const x = 30;
  const y = 40;
  const isRelative = false;

  // Act
  const command = LineToCommand.create(x, y, isRelative);

  // Assert
  expect(command.type).toBe("L");
  expect(command.x).toBe(30);
  expect(command.y).toBe(40);
  expect(command.relative).toBe(false);
});

test("LineToCommand.isLineToCommand - 正常なLineToCommandを渡す - trueを返す", () => {
  // Arrange
  const command = LineToCommand.create(30, 40, false);

  // Act
  const result = LineToCommand.isLineToCommand(command);

  // Assert
  expect(result).toBe(true);
});

// HorizontalLineToCommand
test("HorizontalLineToCommand.create - 絶対座標を指定 - type='H'、x=50、relative=falseのHorizontalLineToCommandを返す", () => {
  // Arrange
  const x = 50;
  const isRelative = false;

  // Act
  const command = HorizontalLineToCommand.create(x, isRelative);

  // Assert
  expect(command.type).toBe("H");
  expect(command.x).toBe(50);
  expect(command.relative).toBe(false);
});

test("HorizontalLineToCommand.isHorizontalLineToCommand - 正常なHorizontalLineToCommandを渡す - trueを返す", () => {
  // Arrange
  const command = HorizontalLineToCommand.create(50, false);

  // Act
  const result = HorizontalLineToCommand.isHorizontalLineToCommand(command);

  // Assert
  expect(result).toBe(true);
});

// VerticalLineToCommand
test("VerticalLineToCommand.create - 絶対座標を指定 - type='V'、y=60、relative=falseのVerticalLineToCommandを返す", () => {
  // Arrange
  const y = 60;
  const isRelative = false;

  // Act
  const command = VerticalLineToCommand.create(y, isRelative);

  // Assert
  expect(command.type).toBe("V");
  expect(command.y).toBe(60);
  expect(command.relative).toBe(false);
});

test("VerticalLineToCommand.isVerticalLineToCommand - 正常なVerticalLineToCommandを渡す - trueを返す", () => {
  // Arrange
  const command = VerticalLineToCommand.create(60, false);

  // Act
  const result = VerticalLineToCommand.isVerticalLineToCommand(command);

  // Assert
  expect(result).toBe(true);
});

// CubicBezierCommand
test("CubicBezierCommand.create - 絶対座標を指定 - 全座標が設定されたCubicBezierCommandを返す", () => {
  // Arrange
  const x1 = 10;
  const y1 = 20;
  const x2 = 30;
  const y2 = 40;
  const x = 50;
  const y = 60;
  const isRelative = false;

  // Act
  const command = CubicBezierCommand.create(x1, y1, x2, y2, x, y, isRelative);

  // Assert
  expect(command.type).toBe("C");
  expect(command.x1).toBe(10);
  expect(command.y1).toBe(20);
  expect(command.x2).toBe(30);
  expect(command.y2).toBe(40);
  expect(command.x).toBe(50);
  expect(command.y).toBe(60);
  expect(command.relative).toBe(false);
});

test("CubicBezierCommand.isCubicBezierCommand - 正常なCubicBezierCommandを渡す - trueを返す", () => {
  // Arrange
  const command = CubicBezierCommand.create(10, 20, 30, 40, 50, 60, false);

  // Act
  const result = CubicBezierCommand.isCubicBezierCommand(command);

  // Assert
  expect(result).toBe(true);
});

// QuadraticBezierCommand
test("QuadraticBezierCommand.create - 絶対座標を指定 - 全座標が設定されたQuadraticBezierCommandを返す", () => {
  // Arrange
  const x1 = 10;
  const y1 = 20;
  const x = 30;
  const y = 40;
  const isRelative = false;

  // Act
  const command = QuadraticBezierCommand.create(x1, y1, x, y, isRelative);

  // Assert
  expect(command.type).toBe("Q");
  expect(command.x1).toBe(10);
  expect(command.y1).toBe(20);
  expect(command.x).toBe(30);
  expect(command.y).toBe(40);
  expect(command.relative).toBe(false);
});

test("QuadraticBezierCommand.isQuadraticBezierCommand - 正常なQuadraticBezierCommandを渡す - trueを返す", () => {
  // Arrange
  const command = QuadraticBezierCommand.create(10, 20, 30, 40, false);

  // Act
  const result = QuadraticBezierCommand.isQuadraticBezierCommand(command);

  // Assert
  expect(result).toBe(true);
});

// ArcCommand
test("ArcCommand.create - 絶対座標を指定 - 全パラメータが設定されたArcCommandを返す", () => {
  // Arrange
  const rx = 10;
  const ry = 20;
  const xAxisRotation = 45;
  const largeArcFlag = true;
  const sweepFlag = false;
  const x = 30;
  const y = 40;
  const isRelative = false;

  // Act
  const command = ArcCommand.create(
    rx,
    ry,
    xAxisRotation,
    largeArcFlag,
    sweepFlag,
    x,
    y,
    isRelative,
  );

  // Assert
  expect(command.type).toBe("A");
  expect(command.rx).toBe(10);
  expect(command.ry).toBe(20);
  expect(command.xAxisRotation).toBe(45);
  expect(command.largeArcFlag).toBe(true);
  expect(command.sweepFlag).toBe(false);
  expect(command.x).toBe(30);
  expect(command.y).toBe(40);
  expect(command.relative).toBe(false);
});

test("ArcCommand.isArcCommand - 正常なArcCommandを渡す - trueを返す", () => {
  // Arrange
  const command = ArcCommand.create(10, 20, 45, true, false, 30, 40, false);

  // Act
  const result = ArcCommand.isArcCommand(command);

  // Assert
  expect(result).toBe(true);
});

// ClosePathCommand
test("ClosePathCommand.create - 引数なし - type='Z'のClosePathCommandを返す", () => {
  // Act
  const command = ClosePathCommand.create();

  // Assert
  expect(command.type).toBe("Z");
});

test("ClosePathCommand.isClosePathCommand - 正常なClosePathCommandを渡す - trueを返す", () => {
  // Arrange
  const command = ClosePathCommand.create();

  // Act
  const result = ClosePathCommand.isClosePathCommand(command);

  // Assert
  expect(result).toBe(true);
});

// PathCommand型ガード
test("PathCommand.isPathCommand - 各種コマンドタイプを渡す - 全てtrueを返す", () => {
  // Assert
  expect(PathCommand.isPathCommand(MoveToCommand.create(0, 0, false))).toBe(
    true,
  );
  expect(PathCommand.isPathCommand(LineToCommand.create(0, 0, false))).toBe(
    true,
  );
  expect(
    PathCommand.isPathCommand(HorizontalLineToCommand.create(0, false)),
  ).toBe(true);
  expect(
    PathCommand.isPathCommand(VerticalLineToCommand.create(0, false)),
  ).toBe(true);
  expect(
    PathCommand.isPathCommand(
      CubicBezierCommand.create(0, 0, 0, 0, 0, 0, false),
    ),
  ).toBe(true);
  expect(
    PathCommand.isPathCommand(QuadraticBezierCommand.create(0, 0, 0, 0, false)),
  ).toBe(true);
  expect(
    PathCommand.isPathCommand(
      ArcCommand.create(0, 0, 0, false, false, 0, 0, false),
    ),
  ).toBe(true);
  expect(PathCommand.isPathCommand(ClosePathCommand.create())).toBe(true);
});

test("PathCommand.isPathCommand - nullを渡す - falseを返す", () => {
  // Act & Assert
  expect(PathCommand.isPathCommand(null)).toBe(false);
});

test("PathCommand.isPathCommand - undefinedを渡す - falseを返す", () => {
  // Act & Assert
  expect(PathCommand.isPathCommand(undefined)).toBe(false);
});

test("PathCommand.isPathCommand - 空オブジェクトを渡す - falseを返す", () => {
  // Act & Assert
  expect(PathCommand.isPathCommand({})).toBe(false);
});

test("PathCommand.isPathCommand - 無効なtypeを持つオブジェクトを渡す - falseを返す", () => {
  // Arrange
  const invalidCommand = { type: "X" };

  // Act & Assert
  expect(PathCommand.isPathCommand(invalidCommand)).toBe(false);
});
