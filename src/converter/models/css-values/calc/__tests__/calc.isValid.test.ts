import { test, expect } from 'vitest';
import { Calc } from '../calc';

test('calc()式を正しく判定できる', () => {
  expect(Calc.isValid('calc(100px + 20px)')).toBe(true);
  expect(Calc.isValid('calc(50vh - 10px)')).toBe(true);
  expect(Calc.isValid('  calc(1rem + 5px)  ')).toBe(true);
});

test('calc()式でないものを正しく判定できる', () => {
  expect(Calc.isValid('100px')).toBe(false);
  expect(Calc.isValid('calc(')).toBe(false);
  expect(Calc.isValid('not-calc')).toBe(false);
});