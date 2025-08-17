import { test, expect } from "vitest";
import type {
  SolidPaint,
  LinearGradientPaint,
  RadialGradientPaint,
  AngularGradientPaint,
  DiamondGradientPaint,
  ImagePaint,
} from "../paint";

// SolidPaint
test("SolidPaintは必須プロパティを持つ", () => {
  const paint: SolidPaint = {
    type: "SOLID",
    color: { r: 1, g: 0, b: 0 },
  };

  expect(paint.type).toBe("SOLID");
  expect(paint.color).toBeDefined();
});

test("SolidPaintはオプショナルプロパティを持つ", () => {
  const paint: SolidPaint = {
    type: "SOLID",
    color: { r: 1, g: 0, b: 0 },
    visible: false,
    opacity: 0.5,
    blendMode: "MULTIPLY",
  };

  expect(paint.visible).toBe(false);
  expect(paint.opacity).toBe(0.5);
  expect(paint.blendMode).toBe("MULTIPLY");
});

// LinearGradientPaint
test("LinearGradientPaintは必須プロパティを持つ", () => {
  const paint: LinearGradientPaint = {
    type: "GRADIENT_LINEAR",
    gradientStops: [
      { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
      { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } },
    ],
  };

  expect(paint.type).toBe("GRADIENT_LINEAR");
  expect(paint.gradientStops).toHaveLength(2);
});

test("LinearGradientPaintはオプショナルな変換を持つ", () => {
  const paint: LinearGradientPaint = {
    type: "GRADIENT_LINEAR",
    gradientStops: [],
    gradientTransform: {
      a: 1,
      b: 0,
      c: 0,
      d: 1,
      tx: 0,
      ty: 0,
    },
  };

  expect(paint.gradientTransform).toBeDefined();
});

// RadialGradientPaint
test("RadialGradientPaintは必須プロパティを持つ", () => {
  const paint: RadialGradientPaint = {
    type: "GRADIENT_RADIAL",
    gradientStops: [
      { position: 0, color: { r: 1, g: 1, b: 1, a: 1 } },
      { position: 1, color: { r: 0, g: 0, b: 0, a: 1 } },
    ],
  };

  expect(paint.type).toBe("GRADIENT_RADIAL");
  expect(paint.gradientStops).toHaveLength(2);
});

// AngularGradientPaint
test("AngularGradientPaintは必須プロパティを持つ", () => {
  const paint: AngularGradientPaint = {
    type: "GRADIENT_ANGULAR",
    gradientStops: [
      { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
      { position: 1, color: { r: 0, g: 1, b: 0, a: 1 } },
    ],
  };

  expect(paint.type).toBe("GRADIENT_ANGULAR");
  expect(paint.gradientStops).toBeDefined();
});

// DiamondGradientPaint
test("DiamondGradientPaintは必須プロパティを持つ", () => {
  const paint: DiamondGradientPaint = {
    type: "GRADIENT_DIAMOND",
    gradientStops: [
      { position: 0, color: { r: 0, g: 0, b: 1, a: 1 } },
      { position: 1, color: { r: 1, g: 1, b: 0, a: 1 } },
    ],
  };

  expect(paint.type).toBe("GRADIENT_DIAMOND");
  expect(paint.gradientStops).toBeDefined();
});

// ImagePaint
test("ImagePaintはURLで必須プロパティを持つ", () => {
  const paint: ImagePaint = {
    type: "IMAGE",
    scaleMode: "FILL",
    imageUrl: "https://example.com/image.png",
  };

  expect(paint.type).toBe("IMAGE");
  expect(paint.scaleMode).toBe("FILL");
  expect(paint.imageUrl).toBeDefined();
});

test("ImagePaintはハッシュで必須プロパティを持つ", () => {
  const paint: ImagePaint = {
    type: "IMAGE",
    scaleMode: "FIT",
    imageHash: "abc123def456",
  };

  expect(paint.type).toBe("IMAGE");
  expect(paint.scaleMode).toBe("FIT");
  expect(paint.imageHash).toBeDefined();
});

test("ImagePaintはオプショナルなフィルターを持つ", () => {
  const paint: ImagePaint = {
    type: "IMAGE",
    scaleMode: "CROP",
    imageUrl: "test.png",
    filters: {
      exposure: 0.5,
      contrast: 1.2,
      saturation: 0.8,
      temperature: 0.3,
      tint: -0.2,
      highlights: 0.1,
      shadows: -0.1,
    },
  };

  expect(paint.filters).toBeDefined();
  expect(paint.filters?.exposure).toBe(0.5);
  expect(paint.filters?.contrast).toBe(1.2);
});

test("ImagePaintはオプショナルな変換と回転を持つ", () => {
  const paint: ImagePaint = {
    type: "IMAGE",
    scaleMode: "TILE",
    imageUrl: "test.png",
    imageTransform: {
      a: 1,
      b: 0,
      c: 0,
      d: 1,
      tx: 10,
      ty: 20,
    },
    rotation: 45,
    scalingFactor: 2,
  };

  expect(paint.imageTransform).toBeDefined();
  expect(paint.rotation).toBe(45);
  expect(paint.scalingFactor).toBe(2);
});
