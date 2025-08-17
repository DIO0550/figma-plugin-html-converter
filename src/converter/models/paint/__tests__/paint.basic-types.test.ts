import { test, expect } from "vitest";
import type {
  PaintType,
  BlendMode,
  ScaleMode,
  SolidPaint,
  ImagePaint,
} from "../paint";

// PaintType
test("PaintTypeは有効なペイントタイプを受け入れる", () => {
  const validTypes: PaintType[] = [
    "SOLID",
    "GRADIENT_LINEAR",
    "GRADIENT_RADIAL",
    "GRADIENT_ANGULAR",
    "GRADIENT_DIAMOND",
    "IMAGE",
    "EMOJI",
  ];

  validTypes.forEach((type) => {
    expect(type).toBeTruthy();
  });
});

test("PaintTypeはペイントオブジェクトで使用される", () => {
  const solidPaint: SolidPaint = {
    type: "SOLID",
    color: { r: 1, g: 0, b: 0 },
  };

  expect(solidPaint.type).toBe("SOLID");
});

// BlendMode
test("BlendModeは有効なブレンドモードを受け入れる", () => {
  const validModes: BlendMode[] = [
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

  validModes.forEach((mode) => {
    expect(mode).toBeTruthy();
  });
});

test("BlendModeはペイントオブジェクトでオプショナル", () => {
  const paint1: SolidPaint = {
    type: "SOLID",
    color: { r: 1, g: 0, b: 0 },
  };

  const paint2: SolidPaint = {
    type: "SOLID",
    color: { r: 1, g: 0, b: 0 },
    blendMode: "MULTIPLY",
  };

  expect(paint1.blendMode).toBeUndefined();
  expect(paint2.blendMode).toBe("MULTIPLY");
});

// ScaleMode
test("ScaleModeは有効なスケールモードを受け入れる", () => {
  const validModes: ScaleMode[] = ["FILL", "FIT", "CROP", "TILE"];

  validModes.forEach((mode) => {
    expect(mode).toBeTruthy();
  });
});

test("ScaleModeは画像ペイントで必須", () => {
  const imagePaint: ImagePaint = {
    type: "IMAGE",
    scaleMode: "FILL",
    imageUrl: "test.png",
  };

  expect(imagePaint.scaleMode).toBe("FILL");
});
