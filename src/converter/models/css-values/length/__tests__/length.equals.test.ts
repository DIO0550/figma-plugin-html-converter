import { test, expect } from 'vitest';
import { CSSLength } from '../length';

test('同じ値と単位の場合trueを返す', () => {
  const length1 = CSSLength.from(10, 'px');
  const length2 = CSSLength.from(10, 'px');
  expect(CSSLength.equals(length1, length2)).toBe(true);
});

test('異なる値の場合falseを返す', () => {
  const length1 = CSSLength.from(10, 'px');
  const length2 = CSSLength.from(20, 'px');
  expect(CSSLength.equals(length1, length2)).toBe(false);
});

test('異なる単位の場合falseを返す', () => {
  const length1 = CSSLength.from(10, 'px');
  const length2 = CSSLength.from(10, 'rem');
  expect(CSSLength.equals(length1, length2)).toBe(false);
});