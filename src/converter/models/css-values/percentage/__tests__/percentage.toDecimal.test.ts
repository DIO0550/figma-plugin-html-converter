import { test, expect } from 'vitest';
import { CSSPercentage } from '../percentage';

test('パーセンテージを小数に変換する', () => {
  expect(CSSPercentage.toDecimal(CSSPercentage.from(0))).toBe(0);
  expect(CSSPercentage.toDecimal(CSSPercentage.from(50))).toBe(0.5);
  expect(CSSPercentage.toDecimal(CSSPercentage.from(100))).toBe(1);
  expect(CSSPercentage.toDecimal(CSSPercentage.from(75))).toBe(0.75);
  expect(CSSPercentage.toDecimal(CSSPercentage.from(33.33))).toBeCloseTo(0.3333);
});