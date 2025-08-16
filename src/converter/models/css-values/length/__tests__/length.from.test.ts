import { test, expect } from 'vitest';
import { CSSLength } from '../length';

test('数値と単位からCSSLength型を作成できる', () => {
  const length = CSSLength.from(10, 'px');
  expect(length).toBeDefined();
  expect(CSSLength.getValue(length)).toBe(10);
  expect(CSSLength.getUnit(length)).toBe('px');
});

test('様々な単位をサポートする', () => {
  const px = CSSLength.from(20, 'px');
  const rem = CSSLength.from(1.5, 'rem');
  const em = CSSLength.from(2, 'em');
  const vh = CSSLength.from(50, 'vh');
  const vw = CSSLength.from(100, 'vw');

  expect(CSSLength.getUnit(px)).toBe('px');
  expect(CSSLength.getUnit(rem)).toBe('rem');
  expect(CSSLength.getUnit(em)).toBe('em');
  expect(CSSLength.getUnit(vh)).toBe('vh');
  expect(CSSLength.getUnit(vw)).toBe('vw');
});