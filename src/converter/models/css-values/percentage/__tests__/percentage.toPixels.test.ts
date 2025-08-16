import { test, expect } from 'vitest';
import { CSSPercentage } from '../percentage';

test('基準値に対してピクセル値を計算する', () => {
  const percentage = CSSPercentage.from(50);
  expect(CSSPercentage.toPixels(percentage, 200)).toBe(100);
  expect(CSSPercentage.toPixels(percentage, 1000)).toBe(500);
});

test('様々なパーセンテージで正しく計算する', () => {
  expect(CSSPercentage.toPixels(CSSPercentage.from(0), 100)).toBe(0);
  expect(CSSPercentage.toPixels(CSSPercentage.from(25), 100)).toBe(25);
  expect(CSSPercentage.toPixels(CSSPercentage.from(100), 100)).toBe(100);
  expect(CSSPercentage.toPixels(CSSPercentage.from(150), 100)).toBe(150);
});

test('小数点を含むパーセンテージで計算する', () => {
  const percentage = CSSPercentage.from(33.33);
  expect(CSSPercentage.toPixels(percentage, 300)).toBeCloseTo(99.99);
});