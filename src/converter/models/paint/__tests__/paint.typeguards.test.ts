import { test, expect } from "vitest";
import { Paint } from "../paint";
import type { RGB } from "../../colors";
import type { ColorStop } from "../paint";

// isSolid()
test("isSolid() はソリッドペイントに対してtrueを返す", () => {
  const color: RGB = { r: 1, g: 0, b: 0 };
  const paint = Paint.solid(color);

  expect(Paint.isSolid(paint)).toBe(true);
});

test("isSolid() は線形グラデーションペイントに対してfalseを返す", () => {
  const stops: ColorStop[] = [
    { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
    { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } },
  ];
  const paint = Paint.linearGradient(stops);

  expect(Paint.isSolid(paint)).toBe(false);
});

test("isSolid() は放射グラデーションペイントに対してfalseを返す", () => {
  const stops: ColorStop[] = [
    { position: 0, color: { r: 1, g: 1, b: 1, a: 1 } },
    { position: 1, color: { r: 0, g: 0, b: 0, a: 1 } },
  ];
  const paint = Paint.radialGradient(stops);

  expect(Paint.isSolid(paint)).toBe(false);
});

test("isSolid() は画像ペイントに対してfalseを返す", () => {
  const paint = Paint.image("https://example.com/image.png");

  expect(Paint.isSolid(paint)).toBe(false);
});

test("isSolid() は型を正しく絞り込む", () => {
  const paint = Paint.solid({ r: 1, g: 0, b: 0 });

  if (Paint.isSolid(paint)) {
    expect(paint.color).toBeDefined();
    expect(paint.type).toBe("SOLID");
  }
});

// isGradient()
test("isGradient() は線形グラデーションペイントに対してtrueを返す", () => {
  const stops: ColorStop[] = [
    { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
    { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } },
  ];
  const paint = Paint.linearGradient(stops);

  expect(Paint.isGradient(paint)).toBe(true);
});

test("isGradient() は放射グラデーションペイントに対してtrueを返す", () => {
  const stops: ColorStop[] = [
    { position: 0, color: { r: 1, g: 1, b: 1, a: 1 } },
    { position: 1, color: { r: 0, g: 0, b: 0, a: 1 } },
  ];
  const paint = Paint.radialGradient(stops);

  expect(Paint.isGradient(paint)).toBe(true);
});

