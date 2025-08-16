import { test, expect } from 'vitest';
import { CSSColor } from '../color';

test('Figmaの0-1形式に変換できる', () => {
  const color = CSSColor.fromRGB({ r: 255, g: 128, b: 0 });
  const figmaRGB = CSSColor.toFigmaRGB(color);
  expect(figmaRGB.r).toBeCloseTo(1);
  expect(figmaRGB.g).toBeCloseTo(0.5, 1);
  expect(figmaRGB.b).toBe(0);
});

test('黒を正しく変換する', () => {
  const color = CSSColor.fromRGB({ r: 0, g: 0, b: 0 });
  const figmaRGB = CSSColor.toFigmaRGB(color);
  expect(figmaRGB).toEqual({ r: 0, g: 0, b: 0 });
});

test('白を正しく変換する', () => {
  const color = CSSColor.fromRGB({ r: 255, g: 255, b: 255 });
  const figmaRGB = CSSColor.toFigmaRGB(color);
  expect(figmaRGB).toEqual({ r: 1, g: 1, b: 1 });
});