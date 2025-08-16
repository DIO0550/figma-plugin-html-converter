import { test, expect } from 'vitest';
import { CSSColor } from '../color';

test('rgb()関数形式の文字列に変換できる', () => {
  expect(CSSColor.toRGBString(CSSColor.fromRGB({ r: 255, g: 0, b: 0 }))).toBe('rgb(255, 0, 0)');
  expect(CSSColor.toRGBString(CSSColor.fromRGB({ r: 0, g: 255, b: 0 }))).toBe('rgb(0, 255, 0)');
  expect(CSSColor.toRGBString(CSSColor.fromRGB({ r: 128, g: 64, b: 192 }))).toBe('rgb(128, 64, 192)');
});