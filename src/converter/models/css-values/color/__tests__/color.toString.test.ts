import { test, expect } from 'vitest';
import { CSSColor } from '../color';

test('デフォルトでHEX形式を返す', () => {
  const color = CSSColor.fromRGB({ r: 255, g: 0, b: 128 });
  expect(CSSColor.toString(color)).toBe('#ff0080');
});