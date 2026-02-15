import { test, expect } from "vitest";
import { SvgTransformUtils, TransformCommand } from "../svg-transform-utils";

test("SvgTransformUtils.parseTransform - 空文字列入力 - 空配列を返す", () => {
  const input = "";
  const result = SvgTransformUtils.parseTransform(input);
  expect(result).toEqual([]);
});

test("SvgTransformUtils.parseTransform - undefined入力 - 空配列を返す", () => {
  const input = undefined;
  const result = SvgTransformUtils.parseTransform(input);
  expect(result).toEqual([]);
});

test("SvgTransformUtils.parseTransform - translate(10, 20)入力 - tx=10, ty=20を返す", () => {
  const input = "translate(10, 20)";
  const result = SvgTransformUtils.parseTransform(input);
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "translate",
    tx: 10,
    ty: 20,
  });
});

test("SvgTransformUtils.parseTransform - translate(50)入力 - ty=0のtranslateを返す", () => {
  const input = "translate(50)";
  const result = SvgTransformUtils.parseTransform(input);
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "translate",
    tx: 50,
    ty: 0,
  });
});

test("SvgTransformUtils.parseTransform - translate負値入力 - 負値を保持して返す", () => {
  const input = "translate(-10, -20)";
  const result = SvgTransformUtils.parseTransform(input);
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "translate",
    tx: -10,
    ty: -20,
  });
});

test("SvgTransformUtils.parseTransform - translate小数入力 - 小数値を保持して返す", () => {
  const input = "translate(10.5, 20.75)";
  const result = SvgTransformUtils.parseTransform(input);
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "translate",
    tx: 10.5,
    ty: 20.75,
  });
});

test("SvgTransformUtils.parseTransform - translateゼロ入力 - ゼロ移動を返す", () => {
  const input = "translate(0, 0)";
  const result = SvgTransformUtils.parseTransform(input);
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "translate",
    tx: 0,
    ty: 0,
  });
});

test("SvgTransformUtils.parseTransform - rotate(45)入力 - 基準点0のrotateを返す", () => {
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

test("SvgTransformUtils.parseTransform - rotate(90,50,50)入力 - 指定基準点のrotateを返す", () => {
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

test("SvgTransformUtils.parseTransform - rotate負角度入力 - 負角度を保持して返す", () => {
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

test("SvgTransformUtils.parseTransform - scale(2)入力 - 等倍軸でscaleを返す", () => {
  const input = "scale(2)";
  const result = SvgTransformUtils.parseTransform(input);
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "scale",
    sx: 2,
    sy: 2,
  });
});

test("SvgTransformUtils.parseTransform - scale(2,3)入力 - sx/sy個別scaleを返す", () => {
  const input = "scale(2, 3)";
  const result = SvgTransformUtils.parseTransform(input);
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "scale",
    sx: 2,
    sy: 3,
  });
});

test("SvgTransformUtils.parseTransform - scale小数入力 - 小数scaleを返す", () => {
  const input = "scale(0.5)";
  const result = SvgTransformUtils.parseTransform(input);
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "scale",
    sx: 0.5,
    sy: 0.5,
  });
});

test("SvgTransformUtils.parseTransform - scale(-1,1)入力 - 水平反転scaleを返す", () => {
  const input = "scale(-1, 1)";
  const result = SvgTransformUtils.parseTransform(input);
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "scale",
    sx: -1,
    sy: 1,
  });
});

test("SvgTransformUtils.parseTransform - scale(1,-1)入力 - 垂直反転scaleを返す", () => {
  const input = "scale(1, -1)";
  const result = SvgTransformUtils.parseTransform(input);
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "scale",
    sx: 1,
    sy: -1,
  });
});

test("SvgTransformUtils.parseTransform - skewX(30)入力 - skewXコマンドを返す", () => {
  const input = "skewX(30)";
  const result = SvgTransformUtils.parseTransform(input);
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "skewX",
    angle: 30,
  });
});

test("SvgTransformUtils.parseTransform - skewY(45)入力 - skewYコマンドを返す", () => {
  const input = "skewY(45)";
  const result = SvgTransformUtils.parseTransform(input);
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    type: "skewY",
    angle: 45,
  });
});

