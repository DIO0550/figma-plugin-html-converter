import { test, expect } from 'vitest';
import { CSSPercentage } from '../percentage';

test('ゼロ値を判定できる', () => {
  expect(CSSPercentage.isZero(CSSPercentage.from(0))).toBe(true);
  expect(CSSPercentage.isZero(CSSPercentage.from(1))).toBe(false);
  expect(CSSPercentage.isZero(CSSPercentage.from(0.1))).toBe(false);
});