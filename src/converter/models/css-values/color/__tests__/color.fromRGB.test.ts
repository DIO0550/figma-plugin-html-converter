import { test, expect } from 'vitest';
import { CSSColor } from '../color';

test('RGB値からCSSColor型を作成できる', () => {
  const color = CSSColor.fromRGB({ r: 255, g: 0, b: 0 });
  expect(color).toBeDefined();
  const rgb = CSSColor.toRGB(color);
  expect(rgb).toEqual({ r: 255, g: 0, b: 0 });
});

test('RGB値を0-255の範囲にクランプする', () => {
  const color = CSSColor.fromRGB({ r: 300, g: -50, b: 128 });
  const rgb = CSSColor.toRGB(color);
  expect(rgb).toEqual({ r: 255, g: 0, b: 128 });
});