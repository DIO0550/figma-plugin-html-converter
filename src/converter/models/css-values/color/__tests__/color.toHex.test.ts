import { test, expect } from 'vitest';
import { CSSColor } from '../color';

test('HEX文字列に変換できる', () => {
  expect(CSSColor.toHex(CSSColor.fromRGB({ r: 255, g: 0, b: 0 }))).toBe('#ff0000');
  expect(CSSColor.toHex(CSSColor.fromRGB({ r: 0, g: 255, b: 0 }))).toBe('#00ff00');
  expect(CSSColor.toHex(CSSColor.fromRGB({ r: 0, g: 0, b: 255 }))).toBe('#0000ff');
  expect(CSSColor.toHex(CSSColor.fromRGB({ r: 128, g: 128, b: 128 }))).toBe('#808080');
});