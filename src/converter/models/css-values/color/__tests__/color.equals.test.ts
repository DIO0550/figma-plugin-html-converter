import { test, expect } from 'vitest';
import { CSSColor } from '../color';

test('同じRGB値の場合trueを返す', () => {
  const color1 = CSSColor.fromRGB({ r: 128, g: 64, b: 192 });
  const color2 = CSSColor.fromRGB({ r: 128, g: 64, b: 192 });
  expect(CSSColor.equals(color1, color2)).toBe(true);
});

test('異なるRGB値の場合falseを返す', () => {
  const color1 = CSSColor.fromRGB({ r: 128, g: 64, b: 192 });
  const color2 = CSSColor.fromRGB({ r: 128, g: 64, b: 191 });
  expect(CSSColor.equals(color1, color2)).toBe(false);
});