test("isGradient() は角度グラデーションペイントに対してtrueを返す", () => {
  const paint = {
    type: Paint.Type.GRADIENT_ANGULAR,
    gradientStops: [
      { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
      { position: 1, color: { r: 0, g: 1, b: 0, a: 1 } },
    ],
    visible: true,
  };

  expect(Paint.isGradient(paint)).toBe(true);
});

test("isGradient() はダイヤモンドグラデーションペイントに対してtrueを返す", () => {
  const paint = {
    type: Paint.Type.GRADIENT_DIAMOND,
    gradientStops: [
      { position: 0, color: { r: 0, g: 0, b: 1, a: 1 } },
      { position: 1, color: { r: 1, g: 1, b: 0, a: 1 } },
    ],
    visible: true,
  };

  expect(Paint.isGradient(paint)).toBe(true);
});

test("isGradient() はソリッドペイントに対してfalseを返す", () => {
  const paint = Paint.solid({ r: 1, g: 0, b: 0 });

  expect(Paint.isGradient(paint)).toBe(false);
});

test("isGradient() は画像ペイントに対してfalseを返す", () => {
  const paint = Paint.image("https://example.com/image.png");

  expect(Paint.isGradient(paint)).toBe(false);
});

test("isGradient() は型を正しく絞り込む", () => {
  const stops: ColorStop[] = [
    { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
    { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } },
  ];
  const paint = Paint.linearGradient(stops);

  if (Paint.isGradient(paint)) {
    expect(paint.gradientStops).toBeDefined();
    expect(paint.gradientStops).toHaveLength(2);
  }
});

// isLinearGradient()
test("isLinearGradient() は線形グラデーションペイントに対してtrueを返す", () => {
  const stops: ColorStop[] = [
    { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
    { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } },
  ];
  const paint = Paint.linearGradient(stops);

  expect(Paint.isLinearGradient(paint)).toBe(true);
});

test("isLinearGradient() は放射グラデーションペイントに対してfalseを返す", () => {
  const stops: ColorStop[] = [
    { position: 0, color: { r: 1, g: 1, b: 1, a: 1 } },
    { position: 1, color: { r: 0, g: 0, b: 0, a: 1 } },
  ];
  const paint = Paint.radialGradient(stops);

  expect(Paint.isLinearGradient(paint)).toBe(false);
});

test("isLinearGradient() はソリッドペイントに対してfalseを返す", () => {
  const paint = Paint.solid({ r: 1, g: 0, b: 0 });

  expect(Paint.isLinearGradient(paint)).toBe(false);
});

test("isLinearGradient() は画像ペイントに対してfalseを返す", () => {
  const paint = Paint.image("https://example.com/image.png");

  expect(Paint.isLinearGradient(paint)).toBe(false);
});

test("isLinearGradient() は型を正しく絞り込む", () => {
  const stops: ColorStop[] = [
    { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
    { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } },
  ];
  const paint = Paint.linearGradient(stops);

  if (Paint.isLinearGradient(paint)) {
    expect(paint.type).toBe("GRADIENT_LINEAR");
    expect(paint.gradientStops).toBeDefined();
  }
});

// isRadialGradient()
test("isRadialGradient() は放射グラデーションペイントに対してtrueを返す", () => {
  const stops: ColorStop[] = [
    { position: 0, color: { r: 1, g: 1, b: 1, a: 1 } },
    { position: 1, color: { r: 0, g: 0, b: 0, a: 1 } },
  ];
  const paint = Paint.radialGradient(stops);

  expect(Paint.isRadialGradient(paint)).toBe(true);
});

test("isRadialGradient() は線形グラデーションペイントに対してfalseを返す", () => {
  const stops: ColorStop[] = [
    { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
    { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } },
  ];
  const paint = Paint.linearGradient(stops);

  expect(Paint.isRadialGradient(paint)).toBe(false);
});

test("isRadialGradient() はソリッドペイントに対してfalseを返す", () => {
  const paint = Paint.solid({ r: 1, g: 0, b: 0 });

  expect(Paint.isRadialGradient(paint)).toBe(false);
});

test("isRadialGradient() は画像ペイントに対してfalseを返す", () => {
  const paint = Paint.image("https://example.com/image.png");

  expect(Paint.isRadialGradient(paint)).toBe(false);
});

test("isRadialGradient() は型を正しく絞り込む", () => {
  const stops: ColorStop[] = [
    { position: 0, color: { r: 1, g: 1, b: 1, a: 1 } },
    { position: 1, color: { r: 0, g: 0, b: 0, a: 1 } },
  ];
  const paint = Paint.radialGradient(stops);

  if (Paint.isRadialGradient(paint)) {
    expect(paint.type).toBe("GRADIENT_RADIAL");
    expect(paint.gradientStops).toBeDefined();
  }
});

// isImage()
test("isImage() はURLを持つ画像ペイントに対してtrueを返す", () => {
  const paint = Paint.image("https://example.com/image.png");

  expect(Paint.isImage(paint)).toBe(true);
});

test("isImage() はハッシュを持つ画像ペイントに対してtrueを返す", () => {
  const paint = Paint.image("abc123def456");

  expect(Paint.isImage(paint)).toBe(true);
});

test("isImage() はソリッドペイントに対してfalseを返す", () => {
  const paint = Paint.solid({ r: 1, g: 0, b: 0 });

  expect(Paint.isImage(paint)).toBe(false);
});

test("isImage() は線形グラデーションペイントに対してfalseを返す", () => {
  const stops: ColorStop[] = [
    { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
    { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } },
  ];
  const paint = Paint.linearGradient(stops);

  expect(Paint.isImage(paint)).toBe(false);
});

test("isImage() は放射グラデーションペイントに対してfalseを返す", () => {
  const stops: ColorStop[] = [
    { position: 0, color: { r: 1, g: 1, b: 1, a: 1 } },
    { position: 1, color: { r: 0, g: 0, b: 0, a: 1 } },
  ];
  const paint = Paint.radialGradient(stops);

  expect(Paint.isImage(paint)).toBe(false);
});

test("isImage() はURLの型を正しく絞り込む", () => {
  const paint = Paint.image("https://example.com/image.png");

  if (Paint.isImage(paint)) {
    expect(paint.type).toBe("IMAGE");
    expect(paint.scaleMode).toBeDefined();
    expect(paint.imageUrl || paint.imageHash).toBeDefined();
  }
});

test("isImage() はハッシュの型を正しく絞り込む", () => {
  const paint = Paint.image("abc123");

  if (Paint.isImage(paint)) {
    expect(paint.type).toBe("IMAGE");
    expect(paint.scaleMode).toBeDefined();
    expect(paint.imageUrl || paint.imageHash).toBeDefined();
  }
});

// 型ガードの組み合わせ
test("グラデーションサブタイプを正しく識別する", () => {
  const linearPaint = Paint.linearGradient([
    { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
    { position: 1, color: { r: 0, g: 1, b: 0, a: 1 } },
  ]);

  expect(Paint.isGradient(linearPaint)).toBe(true);
  expect(Paint.isLinearGradient(linearPaint)).toBe(true);
  expect(Paint.isRadialGradient(linearPaint)).toBe(false);
});

test("全てのペイントタイプを正しく識別する", () => {
  const solidPaint = Paint.solid({ r: 1, g: 0, b: 0 });
  const linearPaint = Paint.linearGradient([
    { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
    { position: 1, color: { r: 0, g: 1, b: 0, a: 1 } },
  ]);
  const radialPaint = Paint.radialGradient([
    { position: 0, color: { r: 1, g: 1, b: 1, a: 1 } },
    { position: 1, color: { r: 0, g: 0, b: 0, a: 1 } },
  ]);
  const imagePaint = Paint.image("https://example.com/image.png");

  const paints = [solidPaint, linearPaint, radialPaint, imagePaint];

  const solidCount = paints.filter(Paint.isSolid).length;
  const gradientCount = paints.filter(Paint.isGradient).length;
  const imageCount = paints.filter(Paint.isImage).length;

  expect(solidCount).toBe(1);
  expect(gradientCount).toBe(2);
  expect(imageCount).toBe(1);
});
