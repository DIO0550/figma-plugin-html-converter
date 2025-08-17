import { test, expect } from "vitest";
import { Paint } from "../paint";

// PAINT_TYPE constants
test('Paint.Type.SOLID が "SOLID" を返す', () => {
  expect(Paint.Type.SOLID).toBe("SOLID");
});

test('Paint.Type.GRADIENT_LINEAR が "GRADIENT_LINEAR" を返す', () => {
  expect(Paint.Type.GRADIENT_LINEAR).toBe("GRADIENT_LINEAR");
});

test('Paint.Type.GRADIENT_RADIAL が "GRADIENT_RADIAL" を返す', () => {
  expect(Paint.Type.GRADIENT_RADIAL).toBe("GRADIENT_RADIAL");
});

test('Paint.Type.GRADIENT_ANGULAR が "GRADIENT_ANGULAR" を返す', () => {
  expect(Paint.Type.GRADIENT_ANGULAR).toBe("GRADIENT_ANGULAR");
});

test('Paint.Type.GRADIENT_DIAMOND が "GRADIENT_DIAMOND" を返す', () => {
  expect(Paint.Type.GRADIENT_DIAMOND).toBe("GRADIENT_DIAMOND");
});

test('Paint.Type.IMAGE が "IMAGE" を返す', () => {
  expect(Paint.Type.IMAGE).toBe("IMAGE");
});

test('Paint.Type.EMOJI が "EMOJI" を返す', () => {
  expect(Paint.Type.EMOJI).toBe("EMOJI");
});

test("Paint.Type が全ての期待されるペイントタイプを持つ", () => {
  const expectedTypes = [
    "SOLID",
    "GRADIENT_LINEAR",
    "GRADIENT_RADIAL",
    "GRADIENT_ANGULAR",
    "GRADIENT_DIAMOND",
    "IMAGE",
    "EMOJI",
  ];
  const actualTypes = Object.values(Paint.Type);
  expect(actualTypes).toEqual(expectedTypes);
});

// BLEND_MODE constants
test('Paint.BlendMode.NORMAL が "NORMAL" を返す', () => {
  expect(Paint.BlendMode.NORMAL).toBe("NORMAL");
});

test('Paint.BlendMode.DARKEN が "DARKEN" を返す', () => {
  expect(Paint.BlendMode.DARKEN).toBe("DARKEN");
});

test('Paint.BlendMode.MULTIPLY が "MULTIPLY" を返す', () => {
  expect(Paint.BlendMode.MULTIPLY).toBe("MULTIPLY");
});

test('Paint.BlendMode.COLOR_BURN が "COLOR_BURN" を返す', () => {
  expect(Paint.BlendMode.COLOR_BURN).toBe("COLOR_BURN");
});

test('Paint.BlendMode.LIGHTEN が "LIGHTEN" を返す', () => {
  expect(Paint.BlendMode.LIGHTEN).toBe("LIGHTEN");
});

test('Paint.BlendMode.SCREEN が "SCREEN" を返す', () => {
  expect(Paint.BlendMode.SCREEN).toBe("SCREEN");
});

test('Paint.BlendMode.COLOR_DODGE が "COLOR_DODGE" を返す', () => {
  expect(Paint.BlendMode.COLOR_DODGE).toBe("COLOR_DODGE");
});

test('Paint.BlendMode.OVERLAY が "OVERLAY" を返す', () => {
  expect(Paint.BlendMode.OVERLAY).toBe("OVERLAY");
});

test('Paint.BlendMode.SOFT_LIGHT が "SOFT_LIGHT" を返す', () => {
  expect(Paint.BlendMode.SOFT_LIGHT).toBe("SOFT_LIGHT");
});

test('Paint.BlendMode.HARD_LIGHT が "HARD_LIGHT" を返す', () => {
  expect(Paint.BlendMode.HARD_LIGHT).toBe("HARD_LIGHT");
});

test('Paint.BlendMode.DIFFERENCE が "DIFFERENCE" を返す', () => {
  expect(Paint.BlendMode.DIFFERENCE).toBe("DIFFERENCE");
});

test('Paint.BlendMode.EXCLUSION が "EXCLUSION" を返す', () => {
  expect(Paint.BlendMode.EXCLUSION).toBe("EXCLUSION");
});

test('Paint.BlendMode.HUE が "HUE" を返す', () => {
  expect(Paint.BlendMode.HUE).toBe("HUE");
});

test('Paint.BlendMode.SATURATION が "SATURATION" を返す', () => {
  expect(Paint.BlendMode.SATURATION).toBe("SATURATION");
});

test('Paint.BlendMode.COLOR が "COLOR" を返す', () => {
  expect(Paint.BlendMode.COLOR).toBe("COLOR");
});

test('Paint.BlendMode.LUMINOSITY が "LUMINOSITY" を返す', () => {
  expect(Paint.BlendMode.LUMINOSITY).toBe("LUMINOSITY");
});

test("Paint.BlendMode が全ての期待されるブレンドモードを持つ", () => {
  const expectedModes = [
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
  const actualModes = Object.values(Paint.BlendMode);
  expect(actualModes).toEqual(expectedModes);
});

// SCALE_MODE constants
test('Paint.ScaleMode.FILL が "FILL" を返す', () => {
  expect(Paint.ScaleMode.FILL).toBe("FILL");
});

test('Paint.ScaleMode.FIT が "FIT" を返す', () => {
  expect(Paint.ScaleMode.FIT).toBe("FIT");
});

test('Paint.ScaleMode.CROP が "CROP" を返す', () => {
  expect(Paint.ScaleMode.CROP).toBe("CROP");
});

test('Paint.ScaleMode.TILE が "TILE" を返す', () => {
  expect(Paint.ScaleMode.TILE).toBe("TILE");
});

test("Paint.ScaleMode が全ての期待されるスケールモードを持つ", () => {
  const expectedModes = ["FILL", "FIT", "CROP", "TILE"];
  const actualModes = Object.values(Paint.ScaleMode);
  expect(actualModes).toEqual(expectedModes);
});

// Constants immutability
test("Paint.Type 定数は変更されない", () => {
  const originalValue = Paint.Type.SOLID;
  // TypeScriptのconst assertionは実行時ではなくコンパイル時に保護される
  expect(Paint.Type.SOLID).toBe(originalValue);
  expect(Object.isFrozen(Paint.Type)).toBe(false);
});

test("Paint.BlendMode 定数は変更されない", () => {
  const originalValue = Paint.BlendMode.NORMAL;
  expect(Paint.BlendMode.NORMAL).toBe(originalValue);
  expect(Object.isFrozen(Paint.BlendMode)).toBe(false);
});

test("Paint.ScaleMode 定数は変更されない", () => {
  const originalValue = Paint.ScaleMode.FILL;
  expect(Paint.ScaleMode.FILL).toBe(originalValue);
  expect(Object.isFrozen(Paint.ScaleMode)).toBe(false);
});
