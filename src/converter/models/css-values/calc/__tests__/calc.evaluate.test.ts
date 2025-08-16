import { test, expect } from 'vitest';
import { Calc } from '../calc';

test('加算を計算できる', () => {
  const calc = Calc.from('calc(100px + 20px)');
  const result = Calc.evaluate(calc!);
  expect(result).toBe(120);
});

test('減算を計算できる', () => {
  const calc = Calc.from('calc(100px - 30px)');
  const result = Calc.evaluate(calc!);
  expect(result).toBe(70);
});

test('異なる単位の計算ができる', () => {
  const calc = Calc.from('calc(1rem + 4px)');
  const result = Calc.evaluate(calc!);
  expect(result).toBe(20); // 16 + 4
});

test('viewport単位を計算できる', () => {
  const calc = Calc.from('calc(50vh + 100px)');
  const result = Calc.evaluate(calc!);
  expect(result).toBe(640); // (1080 * 0.5) + 100
});

test('カスタムコンテキストで計算できる', () => {
  const calc = Calc.from('calc(100vw - 20px)');
  const result = Calc.evaluate(calc!, { viewportWidth: 1280 });
  expect(result).toBe(1260); // 1280 - 20
});