import { test, expect } from 'vitest';
import { CSSPercentage } from '../percentage';

test('数値からCSSPercentage型を作成できる', () => {
  const percentage = CSSPercentage.from(50);
  expect(percentage).toBeDefined();
  expect(CSSPercentage.getValue(percentage)).toBe(50);
});

test('0から100の範囲の値を受け入れる', () => {
  expect(CSSPercentage.getValue(CSSPercentage.from(0))).toBe(0);
  expect(CSSPercentage.getValue(CSSPercentage.from(50))).toBe(50);
  expect(CSSPercentage.getValue(CSSPercentage.from(100))).toBe(100);
});

test('100を超える値も受け入れる', () => {
  const percentage = CSSPercentage.from(150);
  expect(CSSPercentage.getValue(percentage)).toBe(150);
});

test('負の値は0にクランプされる', () => {
  const percentage = CSSPercentage.from(-10);
  expect(CSSPercentage.getValue(percentage)).toBe(0);
});