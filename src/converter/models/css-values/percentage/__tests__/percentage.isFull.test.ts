import { test, expect } from 'vitest';
import { CSSPercentage } from '../percentage';

test('100%を判定できる', () => {
  expect(CSSPercentage.isFull(CSSPercentage.from(100))).toBe(true);
  expect(CSSPercentage.isFull(CSSPercentage.from(99.9))).toBe(false);
  expect(CSSPercentage.isFull(CSSPercentage.from(100.1))).toBe(false);
  expect(CSSPercentage.isFull(CSSPercentage.from(50))).toBe(false);
});