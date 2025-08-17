import { test, expect } from "vitest";
import { Paint } from "../paint";
import type { Transform } from "../paint";

// transform()
test("transform() はデフォルトの単位行列を作成する", () => {
  const transform = Paint.transform();

  expect(transform).toEqual({
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    tx: 0,
    ty: 0,
  });
});

test("transform() はスケールで変換を作成する", () => {
  const transform = Paint.transform(2, 3);

  expect(transform).toEqual({
    a: 2,
    b: 0,
    c: 0,
    d: 3,
    tx: 0,
    ty: 0,
  });
});

test("transform() はスケールとスキューで変換を作成する", () => {
  const transform = Paint.transform(1, 1, 0.5, 0.3);

  expect(transform).toEqual({
    a: 1,
    b: 0.3,
    c: 0.5,
    d: 1,
    tx: 0,
    ty: 0,
  });
});

test("transform() は全てのパラメータで変換を作成する", () => {
  const transform = Paint.transform(2, 3, 0.5, 0.3, 10, 20);

  expect(transform).toEqual({
    a: 2,
    b: 0.3,
    c: 0.5,
    d: 3,
    tx: 10,
    ty: 20,
  });
});

test("transform() は負のスケール値を処理する", () => {
  const transform = Paint.transform(-1, -1);

  expect(transform).toEqual({
    a: -1,
    b: 0,
    c: 0,
    d: -1,
    tx: 0,
    ty: 0,
  });
});

test("transform() はゼロのスケール値を処理する", () => {
  const transform = Paint.transform(0, 0);

  expect(transform).toEqual({
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    tx: 0,
    ty: 0,
  });
});

test("transform() は大きな変換値を処理する", () => {
  const transform = Paint.transform(1, 1, 0, 0, 1000, 2000);

  expect(transform).toEqual({
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    tx: 1000,
    ty: 2000,
  });
});

test("transform() は負の変換値を処理する", () => {
  const transform = Paint.transform(1, 1, 0, 0, -100, -200);

  expect(transform).toEqual({
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    tx: -100,
    ty: -200,
  });
});

test("transform() は均一なスケール変換を作成する", () => {
  const scale = 2;
  const transform = Paint.transform(scale, scale);

  expect(transform.a).toBe(2);
  expect(transform.d).toBe(2);
  expect(transform.b).toBe(0);
  expect(transform.c).toBe(0);
});

test("transform() は非均一なスケール変換を作成する", () => {
  const transform = Paint.transform(2, 0.5);

  expect(transform.a).toBe(2);
  expect(transform.d).toBe(0.5);
});

// identityTransform()
test("identityTransform() は単位行列を作成する", () => {
  const transform = Paint.identityTransform();

  expect(transform).toEqual({
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    tx: 0,
    ty: 0,
  });
});

test("identityTransform() は引数なしのtransform()と同等", () => {
  const identity = Paint.identityTransform();
  const defaultTransform = Paint.transform();

  expect(identity).toEqual(defaultTransform);
});

test("identityTransform() は毎回新しいオブジェクトを作成する", () => {
  const transform1 = Paint.identityTransform();
  const transform2 = Paint.identityTransform();

  expect(transform1).not.toBe(transform2);
  expect(transform1).toEqual(transform2);
});

test("identityTransform() はスケール、スキュー、変換がない", () => {
  const transform = Paint.identityTransform();

  expect(transform.a).toBe(1);
  expect(transform.d).toBe(1);
  expect(transform.b).toBe(0);
  expect(transform.c).toBe(0);
  expect(transform.tx).toBe(0);
  expect(transform.ty).toBe(0);
});

// rotationTransform()
test("rotationTransform() は0度の回転変換を作成する", () => {
  const transform = Paint.rotationTransform(0);

  expect(transform.a).toBeCloseTo(1);
  expect(transform.b).toBeCloseTo(0);
  expect(transform.c).toBeCloseTo(0);
  expect(transform.d).toBeCloseTo(1);
  expect(transform.tx).toBeCloseTo(0);
  expect(transform.ty).toBeCloseTo(0);
});

test("rotationTransform() は90度の回転変換を作成する", () => {
  const transform = Paint.rotationTransform(90);

  expect(transform.a).toBeCloseTo(0);
  expect(transform.b).toBeCloseTo(1);
  expect(transform.c).toBeCloseTo(-1);
  expect(transform.d).toBeCloseTo(0);
  expect(transform.tx).toBeCloseTo(0);
  expect(transform.ty).toBeCloseTo(0);
});

test("rotationTransform() は180度の回転変換を作成する", () => {
  const transform = Paint.rotationTransform(180);

  expect(transform.a).toBeCloseTo(-1);
  expect(transform.b).toBeCloseTo(0);
  expect(transform.c).toBeCloseTo(0);
  expect(transform.d).toBeCloseTo(-1);
  expect(transform.tx).toBeCloseTo(0);
  expect(transform.ty).toBeCloseTo(0);
});

test("rotationTransform() は270度の回転変換を作成する", () => {
  const transform = Paint.rotationTransform(270);

  expect(transform.a).toBeCloseTo(0);
  expect(transform.b).toBeCloseTo(-1);
  expect(transform.c).toBeCloseTo(1);
  expect(transform.d).toBeCloseTo(0);
  expect(transform.tx).toBeCloseTo(0);
  expect(transform.ty).toBeCloseTo(0);
});

