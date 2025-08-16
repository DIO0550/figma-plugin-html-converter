import { test, expect } from 'vitest';
import { CSSLength } from '../length';

test('文字列からCSSLength型をパースできる', () => {
  const length = CSSLength.parse('16px');
  expect(length).toBeDefined();
  if (length) {
    expect(CSSLength.getValue(length)).toBe(16);
    expect(CSSLength.getUnit(length)).toBe('px');
  }
});

test('様々な単位をパースできる', () => {
  const tests = [
    { input: '10px', value: 10, unit: 'px' },
    { input: '1.5rem', value: 1.5, unit: 'rem' },
    { input: '2em', value: 2, unit: 'em' },
    { input: '50vh', value: 50, unit: 'vh' },
    { input: '100vw', value: 100, unit: 'vw' },
  ];

  tests.forEach(({ input, value, unit }) => {
    const length = CSSLength.parse(input);
    expect(length).toBeDefined();
    if (length) {
      expect(CSSLength.getValue(length)).toBe(value);
      expect(CSSLength.getUnit(length)).toBe(unit);
    }
  });
});

test('無効な値はnullを返す', () => {
  expect(CSSLength.parse('auto')).toBeNull();
  expect(CSSLength.parse('inherit')).toBeNull();
  expect(CSSLength.parse('100%')).toBeNull(); // パーセンテージはCSSPercentageで扱う
  expect(CSSLength.parse('invalid')).toBeNull();
});

test('単位なしの数値をpxとして扱う', () => {
  const length = CSSLength.parse('42');
  expect(length).toBeDefined();
  if (length) {
    expect(CSSLength.getValue(length)).toBe(42);
    expect(CSSLength.getUnit(length)).toBe('px');
  }
});