import { test, expect, beforeEach, afterEach } from 'vitest';
import { CSSValueAdapter } from '../adapter';

beforeEach(() => {
  CSSValueAdapter.resetContext();
});

afterEach(() => {
  CSSValueAdapter.resetContext();
});

test('calc()式を判定できる', () => {
  expect(CSSValueAdapter.isCalc('calc(100% - 20px)')).toBe(true);
  expect(CSSValueAdapter.isCalc('calc(1rem + 5px)')).toBe(true);
  expect(CSSValueAdapter.isCalc('100px')).toBe(false);
  expect(CSSValueAdapter.isCalc('50%')).toBe(false);
});

test('calc()式を評価する', () => {
  expect(CSSValueAdapter.parseCalc('calc(2rem + 10px)')).toBe(42);
  expect(CSSValueAdapter.parseCalc('calc(100px - 20px)')).toBe(80);
});

test('無効なcalc()式はnullを返す', () => {
  expect(CSSValueAdapter.parseCalc('100px')).toBeNull();
  expect(CSSValueAdapter.parseCalc('calc(invalid)')).toBeNull();
});