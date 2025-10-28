import { test, expect } from "vitest";
import { Paint } from "../paint";
import type { RGB, RGBA } from "../../colors";
import type {
  LinearGradientPaint,
  RadialGradientPaint,
  ColorStop,
} from "../paint";

// solid()
test("solid() は色を持つソリッドペイントを作成する", () => {
  const color: RGB = { r: 1, g: 0, b: 0 };
  const paint = Paint.solid(color);

  expect(paint.type).toBe("SOLID");
  expect(paint.color).toEqual(color);
  expect(paint.opacity).toBe(1);
});

test("solid() は色と不透明度を持つソリッドペイントを作成する", () => {
  const color: RGB = { r: 0, g: 1, b: 0 };
  const opacity = 0.5;
  const paint = Paint.solid(color, opacity);

  expect(paint.type).toBe("SOLID");
  expect(paint.color).toEqual(color);
  expect(paint.opacity).toBe(opacity);
});

test("solid() は黒色のソリッドペイントを作成する", () => {
  const color: RGB = { r: 0, g: 0, b: 0 };
  const paint = Paint.solid(color);

  expect(paint.color).toEqual({ r: 0, g: 0, b: 0 });
});

test("solid() は白色のソリッドペイントを作成する", () => {
  const color: RGB = { r: 1, g: 1, b: 1 };
  const paint = Paint.solid(color);

  expect(paint.color).toEqual({ r: 1, g: 1, b: 1 });
});

// linearGradient()
test("linearGradient() はストップを持つ線形グラデーションを作成する", () => {
  const stops: ColorStop[] = [
    { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
    { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } },
  ];
  const paint = Paint.linearGradient(stops);

  expect(paint.type).toBe("GRADIENT_LINEAR");
  expect(paint.gradientStops).toEqual(stops);
  expect(paint.visible).toBe(true);
  expect(paint.gradientTransform).toBeUndefined();
});

test("linearGradient() はストップと変換を持つ線形グラデーションを作成する", () => {
  const stops: ColorStop[] = [
    { position: 0, color: { r: 1, g: 1, b: 1, a: 1 } },
    { position: 1, color: { r: 0, g: 0, b: 0, a: 1 } },
  ];
  const transform = { a: 1, b: 0, c: 0, d: 1, tx: 10, ty: 20 };
  const paint = Paint.linearGradient(stops, transform);

  expect(paint.type).toBe("GRADIENT_LINEAR");
  expect(paint.gradientStops).toEqual(stops);
  expect(paint.gradientTransform).toEqual(transform);
  expect(paint.visible).toBe(true);
});

test("linearGradient() は複数ストップを持つ線形グラデーションを作成する", () => {
  const stops: ColorStop[] = [
    { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
    { position: 0.5, color: { r: 0, g: 1, b: 0, a: 1 } },
    { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } },
  ];
  const paint = Paint.linearGradient(stops);

  expect(paint.gradientStops).toHaveLength(3);
  expect(paint.gradientStops[1].position).toBe(0.5);
});

// radialGradient()
test("radialGradient() はストップを持つ放射グラデーションを作成する", () => {
  const stops: ColorStop[] = [
    { position: 0, color: { r: 1, g: 1, b: 1, a: 1 } },
    { position: 1, color: { r: 0, g: 0, b: 0, a: 1 } },
  ];
  const paint = Paint.radialGradient(stops);

  expect(paint.type).toBe("GRADIENT_RADIAL");
  expect(paint.gradientStops).toEqual(stops);
  expect(paint.visible).toBe(true);
  expect(paint.gradientTransform).toBeUndefined();
});

