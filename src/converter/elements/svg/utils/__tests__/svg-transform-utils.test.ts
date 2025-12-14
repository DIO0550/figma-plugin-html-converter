import { test, expect, describe } from "vitest";
import { SvgTransformUtils, TransformCommand } from "../svg-transform-utils";

describe("SvgTransformUtils.parseTransform", () => {
  describe("無効な入力", () => {
    test("空文字列 - 空配列を返す", () => {
      const input = "";
      const result = SvgTransformUtils.parseTransform(input);
      expect(result).toEqual([]);
    });

    test("undefined - 空配列を返す", () => {
      const input = undefined;
      const result = SvgTransformUtils.parseTransform(input);
      expect(result).toEqual([]);
    });
  });

  describe("translate", () => {
    test("translate(10, 20) - tx=10, ty=20のtranslateコマンドを返す", () => {
      const input = "translate(10, 20)";
      const result = SvgTransformUtils.parseTransform(input);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        type: "translate",
        tx: 10,
        ty: 20,
      });
    });

    test("translate(50) - tx=50, ty=0のtranslateコマンドを返す", () => {
      const input = "translate(50)";
      const result = SvgTransformUtils.parseTransform(input);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        type: "translate",
        tx: 50,
        ty: 0,
      });
    });

    test("translate(-10, -20) - 負の値を正しく解析する", () => {
      const input = "translate(-10, -20)";
      const result = SvgTransformUtils.parseTransform(input);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        type: "translate",
        tx: -10,
        ty: -20,
      });
    });

    test("translate(10.5, 20.75) - 小数点を含む値を正しく解析する", () => {
      const input = "translate(10.5, 20.75)";
      const result = SvgTransformUtils.parseTransform(input);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        type: "translate",
        tx: 10.5,
        ty: 20.75,
      });
    });

    test("translate(0, 0) - ゼロ値の移動を正しく解析する", () => {
      const input = "translate(0, 0)";
      const result = SvgTransformUtils.parseTransform(input);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        type: "translate",
        tx: 0,
        ty: 0,
      });
    });
  });

  describe("rotate", () => {
    test("rotate(45) - angle=45, cx=0, cy=0のrotateコマンドを返す", () => {
      const input = "rotate(45)";
      const result = SvgTransformUtils.parseTransform(input);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        type: "rotate",
        angle: 45,
        cx: 0,
        cy: 0,
      });
    });

    test("rotate(90, 50, 50) - angle=90, cx=50, cy=50のrotateコマンドを返す", () => {
      const input = "rotate(90, 50, 50)";
      const result = SvgTransformUtils.parseTransform(input);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        type: "rotate",
        angle: 90,
        cx: 50,
        cy: 50,
      });
    });

    test("rotate(-30) - 負の角度を正しく解析する", () => {
      const input = "rotate(-30)";
      const result = SvgTransformUtils.parseTransform(input);
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
    test("scale(2) - sx=2, sy=2のscaleコマンドを返す", () => {
      const input = "scale(2)";
      const result = SvgTransformUtils.parseTransform(input);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        type: "scale",
        sx: 2,
        sy: 2,
      });
    });

    test("scale(2, 3) - sx=2, sy=3のscaleコマンドを返す", () => {
      const input = "scale(2, 3)";
      const result = SvgTransformUtils.parseTransform(input);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        type: "scale",
        sx: 2,
        sy: 3,
      });
    });

    test("scale(0.5) - 小数のスケールを正しく解析する", () => {
      const input = "scale(0.5)";
      const result = SvgTransformUtils.parseTransform(input);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        type: "scale",
        sx: 0.5,
        sy: 0.5,
      });
    });

    test("scale(-1, 1) - 負のスケール値（水平反転）を正しく解析する", () => {
      const input = "scale(-1, 1)";
      const result = SvgTransformUtils.parseTransform(input);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        type: "scale",
        sx: -1,
        sy: 1,
      });
    });

    test("scale(1, -1) - 負のスケール値（垂直反転）を正しく解析する", () => {
      const input = "scale(1, -1)";
      const result = SvgTransformUtils.parseTransform(input);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        type: "scale",
        sx: 1,
        sy: -1,
      });
    });
  });

  describe("skewX/skewY", () => {
    test("skewX(30) - angle=30のskewXコマンドを返す", () => {
      const input = "skewX(30)";
      const result = SvgTransformUtils.parseTransform(input);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        type: "skewX",
        angle: 30,
      });
    });

    test("skewY(45) - angle=45のskewYコマンドを返す", () => {
      const input = "skewY(45)";
      const result = SvgTransformUtils.parseTransform(input);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        type: "skewY",
        angle: 45,
      });
    });
  });

  describe("matrix", () => {
    test("matrix(1, 0, 0, 1, 10, 20) - 6パラメータのmatrixコマンドを返す", () => {
      const input = "matrix(1, 0, 0, 1, 10, 20)";
      const result = SvgTransformUtils.parseTransform(input);
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
    test("translate(10, 20) rotate(45) - スペース区切りの複数変換を順序通りに解析する", () => {
      const input = "translate(10, 20) rotate(45)";
      const result = SvgTransformUtils.parseTransform(input);
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

    test("scale(2), translate(50, 50) - カンマ区切りの複数変換を順序通りに解析する", () => {
      const input = "scale(2), translate(50, 50)";
      const result = SvgTransformUtils.parseTransform(input);
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

describe("SvgTransformUtils.calculateTransformedBounds", () => {
  describe("translate・scaleコマンドの適用", () => {
    test("translateコマンド - 位置が移動しサイズは維持される", () => {
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

    test("scaleコマンド - サイズが拡大される", () => {
      const bounds = { x: 0, y: 0, width: 100, height: 50 };
      const commands: TransformCommand[] = [{ type: "scale", sx: 2, sy: 2 }];
      const result = SvgTransformUtils.calculateTransformedBounds(
        bounds,
        commands,
      );
      expect(result.width).toBe(200);
      expect(result.height).toBe(100);
    });

    test("translate後にscale - 移動してから拡大される", () => {
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

    test("空のコマンド配列 - 元の境界をそのまま返す", () => {
      const bounds = { x: 10, y: 20, width: 100, height: 50 };
      const commands: TransformCommand[] = [];
      const result = SvgTransformUtils.calculateTransformedBounds(
        bounds,
        commands,
      );
      expect(result).toEqual(bounds);
    });

    test("負のscaleコマンド - width/heightは絶対値になる", () => {
      const bounds = { x: 10, y: 20, width: 100, height: 50 };
      const commands: TransformCommand[] = [{ type: "scale", sx: -1, sy: 1 }];
      const result = SvgTransformUtils.calculateTransformedBounds(
        bounds,
        commands,
      );
      // 負のスケールは反転を意味するが、Figmaでは負のwidth/heightは許容されないため
      // 絶対値を使用する（x, yは負の値のままだが、位置座標なので問題ない）
      expect(result.x).toBe(-10);
      expect(result.y).toBe(20);
      expect(result.width).toBe(100); // Math.absにより正の値
      expect(result.height).toBe(50);
    });
  });

  describe("簡易実装のコマンド（境界をそのまま返す）", () => {
    test("rotateコマンド - 境界をそのまま返す", () => {
      const bounds = { x: 10, y: 20, width: 100, height: 50 };
      const commands: TransformCommand[] = [
        { type: "rotate", angle: 45, cx: 0, cy: 0 },
      ];
      const result = SvgTransformUtils.calculateTransformedBounds(
        bounds,
        commands,
      );
      expect(result).toEqual(bounds);
    });

    test("skewXコマンド - 境界をそのまま返す", () => {
      const bounds = { x: 10, y: 20, width: 100, height: 50 };
      const commands: TransformCommand[] = [{ type: "skewX", angle: 30 }];
      const result = SvgTransformUtils.calculateTransformedBounds(
        bounds,
        commands,
      );
      expect(result).toEqual(bounds);
    });

    test("skewYコマンド - 境界をそのまま返す", () => {
      const bounds = { x: 10, y: 20, width: 100, height: 50 };
      const commands: TransformCommand[] = [{ type: "skewY", angle: 30 }];
      const result = SvgTransformUtils.calculateTransformedBounds(
        bounds,
        commands,
      );
      expect(result).toEqual(bounds);
    });

    test("matrixコマンド - 境界をそのまま返す", () => {
      const bounds = { x: 10, y: 20, width: 100, height: 50 };
      const commands: TransformCommand[] = [
        { type: "matrix", a: 1, b: 0, c: 0, d: 1, e: 10, f: 20 },
      ];
      const result = SvgTransformUtils.calculateTransformedBounds(
        bounds,
        commands,
      );
      expect(result).toEqual(bounds);
    });
  });
});

describe("SvgTransformUtils.extractTranslation", () => {
  test("単一のtranslateコマンド - 移動量を抽出する", () => {
    const commands: TransformCommand[] = [
      { type: "translate", tx: 10, ty: 20 },
    ];
    const result = SvgTransformUtils.extractTranslation(commands);
    expect(result).toEqual({ x: 10, y: 20 });
  });

  test("複数のtranslateコマンド - 移動量を合算する", () => {
    const commands: TransformCommand[] = [
      { type: "translate", tx: 10, ty: 20 },
      { type: "translate", tx: 5, ty: 10 },
    ];
    const result = SvgTransformUtils.extractTranslation(commands);
    expect(result).toEqual({ x: 15, y: 30 });
  });

  test("translateがない場合 - {x: 0, y: 0}を返す", () => {
    const commands: TransformCommand[] = [{ type: "scale", sx: 2, sy: 2 }];
    const result = SvgTransformUtils.extractTranslation(commands);
    expect(result).toEqual({ x: 0, y: 0 });
  });

  test("空配列 - {x: 0, y: 0}を返す", () => {
    const commands: TransformCommand[] = [];
    const result = SvgTransformUtils.extractTranslation(commands);
    expect(result).toEqual({ x: 0, y: 0 });
  });
});

describe("SvgTransformUtils.parseArgs", () => {
  test("複数の連続空白 - 正しく数値配列に変換する", () => {
    const input = "10  20";
    const result = SvgTransformUtils.parseArgs(input);
    expect(result).toEqual([10, 20]);
  });

  test("カンマと空白の混在 - 正しく数値配列に変換する", () => {
    const input = "10, 20  ,  30";
    const result = SvgTransformUtils.parseArgs(input);
    expect(result).toEqual([10, 20, 30]);
  });

  test("前後の空白 - 正しく数値配列に変換する", () => {
    const input = "  10,20  ";
    const result = SvgTransformUtils.parseArgs(input);
    expect(result).toEqual([10, 20]);
  });

  test("不正な値を含む - NaNはフィルタリングされる", () => {
    const input = "10,abc,20";
    const result = SvgTransformUtils.parseArgs(input);
    expect(result).toEqual([10, 20]);
  });

  test("空文字列 - 空配列を返す", () => {
    const input = "";
    const result = SvgTransformUtils.parseArgs(input);
    expect(result).toEqual([]);
  });

  test("空白のみ - 空配列を返す", () => {
    const input = "   ";
    const result = SvgTransformUtils.parseArgs(input);
    expect(result).toEqual([]);
  });
});
