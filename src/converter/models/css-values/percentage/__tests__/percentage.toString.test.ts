import { test, expect } from 'vitest';
import { CSSPercentage } from '../percentage';

test('文字列表現を返す', () => {
  expect(CSSPercentage.toString(CSSPercentage.from(0))).toBe('0%');
  expect(CSSPercentage.toString(CSSPercentage.from(50))).toBe('50%');
  expect(CSSPercentage.toString(CSSPercentage.from(100))).toBe('100%');
  expect(CSSPercentage.toString(CSSPercentage.from(33.33))).toBe('33.33%');
});