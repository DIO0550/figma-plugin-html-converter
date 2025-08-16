import { test, expect } from 'vitest';
import { Calc } from '../calc';

test('加算式をパースできる', () => {
  const calc = Calc.from('calc(100px + 20px)');
  const operation = Calc.parse(calc!);
  
  expect(operation).not.toBeNull();
  expect(operation!.operator).toBe('+');
  expect(operation!.left).toEqual({ value: 100, unit: 'px' });
  expect(operation!.right).toEqual({ value: 20, unit: 'px' });
});

test('減算式をパースできる', () => {
  const calc = Calc.from('calc(50vh - 10px)');
  const operation = Calc.parse(calc!);
  
  expect(operation).not.toBeNull();
  expect(operation!.operator).toBe('-');
  expect(operation!.left).toEqual({ value: 50, unit: 'vh' });
  expect(operation!.right).toEqual({ value: 10, unit: 'px' });
});

test('単位なしの値をpxとして扱う', () => {
  const calc = Calc.from('calc(100 + 20)');
  const operation = Calc.parse(calc!);
  
  expect(operation).not.toBeNull();
  expect(operation!.left.unit).toBe('px');
  expect(operation!.right.unit).toBe('px');
});