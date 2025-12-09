import { describe, test, expect } from "vitest";
import { SvgTransformUtils, TransformCommand } from "../svg-transform-utils";

describe("SvgTransformUtils", () => {
  describe("parseTransform", () => {
    test("空文字列の場合、空配列を返す", () => {
      const result = SvgTransformUtils.parseTransform("");
      expect(result).toEqual([]);
    });

    test("undefinedの場合、空配列を返す", () => {
      const result = SvgTransformUtils.parseTransform(undefined);
      expect(result).toEqual([]);
    });

    describe("translate", () => {
      test("translate(tx, ty)を解析する", () => {
        const result = SvgTransformUtils.parseTransform("translate(10, 20)");
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
          type: "translate",
          tx: 10,
          ty: 20,
        });
      });

      test("translate(tx)を解析する（tyは0）", () => {
        const result = SvgTransformUtils.parseTransform("translate(50)");
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
          type: "translate",
          tx: 50,
          ty: 0,
        });
      });

      test("負の値を解析する", () => {
        const result = SvgTransformUtils.parseTransform("translate(-10, -20)");
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
          type: "translate",
          tx: -10,
          ty: -20,
        });
      });

      test("小数点を含む値を解析する", () => {
        const result = SvgTransformUtils.parseTransform(
          "translate(10.5, 20.75)",
        );
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
          type: "translate",
          tx: 10.5,
          ty: 20.75,
        });
      });
    });

    describe("rotate", () => {
      test("rotate(angle)を解析する", () => {
        const result = SvgTransformUtils.parseTransform("rotate(45)");
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
          type: "rotate",
          angle: 45,
          cx: 0,
          cy: 0,
        });
      });

      test("rotate(angle, cx, cy)を解析する", () => {
        const result = SvgTransformUtils.parseTransform("rotate(90, 50, 50)");
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
          type: "rotate",
          angle: 90,
          cx: 50,
          cy: 50,
        });
      });

      test("負の角度を解析する", () => {
        const result = SvgTransformUtils.parseTransform("rotate(-30)");
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
          type: "rotate",
          angle: -30,
          cx: 0,
          cy: 0,
        });
      });
    });

    describe("scale", () => {
      test("scale(s)を解析する（sx = sy）", () => {
        const result = SvgTransformUtils.parseTransform("scale(2)");
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
          type: "scale",
          sx: 2,
          sy: 2,
        });
      });

      test("scale(sx, sy)を解析する", () => {
        const result = SvgTransformUtils.parseTransform("scale(2, 3)");
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
          type: "scale",
          sx: 2,
          sy: 3,
        });
      });

      test("小数のスケールを解析する", () => {
        const result = SvgTransformUtils.parseTransform("scale(0.5)");
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
          type: "scale",
          sx: 0.5,
          sy: 0.5,
        });
      });
    });

    describe("skewX", () => {
      test("skewX(angle)を解析する", () => {
        const result = SvgTransformUtils.parseTransform("skewX(30)");
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
          type: "skewX",
          angle: 30,
        });
      });
    });

    describe("skewY", () => {
      test("skewY(angle)を解析する", () => {
        const result = SvgTransformUtils.parseTransform("skewY(45)");
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
          type: "skewY",
          angle: 45,
        });
      });
    });

    describe("matrix", () => {
      test("matrix(a, b, c, d, e, f)を解析する", () => {
        const result = SvgTransformUtils.parseTransform(
          "matrix(1, 0, 0, 1, 10, 20)",
        );
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
    });

    describe("複数の変換", () => {
      test("複数の変換を解析する（スペース区切り）", () => {
        const result = SvgTransformUtils.parseTransform(
          "translate(10, 20) rotate(45)",
        );
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

      test("複数の変換を解析する（カンマ区切り）", () => {
        const result = SvgTransformUtils.parseTransform(
          "scale(2), translate(50, 50)",
        );
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
    });
  });

  describe("calculateTransformedBounds", () => {
    test("translateを適用する", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 50 };
      const commands: TransformCommand[] = [
        { type: "translate", tx: 10, ty: 20 },
      ];

      const result = SvgTransformUtils.calculateTransformedBounds(
        bounds,
        commands,
      );

      expect(result.x).toBe(10);
      expect(result.y).toBe(20);
      expect(result.width).toBe(100);
      expect(result.height).toBe(50);
    });

    test("scaleを適用する", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 50 };
      const commands: TransformCommand[] = [{ type: "scale", sx: 2, sy: 2 }];

      const result = SvgTransformUtils.calculateTransformedBounds(
        bounds,
        commands,
      );

      expect(result.width).toBe(200);
      expect(result.height).toBe(100);
    });

    test("translate + scaleを順番に適用する", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 50 };
      const commands: TransformCommand[] = [
        { type: "translate", tx: 10, ty: 20 },
        { type: "scale", sx: 2, sy: 2 },
      ];

      const result = SvgTransformUtils.calculateTransformedBounds(
        bounds,
        commands,
      );

      expect(result.x).toBe(20);
      expect(result.y).toBe(40);
      expect(result.width).toBe(200);
      expect(result.height).toBe(100);
    });

    test("変換がない場合、元の境界を返す", () => {
      const bounds = { x: 10, y: 20, width: 100, height: 50 };
      const commands: TransformCommand[] = [];

      const result = SvgTransformUtils.calculateTransformedBounds(
        bounds,
        commands,
      );

      expect(result).toEqual(bounds);
    });
  });

  describe("extractTranslation", () => {
    test("translateコマンドから移動量を抽出する", () => {
      const commands: TransformCommand[] = [
        { type: "translate", tx: 10, ty: 20 },
      ];

      const result = SvgTransformUtils.extractTranslation(commands);

      expect(result).toEqual({ x: 10, y: 20 });
    });

    test("複数のtranslateを合算する", () => {
      const commands: TransformCommand[] = [
        { type: "translate", tx: 10, ty: 20 },
        { type: "translate", tx: 5, ty: 10 },
      ];

      const result = SvgTransformUtils.extractTranslation(commands);

      expect(result).toEqual({ x: 15, y: 30 });
    });

    test("translateがない場合、0を返す", () => {
      const commands: TransformCommand[] = [{ type: "scale", sx: 2, sy: 2 }];

      const result = SvgTransformUtils.extractTranslation(commands);

      expect(result).toEqual({ x: 0, y: 0 });
    });

    test("空配列の場合、0を返す", () => {
      const result = SvgTransformUtils.extractTranslation([]);

      expect(result).toEqual({ x: 0, y: 0 });
    });
  });
});
