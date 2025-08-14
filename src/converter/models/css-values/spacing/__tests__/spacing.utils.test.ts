import { test, expect } from 'vitest';
import { CSSSpacing } from '../spacing';

test('CSSSpacing.getValue - 値を取得できる', () => {
  const spacing = CSSSpacing.from(25);
  expect(CSSSpacing.getValue(spacing)).toBe(25);
});

test('CSSSpacing.equals - 同じ値の場合trueを返す', () => {
  const spacing1 = CSSSpacing.from(10);
  const spacing2 = CSSSpacing.from(10);
  expect(CSSSpacing.equals(spacing1, spacing2)).toBe(true);
});

test('CSSSpacing.equals - 異なる値の場合falseを返す', () => {
  const spacing1 = CSSSpacing.from(10);
  const spacing2 = CSSSpacing.from(20);
  expect(CSSSpacing.equals(spacing1, spacing2)).toBe(false);
});

test('CSSSpacing.toString - 文字列表現を返す', () => {
  const spacing = CSSSpacing.from(15);
  expect(CSSSpacing.toString(spacing)).toBe('15px');
});

test('CSSSpacing.toString - ゼロ値の文字列表現を返す', () => {
  const spacing = CSSSpacing.from(0);
  expect(CSSSpacing.toString(spacing)).toBe('0px');
});