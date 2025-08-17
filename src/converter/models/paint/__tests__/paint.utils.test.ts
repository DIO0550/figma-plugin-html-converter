import { test, expect } from "vitest";
import { Paint } from "../paint";
import type { RGB } from "../../colors";
import type { ColorStop, BlendMode, Paint as PaintType } from "../paint";

// setOpacity()
test("setOpacity() はソリッドペイントに不透明度を設定する", () => {
  const color: RGB = { r: 1, g: 0, b: 0 };
  const paint = Paint.solid(color);
  const updatedPaint = Paint.setOpacity(paint, 0.5);

  expect(updatedPaint.opacity).toBe(0.5);
  expect(updatedPaint.type).toBe(paint.type);
  expect("color" in updatedPaint && updatedPaint.color).toEqual(color);
});

test("setOpacity() はグラデーションペイントに不透明度を設定する", () => {
  const stops: ColorStop[] = [
    { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
    { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } },
  ];
  const paint = Paint.linearGradient(stops);
  const updatedPaint = Paint.setOpacity(paint, 0.75);

  expect(updatedPaint.opacity).toBe(0.75);
  expect(updatedPaint.type).toBe("GRADIENT_LINEAR");
});

test("setOpacity() は画像ペイントに不透明度を設定する", () => {
  const paint = Paint.image("https://example.com/image.png");
  const updatedPaint = Paint.setOpacity(paint, 0.3);

  expect(updatedPaint.opacity).toBe(0.3);
  expect(updatedPaint.type).toBe("IMAGE");
});

test("setOpacity() は不透明度を0-1の範囲にクランプする", () => {
  const paint = Paint.solid({ r: 1, g: 0, b: 0 });

  const paint1 = Paint.setOpacity(paint, -0.5);
  expect(paint1.opacity).toBe(0);

  const paint2 = Paint.setOpacity(paint, 1.5);
  expect(paint2.opacity).toBe(1);
});

test("setOpacity() は不透明度のエッジケースを処理する", () => {
  const paint = Paint.solid({ r: 1, g: 0, b: 0 });

  const paint1 = Paint.setOpacity(paint, 0);
  expect(paint1.opacity).toBe(0);

  const paint2 = Paint.setOpacity(paint, 1);
  expect(paint2.opacity).toBe(1);
});

test("setOpacity() は元のペイントを変更しない", () => {
  const paint = Paint.solid({ r: 1, g: 0, b: 0 });
  const originalOpacity = paint.opacity;

  Paint.setOpacity(paint, 0.5);

  expect(paint.opacity).toBe(originalOpacity);
});

test("setOpacity() は他の全てのプロパティを保持する", () => {
  const paint = Paint.solid({ r: 1, g: 0, b: 0 });
  const paintWithProp = { ...paint, customProp: "test" };

  const updatedPaint = Paint.setOpacity(paintWithProp, 0.5);

  expect("customProp" in updatedPaint && updatedPaint.customProp).toBe("test");
});

// setBlendMode()
test("setBlendMode() はソリッドペイントにブレンドモードを設定する", () => {
  const paint = Paint.solid({ r: 1, g: 0, b: 0 });
  const updatedPaint = Paint.setBlendMode(paint, Paint.BlendMode.MULTIPLY);

  expect(updatedPaint.blendMode).toBe("MULTIPLY");
  expect(updatedPaint.type).toBe("SOLID");
});

test("setBlendMode() はグラデーションペイントにブレンドモードを設定する", () => {
  const stops: ColorStop[] = [
    { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
    { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } },
  ];
  const paint = Paint.linearGradient(stops);
  const updatedPaint = Paint.setBlendMode(paint, Paint.BlendMode.SCREEN);

  expect(updatedPaint.blendMode).toBe("SCREEN");
});

test("setBlendMode() は画像ペイントにブレンドモードを設定する", () => {
  const paint = Paint.image("https://example.com/image.png");
  const updatedPaint = Paint.setBlendMode(paint, Paint.BlendMode.OVERLAY);

  expect(updatedPaint.blendMode).toBe("OVERLAY");
});

test("setBlendMode() はブレンドモードを別のモードに変更する", () => {
  let paint: PaintType = Paint.solid({ r: 1, g: 0, b: 0 });
  paint = Paint.setBlendMode(paint, Paint.BlendMode.DARKEN);
  expect(paint.blendMode).toBe("DARKEN");

  paint = Paint.setBlendMode(paint, Paint.BlendMode.LIGHTEN);
  expect(paint.blendMode).toBe("LIGHTEN");
});

test("setBlendMode() は元のペイントを変更しない", () => {
  const paint = Paint.solid({ r: 1, g: 0, b: 0 });
  const originalBlendMode = paint.blendMode;

  Paint.setBlendMode(paint, Paint.BlendMode.MULTIPLY);

  expect(paint.blendMode).toBe(originalBlendMode);
});

test("setBlendMode() は全てのブレンドモードを処理する", () => {
  const paint = Paint.solid({ r: 1, g: 0, b: 0 });
  const blendModes: BlendMode[] = [
    "NORMAL",
    "DARKEN",
    "MULTIPLY",
    "COLOR_BURN",
    "LIGHTEN",
    "SCREEN",
    "COLOR_DODGE",
    "OVERLAY",
    "SOFT_LIGHT",
    "HARD_LIGHT",
    "DIFFERENCE",
    "EXCLUSION",
    "HUE",
    "SATURATION",
    "COLOR",
    "LUMINOSITY",
  ];

  blendModes.forEach((mode) => {
    const updatedPaint = Paint.setBlendMode(paint, mode);
    expect(updatedPaint.blendMode).toBe(mode);
  });
});

