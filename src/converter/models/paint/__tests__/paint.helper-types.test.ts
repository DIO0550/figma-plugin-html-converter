import { test, expect } from "vitest";
import type { ColorStop, Transform } from "../paint";

// ColorStop
test("ColorStopはpositionとcolorプロパティを持つ", () => {
  const colorStop: ColorStop = {
    position: 0.5,
    color: { r: 1, g: 0, b: 0, a: 1 },
  };

  expect(colorStop.position).toBe(0.5);
  expect(colorStop.color).toEqual({ r: 1, g: 0, b: 0, a: 1 });
});

test("ColorStopは0から1の間のposition値を受け入れる", () => {
  const stops: ColorStop[] = [
    { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
    { position: 0.25, color: { r: 1, g: 1, b: 0, a: 1 } },
    { position: 0.5, color: { r: 0, g: 1, b: 0, a: 1 } },
    { position: 0.75, color: { r: 0, g: 1, b: 1, a: 1 } },
    { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } },
  ];

  stops.forEach((stop) => {
    expect(stop.position).toBeGreaterThanOrEqual(0);
    expect(stop.position).toBeLessThanOrEqual(1);
  });
});

test("ColorStopはRGBAカラー形式を要求する", () => {
  const colorStop: ColorStop = {
    position: 0.5,
    color: { r: 0.5, g: 0.5, b: 0.5, a: 0.5 },
  };

  expect(colorStop.color).toHaveProperty("r");
  expect(colorStop.color).toHaveProperty("g");
  expect(colorStop.color).toHaveProperty("b");
  expect(colorStop.color).toHaveProperty("a");
});

// Transform
test("Transformは全ての必須マトリックスプロパティを持つ", () => {
  const transform: Transform = {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    tx: 0,
    ty: 0,
  };

  expect(transform).toHaveProperty("a");
  expect(transform).toHaveProperty("b");
  expect(transform).toHaveProperty("c");
  expect(transform).toHaveProperty("d");
  expect(transform).toHaveProperty("tx");
  expect(transform).toHaveProperty("ty");
});

test("Transformは単位行列を表現する", () => {
  const identity: Transform = {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    tx: 0,
    ty: 0,
  };

  expect(identity.a * identity.d - identity.b * identity.c).toBe(1);
});

test("Transformはスケール変換を表現する", () => {
  const scale: Transform = {
    a: 2,
    b: 0,
    c: 0,
    d: 3,
    tx: 0,
    ty: 0,
  };

  expect(scale.a).toBe(2);
  expect(scale.d).toBe(3);
});

test("Transformは移動変換を表現する", () => {
  const translation: Transform = {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    tx: 100,
    ty: 200,
  };

  expect(translation.tx).toBe(100);
  expect(translation.ty).toBe(200);
});