test("rotationTransform() は45度の回転変換を作成する", () => {
  const transform = Paint.rotationTransform(45);
  const sqrt2Over2 = Math.sqrt(2) / 2;

  expect(transform.a).toBeCloseTo(sqrt2Over2);
  expect(transform.b).toBeCloseTo(sqrt2Over2);
  expect(transform.c).toBeCloseTo(-sqrt2Over2);
  expect(transform.d).toBeCloseTo(sqrt2Over2);
});

test("rotationTransform() は負の回転角度を処理する", () => {
  const transform = Paint.rotationTransform(-90);

  expect(transform.a).toBeCloseTo(0);
  expect(transform.b).toBeCloseTo(-1);
  expect(transform.c).toBeCloseTo(1);
  expect(transform.d).toBeCloseTo(0);
});

test("rotationTransform() はカスタム中心周りの回転を処理する", () => {
  const transform = Paint.rotationTransform(90, 100, 100);

  expect(transform.a).toBeCloseTo(0);
  expect(transform.b).toBeCloseTo(1);
  expect(transform.c).toBeCloseTo(-1);
  expect(transform.d).toBeCloseTo(0);
  expect(transform.tx).toBeCloseTo(200);
  expect(transform.ty).toBeCloseTo(0);
});

test("rotationTransform() は360度の回転を処理する", () => {
  const transform = Paint.rotationTransform(360);

  expect(transform.a).toBeCloseTo(1);
  expect(transform.b).toBeCloseTo(0);
  expect(transform.c).toBeCloseTo(0);
  expect(transform.d).toBeCloseTo(1);
  expect(transform.tx).toBeCloseTo(0);
  expect(transform.ty).toBeCloseTo(0);
});

test("rotationTransform() は360度を超える回転を処理する", () => {
  const transform450 = Paint.rotationTransform(450);
  const transform90 = Paint.rotationTransform(90);

  expect(transform450.a).toBeCloseTo(transform90.a);
  expect(transform450.b).toBeCloseTo(transform90.b);
  expect(transform450.c).toBeCloseTo(transform90.c);
  expect(transform450.d).toBeCloseTo(transform90.d);
});

test("rotationTransform() は中心周りの回転の正しい変換を計算する", () => {
  const centerX = 50;
  const centerY = 50;
  const transform = Paint.rotationTransform(90, centerX, centerY);

  expect(transform.tx).toBeCloseTo(100);
  expect(transform.ty).toBeCloseTo(0);
});

test("rotationTransform() は負の中心座標での回転を処理する", () => {
  const transform = Paint.rotationTransform(90, -50, -50);

  expect(transform.a).toBeCloseTo(0);
  expect(transform.b).toBeCloseTo(1);
  expect(transform.c).toBeCloseTo(-1);
  expect(transform.d).toBeCloseTo(0);
  expect(transform.tx).toBeCloseTo(-100);
  expect(transform.ty).toBeCloseTo(0);
});

test("rotationTransform() は非常に小さい回転角度を処理する", () => {
  const transform = Paint.rotationTransform(0.001);

  expect(transform.a).toBeCloseTo(1);
  expect(transform.b).toBeCloseTo((0.001 * Math.PI) / 180);
  expect(transform.c).toBeCloseTo((-0.001 * Math.PI) / 180);
  expect(transform.d).toBeCloseTo(1);
});

// Transform組み合わせ
test("スケール回転変換を作成できる", () => {
  const rotation = Paint.rotationTransform(45);
  const scale = Paint.transform(2, 2);

  expect(rotation).toBeDefined();
  expect(scale).toBeDefined();
});

test("変換とスケールで変換を作成できる", () => {
  const transform = Paint.transform(2, 2, 0, 0, 100, 200);

  expect(transform.a).toBe(2);
  expect(transform.d).toBe(2);
  expect(transform.tx).toBe(100);
  expect(transform.ty).toBe(200);
});

test("スキューで変換を作成できる", () => {
  const transform = Paint.transform(1, 1, 0.5, 0.5);

  expect(transform.c).toBe(0.5);
  expect(transform.b).toBe(0.5);
});

// Transform型チェック
test("Transformインターフェースの正しいプロパティを持つ", () => {
  const transform: Transform = Paint.transform();

  expect(transform).toHaveProperty("a");
  expect(transform).toHaveProperty("b");
  expect(transform).toHaveProperty("c");
  expect(transform).toHaveProperty("d");
  expect(transform).toHaveProperty("tx");
  expect(transform).toHaveProperty("ty");
});

test("グラデーションペイントの有効な変換を作成する", () => {
  const transform = Paint.rotationTransform(45);
  const stops = [
    { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
    { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } },
  ];
  const paint = Paint.linearGradient(stops, transform);

  expect(paint.gradientTransform).toEqual(transform);
});

test("画像ペイントの有効な変換を作成する", () => {
  const transform = Paint.transform(2, 2, 0, 0, 10, 10);
  const paint = {
    type: "IMAGE" as const,
    imageUrl: "test.png",
    scaleMode: "FILL" as const,
    imageTransform: transform,
  };

  expect(paint.imageTransform).toEqual(transform);
});
