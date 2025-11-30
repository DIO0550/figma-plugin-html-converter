import { describe, test, expect } from "vitest";
import { SvgCoordinateUtils } from "../svg-coordinate-utils";

describe("SvgCoordinateUtils", () => {
  describe("parseNumericAttribute", () => {
    test("数値文字列をパースする", () => {
      expect(SvgCoordinateUtils.parseNumericAttribute("100")).toBe(100);
    });

    test("小数点を含む数値文字列をパースする", () => {
      expect(SvgCoordinateUtils.parseNumericAttribute("50.5")).toBe(50.5);
    });

    test("負の数値をパースする", () => {
      expect(SvgCoordinateUtils.parseNumericAttribute("-25")).toBe(-25);
    });

    test("単位付きの値から数値を抽出する", () => {
      expect(SvgCoordinateUtils.parseNumericAttribute("100px")).toBe(100);
    });

    test("数値型の値をそのまま返す", () => {
      expect(SvgCoordinateUtils.parseNumericAttribute(75)).toBe(75);
    });

    test("undefinedの場合デフォルト値を返す", () => {
      expect(SvgCoordinateUtils.parseNumericAttribute(undefined, 0)).toBe(0);
    });

    test("無効な文字列の場合デフォルト値を返す", () => {
      expect(SvgCoordinateUtils.parseNumericAttribute("invalid", 0)).toBe(0);
    });

    test("空文字列の場合デフォルト値を返す", () => {
      expect(SvgCoordinateUtils.parseNumericAttribute("", 10)).toBe(10);
    });
  });

  describe("calculateCircleBounds", () => {
    test("円の境界ボックスを計算する", () => {
      const bounds = SvgCoordinateUtils.calculateCircleBounds(50, 50, 25);

      expect(bounds.x).toBe(25);
      expect(bounds.y).toBe(25);
      expect(bounds.width).toBe(50);
      expect(bounds.height).toBe(50);
    });

    test("原点にある円の境界ボックスを計算する", () => {
      const bounds = SvgCoordinateUtils.calculateCircleBounds(0, 0, 10);

      expect(bounds.x).toBe(-10);
      expect(bounds.y).toBe(-10);
      expect(bounds.width).toBe(20);
      expect(bounds.height).toBe(20);
    });
  });

  describe("calculateEllipseBounds", () => {
    test("楕円の境界ボックスを計算する", () => {
      const bounds = SvgCoordinateUtils.calculateEllipseBounds(100, 50, 40, 20);

      expect(bounds.x).toBe(60);
      expect(bounds.y).toBe(30);
      expect(bounds.width).toBe(80);
      expect(bounds.height).toBe(40);
    });
  });

  describe("calculateLineBounds", () => {
    test("直線の境界ボックスを計算する", () => {
      const bounds = SvgCoordinateUtils.calculateLineBounds(10, 20, 100, 80);

      expect(bounds.x).toBe(10);
      expect(bounds.y).toBe(20);
      expect(bounds.width).toBe(90);
      expect(bounds.height).toBe(60);
    });

    test("逆方向の直線の境界ボックスを計算する", () => {
      const bounds = SvgCoordinateUtils.calculateLineBounds(100, 80, 10, 20);

      expect(bounds.x).toBe(10);
      expect(bounds.y).toBe(20);
      expect(bounds.width).toBe(90);
      expect(bounds.height).toBe(60);
    });

    test("水平線の境界ボックスを計算する", () => {
      const bounds = SvgCoordinateUtils.calculateLineBounds(0, 50, 100, 50);

      expect(bounds.x).toBe(0);
      expect(bounds.y).toBe(50);
      expect(bounds.width).toBe(100);
      expect(bounds.height).toBe(0);
    });

    test("垂直線の境界ボックスを計算する", () => {
      const bounds = SvgCoordinateUtils.calculateLineBounds(50, 0, 50, 100);

      expect(bounds.x).toBe(50);
      expect(bounds.y).toBe(0);
      expect(bounds.width).toBe(0);
      expect(bounds.height).toBe(100);
    });
  });

  describe("calculateRectBounds", () => {
    test("矩形の境界ボックスを計算する", () => {
      const bounds = SvgCoordinateUtils.calculateRectBounds(10, 20, 100, 50);

      expect(bounds.x).toBe(10);
      expect(bounds.y).toBe(20);
      expect(bounds.width).toBe(100);
      expect(bounds.height).toBe(50);
    });
  });
});
