import { test, expect } from 'vitest';
import { Calc } from '../calc';

test('有効なcalc()式からCalcExpression型を作成できる', () => {
  const calc = Calc.from('calc(100px + 20px)');
  expect(calc).not.toBeNull();
  expect(Calc.toString(calc!)).toBe('calc(100px + 20px)');
});

test('無効な文字列でnullを返す', () => {
  expect(Calc.from('100px')).toBeNull();
  expect(Calc.from('not-calc')).toBeNull();
  expect(Calc.from('calc(')).toBeNull();
});