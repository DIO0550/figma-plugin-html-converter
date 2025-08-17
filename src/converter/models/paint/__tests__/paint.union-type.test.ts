import { test, expect } from "vitest";
import type {
  Paint,
  SolidPaint,
  LinearGradientPaint,
  ImagePaint,
} from "../paint";

// Paint Union Type
test("Paint共用体型はソリッドペイントを受け入れる", () => {
  const paint: Paint = {
    type: "SOLID",
    color: { r: 1, g: 0, b: 0 },
  };

  expect(paint.type).toBe("SOLID");
});

test("Paint共用体型は線形グラデーションペイントを受け入れる", () => {
  const paint: Paint = {
    type: "GRADIENT_LINEAR",
    gradientStops: [],
  };

  expect(paint.type).toBe("GRADIENT_LINEAR");
});

test("Paint共用体型は放射グラデーションペイントを受け入れる", () => {
  const paint: Paint = {
    type: "GRADIENT_RADIAL",
    gradientStops: [],
  };

  expect(paint.type).toBe("GRADIENT_RADIAL");
});

test("Paint共用体型は角度グラデーションペイントを受け入れる", () => {
  const paint: Paint = {
    type: "GRADIENT_ANGULAR",
    gradientStops: [],
  };

  expect(paint.type).toBe("GRADIENT_ANGULAR");
});

test("Paint共用体型はダイヤモンドグラデーションペイントを受け入れる", () => {
  const paint: Paint = {
    type: "GRADIENT_DIAMOND",
    gradientStops: [],
  };

  expect(paint.type).toBe("GRADIENT_DIAMOND");
});

test("Paint共用体型は画像ペイントを受け入れる", () => {
  const paint: Paint = {
    type: "IMAGE",
    scaleMode: "FILL",
    imageUrl: "test.png",
  };

  expect(paint.type).toBe("IMAGE");
});

test("ペイントタイプ間で判別できる", () => {
  const paints: Paint[] = [
    { type: "SOLID", color: { r: 1, g: 0, b: 0 } },
    { type: "GRADIENT_LINEAR", gradientStops: [] },
    { type: "IMAGE", scaleMode: "FILL", imageUrl: "test.png" },
  ];

  paints.forEach((paint) => {
    switch (paint.type) {
      case "SOLID":
        expect((paint as SolidPaint).color).toBeDefined();
        break;
      case "GRADIENT_LINEAR":
        expect((paint as LinearGradientPaint).gradientStops).toBeDefined();
        break;
      case "IMAGE":
        expect((paint as ImagePaint).scaleMode).toBeDefined();
        break;
    }
  });
});
