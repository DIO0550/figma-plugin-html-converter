import { test, expect } from 'vitest';
import { CSSLength } from '../length';

test('ピクセル値からCSSLength型を作成できる', () => {
  const length = CSSLength.fromPixels(100);
  expect(CSSLength.getValue(length)).toBe(100);
  expect(CSSLength.getUnit(length)).toBe('px');
});