test("setBlendMode() は他の全てのプロパティを保持する", () => {
  const paint = Paint.solid({ r: 1, g: 0, b: 0 }, 0.5);
  paint.visible = false;

  const updatedPaint = Paint.setBlendMode(paint, Paint.BlendMode.MULTIPLY);

  expect(updatedPaint.opacity).toBe(0.5);
  expect(updatedPaint.visible).toBe(false);
});

// setVisible()
test("setVisible() は可視性をtrueに設定する", () => {
  const paint = Paint.solid({ r: 1, g: 0, b: 0 });
  const updatedPaint = Paint.setVisible(paint, true);

  expect(updatedPaint.visible).toBe(true);
});

test("setVisible() は可視性をfalseに設定する", () => {
  const paint = Paint.solid({ r: 1, g: 0, b: 0 });
  const updatedPaint = Paint.setVisible(paint, false);

  expect(updatedPaint.visible).toBe(false);
});

test("setVisible() は可視性をトグルする", () => {
  let paint: PaintType = Paint.solid({ r: 1, g: 0, b: 0 });

  paint = Paint.setVisible(paint, false);
  expect(paint.visible).toBe(false);

  paint = Paint.setVisible(paint, true);
  expect(paint.visible).toBe(true);
});

test("setVisible() はグラデーションペイントで動作する", () => {
  const stops: ColorStop[] = [
    { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
    { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } },
  ];
  const paint = Paint.linearGradient(stops);
  const updatedPaint = Paint.setVisible(paint, false);

  expect(updatedPaint.visible).toBe(false);
  expect(updatedPaint.type).toBe("GRADIENT_LINEAR");
});

test("setVisible() は画像ペイントで動作する", () => {
  const paint = Paint.image("https://example.com/image.png");
  const updatedPaint = Paint.setVisible(paint, false);

  expect(updatedPaint.visible).toBe(false);
  expect(updatedPaint.type).toBe("IMAGE");
});

test("setVisible() は元のペイントを変更しない", () => {
  const paint = Paint.solid({ r: 1, g: 0, b: 0 });
  const originalVisible = paint.visible;

  Paint.setVisible(paint, !originalVisible);

  expect(paint.visible).toBe(originalVisible);
});

test("setVisible() は他の全てのプロパティを保持する", () => {
  const paint = Paint.solid({ r: 1, g: 0, b: 0 }, 0.5);
  paint.blendMode = Paint.BlendMode.MULTIPLY;

  const updatedPaint = Paint.setVisible(paint, false);

  expect(updatedPaint.opacity).toBe(0.5);
  expect(updatedPaint.blendMode).toBe("MULTIPLY");
  expect("color" in updatedPaint && updatedPaint.color).toEqual({
    r: 1,
    g: 0,
    b: 0,
  });
});

// ユーティリティ関数のチェーン
test("複数のユーティリティ関数をチェーンできる", () => {
  let paint: PaintType = Paint.solid({ r: 1, g: 0, b: 0 });

  paint = Paint.setOpacity(paint, 0.5);
  paint = Paint.setBlendMode(paint, Paint.BlendMode.MULTIPLY);
  paint = Paint.setVisible(paint, false);

  expect(paint.opacity).toBe(0.5);
  expect(paint.blendMode).toBe("MULTIPLY");
  expect(paint.visible).toBe(false);
});

test("異なるペイントタイプで動作する", () => {
  const stops: ColorStop[] = [
    { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
    { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } },
  ];

  let linearPaint: PaintType = Paint.linearGradient(stops);
  linearPaint = Paint.setOpacity(linearPaint, 0.75);
  linearPaint = Paint.setBlendMode(linearPaint, Paint.BlendMode.SCREEN);

  expect(linearPaint.opacity).toBe(0.75);
  expect(linearPaint.blendMode).toBe("SCREEN");

  let imagePaint: PaintType = Paint.image("test.png");
  imagePaint = Paint.setOpacity(imagePaint, 0.25);
  imagePaint = Paint.setVisible(imagePaint, false);

  expect(imagePaint.opacity).toBe(0.25);
  expect(imagePaint.visible).toBe(false);
});

// エッジケース
test("未定義の初期値を処理する", () => {
  const paint = {
    type: "SOLID" as const,
    color: { r: 1, g: 0, b: 0 },
  };

  const paint1 = Paint.setOpacity(paint, 0.5);
  expect(paint1.opacity).toBe(0.5);

  const paint2 = Paint.setBlendMode(paint, Paint.BlendMode.MULTIPLY);
  expect(paint2.blendMode).toBe("MULTIPLY");

  const paint3 = Paint.setVisible(paint, false);
  expect(paint3.visible).toBe(false);
});

test("NaNの不透明度値を処理する", () => {
  const paint = Paint.solid({ r: 1, g: 0, b: 0 });
  const updatedPaint = Paint.setOpacity(paint, NaN);

  // NaNは0-1の範囲チェックで処理されるため、NaNのままになる
  expect(isNaN(updatedPaint.opacity as number)).toBe(true);
});

test("Infinityの不透明度値を処理する", () => {
  const paint = Paint.solid({ r: 1, g: 0, b: 0 });

  const paint1 = Paint.setOpacity(paint, Infinity);
  expect(paint1.opacity).toBe(1);

  const paint2 = Paint.setOpacity(paint, -Infinity);
  expect(paint2.opacity).toBe(0);
});