test("radialGradient() はストップと変換を持つ放射グラデーションを作成する", () => {
  const stops: ColorStop[] = [
    { position: 0, color: { r: 0.5, g: 0.5, b: 0.5, a: 1 } },
    { position: 1, color: { r: 1, g: 1, b: 1, a: 0.5 } },
  ];
  const transform = { a: 2, b: 0, c: 0, d: 2, tx: 0, ty: 0 };
  const paint = Paint.radialGradient(stops, transform);

  expect(paint.type).toBe("GRADIENT_RADIAL");
  expect(paint.gradientStops).toEqual(stops);
  expect(paint.gradientTransform).toEqual(transform);
  expect(paint.visible).toBe(true);
});

// image()
test("image() はURLで画像ペイントを作成する", () => {
  const url = "https://example.com/image.png";
  const paint = Paint.image(url);

  expect(paint.type).toBe("IMAGE");
  expect(paint.imageUrl).toBe(url);
  expect(paint.imageHash).toBeUndefined();
  expect(paint.scaleMode).toBe("FILL");
  expect(paint.visible).toBe(true);
});

test("image() はデータURLで画像ペイントを作成する", () => {
  const dataUrl = "data:image/png;base64,iVBORw0KGgo...";
  const paint = Paint.image(dataUrl);

  expect(paint.type).toBe("IMAGE");
  expect(paint.imageUrl).toBe(dataUrl);
  expect(paint.imageHash).toBeUndefined();
});

test("image() は相対パスで画像ペイントを作成する", () => {
  const path = "/images/logo.svg";
  const paint = Paint.image(path);

  expect(paint.type).toBe("IMAGE");
  expect(paint.imageUrl).toBe(path);
  expect(paint.imageHash).toBeUndefined();
});

test("image() はファイルパスで画像ペイントを作成する", () => {
  const path = "assets/image.jpg";
  const paint = Paint.image(path);

  expect(paint.type).toBe("IMAGE");
  expect(paint.imageUrl).toBe(path);
  expect(paint.imageHash).toBeUndefined();
});

test("image() はハッシュで画像ペイントを作成する", () => {
  const hash = "abc123def456";
  const paint = Paint.image(hash);

  expect(paint.type).toBe("IMAGE");
  expect(paint.imageHash).toBe(hash);
  expect(paint.imageUrl).toBeUndefined();
});

test("image() はカスタムスケールモードで画像ペイントを作成する", () => {
  const url = "https://example.com/image.png";
  const paint = Paint.image(url, Paint.ScaleMode.FIT);

  expect(paint.scaleMode).toBe("FIT");
});

test("image() はデフォルトスケールモードにFILLを使用する", () => {
  const url = "https://example.com/image.png";
  const paint = Paint.image(url);

  expect(paint.scaleMode).toBe("FILL");
});

// colorStop()
test("colorStop() はRGBカラーでカラーストップを作成する", () => {
  const color: RGB = { r: 1, g: 0, b: 0 };
  const stop = Paint.colorStop(0.5, color);

  expect(stop.position).toBe(0.5);
  expect(stop.color).toEqual({ r: 1, g: 0, b: 0, a: 1 });
});

test("colorStop() はRGBAカラーでカラーストップを作成する", () => {
  const color: RGBA = { r: 0, g: 1, b: 0, a: 0.5 };
  const stop = Paint.colorStop(0.25, color);

  expect(stop.position).toBe(0.25);
  expect(stop.color).toEqual(color);
});

test("colorStop() はRGBカラーと不透明度でカラーストップを作成する", () => {
  const color: RGB = { r: 0, g: 0, b: 1 };
  const stop = Paint.colorStop(0.75, color, 0.3);

  expect(stop.position).toBe(0.75);
  expect(stop.color).toEqual({ r: 0, g: 0, b: 1, a: 0.3 });
});

test("colorStop() はポジションを0-1の範囲にクランプする", () => {
  const color: RGB = { r: 1, g: 1, b: 1 };

  const stop1 = Paint.colorStop(-0.5, color);
  expect(stop1.position).toBe(0);

  const stop2 = Paint.colorStop(1.5, color);
  expect(stop2.position).toBe(1);
});