test("SvgTransformUtils.parseTransform - matrix入力 - 6パラメータmatrixを返す", () => {
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

test("SvgTransformUtils.parseTransform - スペース区切り複数変換 - 順序どおり配列を返す", () => {
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

test("SvgTransformUtils.parseTransform - カンマ区切り複数変換 - 順序どおり配列を返す", () => {
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

test("SvgTransformUtils.calculateTransformedBounds - translate適用 - 位置だけ移動する", () => {
  const bounds = { x: 0, y: 0, width: 100, height: 50 };
  const commands: TransformCommand[] = [{ type: "translate", tx: 10, ty: 20 }];
  const result = SvgTransformUtils.calculateTransformedBounds(bounds, commands);
  expect(result.x).toBe(10);
  expect(result.y).toBe(20);
  expect(result.width).toBe(100);
  expect(result.height).toBe(50);
});

test("SvgTransformUtils.calculateTransformedBounds - scale適用 - サイズを拡大する", () => {
  const bounds = { x: 0, y: 0, width: 100, height: 50 };
  const commands: TransformCommand[] = [{ type: "scale", sx: 2, sy: 2 }];
  const result = SvgTransformUtils.calculateTransformedBounds(bounds, commands);
  expect(result.width).toBe(200);
  expect(result.height).toBe(100);
});

test("SvgTransformUtils.calculateTransformedBounds - translate後にscale適用 - 移動後に拡大する", () => {
  const bounds = { x: 0, y: 0, width: 100, height: 50 };
  const commands: TransformCommand[] = [
    { type: "translate", tx: 10, ty: 20 },
    { type: "scale", sx: 2, sy: 2 },
  ];
  const result = SvgTransformUtils.calculateTransformedBounds(bounds, commands);
  expect(result.x).toBe(20);
  expect(result.y).toBe(40);
  expect(result.width).toBe(200);
  expect(result.height).toBe(100);
});

test("SvgTransformUtils.calculateTransformedBounds - コマンド空配列 - 元の境界を返す", () => {
  const bounds = { x: 10, y: 20, width: 100, height: 50 };
  const commands: TransformCommand[] = [];
  const result = SvgTransformUtils.calculateTransformedBounds(bounds, commands);
  expect(result).toEqual(bounds);
});

test("SvgTransformUtils.calculateTransformedBounds - 負のscale適用 - 幅高さを絶対値で返す", () => {
  const bounds = { x: 10, y: 20, width: 100, height: 50 };
  const commands: TransformCommand[] = [{ type: "scale", sx: -1, sy: 1 }];
  const result = SvgTransformUtils.calculateTransformedBounds(bounds, commands);
  expect(result.x).toBe(-10);
  expect(result.y).toBe(20);
  expect(result.width).toBe(100);
  expect(result.height).toBe(50);
});

test("SvgTransformUtils.calculateTransformedBounds - rotateコマンド - 簡易実装として境界を維持する", () => {
  const bounds = { x: 10, y: 20, width: 100, height: 50 };
  const commands: TransformCommand[] = [{ type: "rotate", angle: 45, cx: 0, cy: 0 }];
  const result = SvgTransformUtils.calculateTransformedBounds(bounds, commands);
  expect(result).toEqual(bounds);
});

test("SvgTransformUtils.calculateTransformedBounds - skewXコマンド - 簡易実装として境界を維持する", () => {
  const bounds = { x: 10, y: 20, width: 100, height: 50 };
  const commands: TransformCommand[] = [{ type: "skewX", angle: 30 }];
  const result = SvgTransformUtils.calculateTransformedBounds(bounds, commands);
  expect(result).toEqual(bounds);
});

test("SvgTransformUtils.calculateTransformedBounds - skewYコマンド - 簡易実装として境界を維持する", () => {
  const bounds = { x: 10, y: 20, width: 100, height: 50 };
  const commands: TransformCommand[] = [{ type: "skewY", angle: 30 }];
  const result = SvgTransformUtils.calculateTransformedBounds(bounds, commands);
  expect(result).toEqual(bounds);
});

test("SvgTransformUtils.calculateTransformedBounds - matrixコマンド - 簡易実装として境界を維持する", () => {
  const bounds = { x: 10, y: 20, width: 100, height: 50 };
  const commands: TransformCommand[] = [
    { type: "matrix", a: 1, b: 0, c: 0, d: 1, e: 10, f: 20 },
  ];
  const result = SvgTransformUtils.calculateTransformedBounds(bounds, commands);
  expect(result).toEqual(bounds);
});

test("SvgTransformUtils.extractTranslation - 単一translate - 移動量を抽出する", () => {
  const commands: TransformCommand[] = [{ type: "translate", tx: 10, ty: 20 }];
  const result = SvgTransformUtils.extractTranslation(commands);
  expect(result).toEqual({ x: 10, y: 20 });
});

test("SvgTransformUtils.extractTranslation - 複数translate - 移動量を合算する", () => {
  const commands: TransformCommand[] = [
    { type: "translate", tx: 10, ty: 20 },
    { type: "translate", tx: 5, ty: 10 },
  ];
  const result = SvgTransformUtils.extractTranslation(commands);
  expect(result).toEqual({ x: 15, y: 30 });
});

test("SvgTransformUtils.extractTranslation - translateなし - {x:0,y:0}を返す", () => {
  const commands: TransformCommand[] = [{ type: "scale", sx: 2, sy: 2 }];
  const result = SvgTransformUtils.extractTranslation(commands);
  expect(result).toEqual({ x: 0, y: 0 });
});

test("SvgTransformUtils.extractTranslation - 空配列 - {x:0,y:0}を返す", () => {
  const commands: TransformCommand[] = [];
  const result = SvgTransformUtils.extractTranslation(commands);
  expect(result).toEqual({ x: 0, y: 0 });
});

test("SvgTransformUtils.parseArgs - 連続空白入力 - 数値配列に変換する", () => {
  const input = "10  20";
  const result = SvgTransformUtils.parseArgs(input);
  expect(result).toEqual([10, 20]);
});

test("SvgTransformUtils.parseArgs - カンマ空白混在入力 - 数値配列に変換する", () => {
  const input = "10, 20  ,  30";
  const result = SvgTransformUtils.parseArgs(input);
  expect(result).toEqual([10, 20, 30]);
});

test("SvgTransformUtils.parseArgs - 前後空白入力 - 数値配列に変換する", () => {
  const input = "  10,20  ";
  const result = SvgTransformUtils.parseArgs(input);
  expect(result).toEqual([10, 20]);
});

test("SvgTransformUtils.parseArgs - 不正値混在入力 - NaNを除外して返す", () => {
  const input = "10,abc,20";
  const result = SvgTransformUtils.parseArgs(input);
  expect(result).toEqual([10, 20]);
});

test("SvgTransformUtils.parseArgs - 空文字列入力 - 空配列を返す", () => {
  const input = "";
  const result = SvgTransformUtils.parseArgs(input);
  expect(result).toEqual([]);
});

test("SvgTransformUtils.parseArgs - 空白のみ入力 - 空配列を返す", () => {
  const input = "   ";
  const result = SvgTransformUtils.parseArgs(input);
  expect(result).toEqual([]);
});
