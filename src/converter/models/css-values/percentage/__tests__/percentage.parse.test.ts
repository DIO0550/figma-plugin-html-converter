import { test, expect } from 'vitest';
import { CSSPercentage } from '../percentage';

test('パーセント記号付き文字列をパースできる', () => {
  const percentage = CSSPercentage.parse('75%');
  expect(percentage).toBeDefined();
  if (percentage) {
    expect(CSSPercentage.getValue(percentage)).toBe(75);
  }
});

test('小数点を含むパーセンテージをパースできる', () => {
  const percentage = CSSPercentage.parse('33.33%');
  expect(percentage).toBeDefined();
  if (percentage) {
    expect(CSSPercentage.getValue(percentage)).toBeCloseTo(33.33);
  }
});

test('0%をパースできる', () => {
  const percentage = CSSPercentage.parse('0%');
  expect(percentage).toBeDefined();
  if (percentage) {
    expect(CSSPercentage.getValue(percentage)).toBe(0);
  }
});

test('無効な値はnullを返す', () => {
  expect(CSSPercentage.parse('auto')).toBeNull();
  expect(CSSPercentage.parse('100px')).toBeNull();
  expect(CSSPercentage.parse('100')).toBeNull(); // %記号なし
  expect(CSSPercentage.parse('invalid')).toBeNull();
});