test("colorStop() は境界値のポジションを処理する", () => {
  const color: RGB = { r: 0.5, g: 0.5, b: 0.5 };

  const stop1 = Paint.colorStop(0, color);
  expect(stop1.position).toBe(0);

  const stop2 = Paint.colorStop(1, color);
  expect(stop2.position).toBe(1);
});

// twoColorGradient()
test("twoColorGradient() は2色の線形グラデーションを作成する", () => {
  const startColor: RGB = { r: 1, g: 0, b: 0 };
  const endColor: RGB = { r: 0, g: 0, b: 1 };
  const paint = Paint.twoColorGradient(
    startColor,
    endColor,
  ) as LinearGradientPaint;

  expect(paint.type).toBe("GRADIENT_LINEAR");
  expect(paint.gradientStops).toHaveLength(2);
  expect(paint.gradientStops[0].position).toBe(0);
  expect(paint.gradientStops[0].color).toEqual({ r: 1, g: 0, b: 0, a: 1 });
  expect(paint.gradientStops[1].position).toBe(1);
  expect(paint.gradientStops[1].color).toEqual({ r: 0, g: 0, b: 1, a: 1 });
});

test("twoColorGradient() は2色の放射グラデーションを作成する", () => {
  const startColor: RGB = { r: 1, g: 1, b: 1 };
  const endColor: RGB = { r: 0, g: 0, b: 0 };
  const paint = Paint.twoColorGradient(
    startColor,
    endColor,
    "radial",
  ) as RadialGradientPaint;

  expect(paint.type).toBe("GRADIENT_RADIAL");
  expect(paint.gradientStops).toHaveLength(2);
  expect(paint.gradientStops[0].color).toEqual({ r: 1, g: 1, b: 1, a: 1 });
  expect(paint.gradientStops[1].color).toEqual({ r: 0, g: 0, b: 0, a: 1 });
});

test("twoColorGradient() はデフォルトで線形グラデーションを作成する", () => {
  const startColor: RGB = { r: 0.5, g: 0.5, b: 0.5 };
  const endColor: RGB = { r: 0.2, g: 0.2, b: 0.2 };
  const paint = Paint.twoColorGradient(startColor, endColor);

  expect(paint.type).toBe("GRADIENT_LINEAR");
});

// fadeGradient()
test("fadeGradient() はフェードアウトグラデーションを作成する", () => {
  const color: RGB = { r: 1, g: 0, b: 0 };
  const paint = Paint.fadeGradient(color);

  expect(paint.type).toBe("GRADIENT_LINEAR");
  expect(paint.gradientStops).toHaveLength(2);
  expect(paint.gradientStops[0].position).toBe(0);
  expect(paint.gradientStops[0].color).toEqual({ r: 1, g: 0, b: 0, a: 1 });
  expect(paint.gradientStops[1].position).toBe(1);
  expect(paint.gradientStops[1].color).toEqual({ r: 1, g: 0, b: 0, a: 0 });
});

test("fadeGradient() はフェードイングラデーションを作成する", () => {
  const color: RGB = { r: 0, g: 1, b: 0 };
  const paint = Paint.fadeGradient(color, "in");

  expect(paint.type).toBe("GRADIENT_LINEAR");
  expect(paint.gradientStops).toHaveLength(2);
  expect(paint.gradientStops[0].position).toBe(0);
  expect(paint.gradientStops[0].color).toEqual({ r: 0, g: 1, b: 0, a: 0 });
  expect(paint.gradientStops[1].position).toBe(1);
  expect(paint.gradientStops[1].color).toEqual({ r: 0, g: 1, b: 0, a: 1 });
});

test("fadeGradient() はデフォルトでフェードアウトを作成する", () => {
  const color: RGB = { r: 0.5, g: 0.5, b: 0.5 };
  const paint = Paint.fadeGradient(color, "out");

  expect(paint.gradientStops[0].color.a).toBe(1);
  expect(paint.gradientStops[1].color.a).toBe(0);
});
