import { test, expect } from 'vitest';
import { CSSLength } from '../length';

test('ゼロ値を判定できる', () => {
  expect(CSSLength.isZero(CSSLength.from(0, 'px'))).toBe(true);
  expect(CSSLength.isZero(CSSLength.from(0, 'rem'))).toBe(true);
  expect(CSSLength.isZero(CSSLength.from(1, 'px'))).toBe(false);
  expect(CSSLength.isZero(CSSLength.from(0.1, 'rem'))).toBe(false);
});