import { test, expect } from 'vitest';
import { CSSLength } from '../length';

test('文字列表現を返す', () => {
  expect(CSSLength.toString(CSSLength.from(10, 'px'))).toBe('10px');
  expect(CSSLength.toString(CSSLength.from(1.5, 'rem'))).toBe('1.5rem');
  expect(CSSLength.toString(CSSLength.from(100, 'vw'))).toBe('100vw');
});