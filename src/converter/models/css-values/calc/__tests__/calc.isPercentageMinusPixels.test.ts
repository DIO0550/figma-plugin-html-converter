import { test, expect } from 'vitest';
import { Calc } from '../calc';

test('100% - Xpxパターンを検出できる', () => {
  const calc1 = Calc.from('calc(100% - 40px)');
  expect(Calc.isPercentageMinusPixels(calc1!)).toBe(true);
  
  const calc2 = Calc.from('calc(50% - 20px)');
  expect(Calc.isPercentageMinusPixels(calc2!)).toBe(true);
});

test('他のパターンではfalseを返す', () => {
  const calc1 = Calc.from('calc(100px - 40px)');
  expect(Calc.isPercentageMinusPixels(calc1!)).toBe(false);
  
  const calc2 = Calc.from('calc(100% + 40px)');
  expect(Calc.isPercentageMinusPixels(calc2!)).toBe(false);
});