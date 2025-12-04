import { describe, test, expect } from "vitest";
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

describe("PathParser", () => {
  describe("parse - 基本コマンド", () => {
    test("空文字列 - 空配列を返す", () => {
      const result = PathParser.parse("");
      expect(result).toEqual([]);
    });

    test("MoveTo絶対座標 - MoveToCommandを返す", () => {
      const result = PathParser.parse("M10 20");
      expect(result).toHaveLength(1);
      expect(MoveToCommand.isMoveToCommand(result[0])).toBe(true);
      expect(result[0]).toMatchObject({
        type: "M",
        x: 10,
        y: 20,
        relative: false,
      });
    });

    test("MoveTo相対座標 - relativeがtrueのMoveToCommandを返す", () => {
      const result = PathParser.parse("m10 20");
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        type: "M",
        x: 10,
        y: 20,
        relative: true,
      });
    });

    test("LineTo絶対座標 - LineToCommandを返す", () => {
      const result = PathParser.parse("M0 0 L30 40");
      expect(result).toHaveLength(2);
      expect(LineToCommand.isLineToCommand(result[1])).toBe(true);
      expect(result[1]).toMatchObject({
        type: "L",
        x: 30,
        y: 40,
        relative: false,
      });
    });

    test("LineTo相対座標 - relativeがtrueのLineToCommandを返す", () => {
      const result = PathParser.parse("M0 0 l30 40");
      expect(result).toHaveLength(2);
      expect(result[1]).toMatchObject({
        type: "L",
        x: 30,
        y: 40,
        relative: true,
      });
    });

    test("HorizontalLineTo絶対座標 - HorizontalLineToCommandを返す", () => {
      const result = PathParser.parse("M0 0 H50");
      expect(result).toHaveLength(2);
      expect(HorizontalLineToCommand.isHorizontalLineToCommand(result[1])).toBe(
        true,
      );
      expect(result[1]).toMatchObject({ type: "H", x: 50, relative: false });
    });

    test("HorizontalLineTo相対座標 - relativeがtrueを返す", () => {
      const result = PathParser.parse("M0 0 h50");
      expect(result).toHaveLength(2);
      expect(result[1]).toMatchObject({ type: "H", x: 50, relative: true });
    });

    test("VerticalLineTo絶対座標 - VerticalLineToCommandを返す", () => {
      const result = PathParser.parse("M0 0 V60");
      expect(result).toHaveLength(2);
      expect(VerticalLineToCommand.isVerticalLineToCommand(result[1])).toBe(
        true,
      );
      expect(result[1]).toMatchObject({ type: "V", y: 60, relative: false });
    });

    test("VerticalLineTo相対座標 - relativeがtrueを返す", () => {
      const result = PathParser.parse("M0 0 v60");
      expect(result).toHaveLength(2);
      expect(result[1]).toMatchObject({ type: "V", y: 60, relative: true });
    });

    test("ClosePath - ClosePathCommandを返す", () => {
      const result = PathParser.parse("M0 0 L10 10 Z");
      expect(result).toHaveLength(3);
      expect(ClosePathCommand.isClosePathCommand(result[2])).toBe(true);
      expect(result[2]).toMatchObject({ type: "Z" });
    });

    test("ClosePath小文字 - ClosePathCommandを返す", () => {
      const result = PathParser.parse("M0 0 L10 10 z");
      expect(result).toHaveLength(3);
      expect(ClosePathCommand.isClosePathCommand(result[2])).toBe(true);
    });
  });

  describe("parse - 曲線コマンド", () => {
    test("CubicBezier絶対座標 - CubicBezierCommandを返す", () => {
      const result = PathParser.parse("M0 0 C10 20 30 40 50 60");
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

    test("CubicBezier相対座標 - relativeがtrueを返す", () => {
      const result = PathParser.parse("M0 0 c10 20 30 40 50 60");
      expect(result).toHaveLength(2);
      expect(result[1]).toMatchObject({ type: "C", relative: true });
    });

    test("SmoothCubicBezier絶対座標 - SmoothCubicBezierCommandを返す", () => {
      const result = PathParser.parse("M0 0 S30 40 50 60");
      expect(result).toHaveLength(2);
      expect(
        SmoothCubicBezierCommand.isSmoothCubicBezierCommand(result[1]),
      ).toBe(true);
      expect(result[1]).toMatchObject({
        type: "S",
        x2: 30,
        y2: 40,
        x: 50,
        y: 60,
        relative: false,
      });
    });

    test("SmoothCubicBezier相対座標 - relativeがtrueを返す", () => {
      const result = PathParser.parse("M0 0 s30 40 50 60");
      expect(result).toHaveLength(2);
      expect(result[1]).toMatchObject({ type: "S", relative: true });
    });

    test("QuadraticBezier絶対座標 - QuadraticBezierCommandを返す", () => {
      const result = PathParser.parse("M0 0 Q10 20 30 40");
      expect(result).toHaveLength(2);
      expect(QuadraticBezierCommand.isQuadraticBezierCommand(result[1])).toBe(
        true,
      );
      expect(result[1]).toMatchObject({
        type: "Q",
        x1: 10,
        y1: 20,
        x: 30,
        y: 40,
        relative: false,
      });
    });

    test("QuadraticBezier相対座標 - relativeがtrueを返す", () => {
      const result = PathParser.parse("M0 0 q10 20 30 40");
      expect(result).toHaveLength(2);
      expect(result[1]).toMatchObject({ type: "Q", relative: true });
    });

    test("SmoothQuadraticBezier絶対座標 - SmoothQuadraticBezierCommandを返す", () => {
      const result = PathParser.parse("M0 0 T30 40");
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

    test("SmoothQuadraticBezier相対座標 - relativeがtrueを返す", () => {
      const result = PathParser.parse("M0 0 t30 40");
      expect(result).toHaveLength(2);
      expect(result[1]).toMatchObject({ type: "T", relative: true });
    });
  });

  describe("parse - 円弧コマンド", () => {
    test("Arc絶対座標 - ArcCommandを返す", () => {
      const result = PathParser.parse("M0 0 A10 20 45 1 0 30 40");
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

    test("Arc相対座標 - relativeがtrueを返す", () => {
      const result = PathParser.parse("M0 0 a10 20 45 0 1 30 40");
      expect(result).toHaveLength(2);
      expect(result[1]).toMatchObject({
        type: "A",
        largeArcFlag: false,
        sweepFlag: true,
        relative: true,
      });
    });
  });

  describe("parse - 複合パス", () => {
    test("三角形パス - 正しくパースする", () => {
      const result = PathParser.parse("M0 0 L50 100 L100 0 Z");
      expect(result).toHaveLength(4);
      expect(MoveToCommand.isMoveToCommand(result[0])).toBe(true);
      expect(LineToCommand.isLineToCommand(result[1])).toBe(true);
      expect(LineToCommand.isLineToCommand(result[2])).toBe(true);
      expect(ClosePathCommand.isClosePathCommand(result[3])).toBe(true);
    });

    test("四角形パス - 正しくパースする", () => {
      const result = PathParser.parse("M0 0 H100 V100 H0 Z");
      expect(result).toHaveLength(5);
    });

    test("カンマ区切り - 正しくパースする", () => {
      const result = PathParser.parse("M10,20 L30,40");
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ x: 10, y: 20 });
      expect(result[1]).toMatchObject({ x: 30, y: 40 });
    });

    test("連続した座標 - 暗黙的なLineToとしてパースする", () => {
      const result = PathParser.parse("M0 0 10 20 30 40");
      expect(result).toHaveLength(3);
      expect(MoveToCommand.isMoveToCommand(result[0])).toBe(true);
      expect(LineToCommand.isLineToCommand(result[1])).toBe(true);
      expect(LineToCommand.isLineToCommand(result[2])).toBe(true);
    });

    test("負の値 - 正しくパースする", () => {
      const result = PathParser.parse("M-10 -20 L-30 -40");
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ x: -10, y: -20 });
      expect(result[1]).toMatchObject({ x: -30, y: -40 });
    });

    test("小数点 - 正しくパースする", () => {
      const result = PathParser.parse("M10.5 20.5 L30.5 40.5");
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ x: 10.5, y: 20.5 });
      expect(result[1]).toMatchObject({ x: 30.5, y: 40.5 });
    });

    test("指数表記 - 正しくパースする", () => {
      const result = PathParser.parse("M1e2 2e-1");
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ x: 100, y: 0.2 });
    });
  });

  describe("parse - エッジケース", () => {
    test("空白のみ - 空配列を返す", () => {
      const result = PathParser.parse("   ");
      expect(result).toEqual([]);
    });

    test("複数の空白 - 正しくパースする", () => {
      const result = PathParser.parse("M  10   20   L  30   40");
      expect(result).toHaveLength(2);
    });

    test("改行を含む - 正しくパースする", () => {
      const result = PathParser.parse("M10 20\nL30 40");
      expect(result).toHaveLength(2);
    });

    test("タブを含む - 正しくパースする", () => {
      const result = PathParser.parse("M10\t20\tL30\t40");
      expect(result).toHaveLength(2);
    });
  });
});
