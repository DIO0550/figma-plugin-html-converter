import { describe, test, expect } from "vitest";
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

describe("PathCommand", () => {
  describe("MoveToCommand", () => {
    test("MoveToCommand.create - 絶対座標 - MoveToCommandを作成する", () => {
      const command = MoveToCommand.create(10, 20, false);
      expect(command.type).toBe("M");
      expect(command.x).toBe(10);
      expect(command.y).toBe(20);
      expect(command.relative).toBe(false);
    });

    test("MoveToCommand.create - 相対座標 - relativeがtrueのMoveToCommandを作成する", () => {
      const command = MoveToCommand.create(10, 20, true);
      expect(command.type).toBe("M");
      expect(command.relative).toBe(true);
    });

    test("MoveToCommand.isMoveToCommand - 正常なMoveToCommand - trueを返す", () => {
      const command = MoveToCommand.create(10, 20, false);
      expect(MoveToCommand.isMoveToCommand(command)).toBe(true);
    });

    test("MoveToCommand.isMoveToCommand - 異なるコマンド - falseを返す", () => {
      const command = LineToCommand.create(10, 20, false);
      expect(MoveToCommand.isMoveToCommand(command)).toBe(false);
    });
  });

  describe("LineToCommand", () => {
    test("LineToCommand.create - 絶対座標 - LineToCommandを作成する", () => {
      const command = LineToCommand.create(30, 40, false);
      expect(command.type).toBe("L");
      expect(command.x).toBe(30);
      expect(command.y).toBe(40);
      expect(command.relative).toBe(false);
    });

    test("LineToCommand.isLineToCommand - 正常なLineToCommand - trueを返す", () => {
      const command = LineToCommand.create(30, 40, false);
      expect(LineToCommand.isLineToCommand(command)).toBe(true);
    });
  });

  describe("HorizontalLineToCommand", () => {
    test("HorizontalLineToCommand.create - 絶対座標 - HorizontalLineToCommandを作成する", () => {
      const command = HorizontalLineToCommand.create(50, false);
      expect(command.type).toBe("H");
      expect(command.x).toBe(50);
      expect(command.relative).toBe(false);
    });

    test("HorizontalLineToCommand.isHorizontalLineToCommand - 正常なコマンド - trueを返す", () => {
      const command = HorizontalLineToCommand.create(50, false);
      expect(HorizontalLineToCommand.isHorizontalLineToCommand(command)).toBe(
        true,
      );
    });
  });

  describe("VerticalLineToCommand", () => {
    test("VerticalLineToCommand.create - 絶対座標 - VerticalLineToCommandを作成する", () => {
      const command = VerticalLineToCommand.create(60, false);
      expect(command.type).toBe("V");
      expect(command.y).toBe(60);
      expect(command.relative).toBe(false);
    });

    test("VerticalLineToCommand.isVerticalLineToCommand - 正常なコマンド - trueを返す", () => {
      const command = VerticalLineToCommand.create(60, false);
      expect(VerticalLineToCommand.isVerticalLineToCommand(command)).toBe(true);
    });
  });

  describe("CubicBezierCommand", () => {
    test("CubicBezierCommand.create - 絶対座標 - CubicBezierCommandを作成する", () => {
      const command = CubicBezierCommand.create(10, 20, 30, 40, 50, 60, false);
      expect(command.type).toBe("C");
      expect(command.x1).toBe(10);
      expect(command.y1).toBe(20);
      expect(command.x2).toBe(30);
      expect(command.y2).toBe(40);
      expect(command.x).toBe(50);
      expect(command.y).toBe(60);
      expect(command.relative).toBe(false);
    });

    test("CubicBezierCommand.isCubicBezierCommand - 正常なコマンド - trueを返す", () => {
      const command = CubicBezierCommand.create(10, 20, 30, 40, 50, 60, false);
      expect(CubicBezierCommand.isCubicBezierCommand(command)).toBe(true);
    });
  });

  describe("QuadraticBezierCommand", () => {
    test("QuadraticBezierCommand.create - 絶対座標 - QuadraticBezierCommandを作成する", () => {
      const command = QuadraticBezierCommand.create(10, 20, 30, 40, false);
      expect(command.type).toBe("Q");
      expect(command.x1).toBe(10);
      expect(command.y1).toBe(20);
      expect(command.x).toBe(30);
      expect(command.y).toBe(40);
      expect(command.relative).toBe(false);
    });

    test("QuadraticBezierCommand.isQuadraticBezierCommand - 正常なコマンド - trueを返す", () => {
      const command = QuadraticBezierCommand.create(10, 20, 30, 40, false);
      expect(QuadraticBezierCommand.isQuadraticBezierCommand(command)).toBe(
        true,
      );
    });
  });

  describe("ArcCommand", () => {
    test("ArcCommand.create - 絶対座標 - ArcCommandを作成する", () => {
      const command = ArcCommand.create(10, 20, 45, true, false, 30, 40, false);
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

    test("ArcCommand.isArcCommand - 正常なコマンド - trueを返す", () => {
      const command = ArcCommand.create(10, 20, 45, true, false, 30, 40, false);
      expect(ArcCommand.isArcCommand(command)).toBe(true);
    });
  });

  describe("ClosePathCommand", () => {
    test("ClosePathCommand.create - ClosePathCommandを作成する", () => {
      const command = ClosePathCommand.create();
      expect(command.type).toBe("Z");
    });

    test("ClosePathCommand.isClosePathCommand - 正常なコマンド - trueを返す", () => {
      const command = ClosePathCommand.create();
      expect(ClosePathCommand.isClosePathCommand(command)).toBe(true);
    });
  });

  describe("PathCommand型ガード", () => {
    test("PathCommand.isPathCommand - 各コマンドタイプ - trueを返す", () => {
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
        PathCommand.isPathCommand(
          QuadraticBezierCommand.create(0, 0, 0, 0, false),
        ),
      ).toBe(true);
      expect(
        PathCommand.isPathCommand(
          ArcCommand.create(0, 0, 0, false, false, 0, 0, false),
        ),
      ).toBe(true);
      expect(PathCommand.isPathCommand(ClosePathCommand.create())).toBe(true);
    });

    test("PathCommand.isPathCommand - 無効なオブジェクト - falseを返す", () => {
      expect(PathCommand.isPathCommand(null)).toBe(false);
      expect(PathCommand.isPathCommand(undefined)).toBe(false);
      expect(PathCommand.isPathCommand({})).toBe(false);
      expect(PathCommand.isPathCommand({ type: "X" })).toBe(false);
    });
  });
});
