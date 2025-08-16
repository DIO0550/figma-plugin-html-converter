import { test, expect } from 'vitest';
import { CSSPercentage } from '../percentage';

test('同じ値の場合trueを返す', () => {
  const p1 = CSSPercentage.from(50);
  const p2 = CSSPercentage.from(50);
  expect(CSSPercentage.equals(p1, p2)).toBe(true);
});

test('異なる値の場合falseを返す', () => {
  const p1 = CSSPercentage.from(50);
  const p2 = CSSPercentage.from(75);
  expect(CSSPercentage.equals(p1, p2)).toBe(false);
});