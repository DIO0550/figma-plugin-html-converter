import { test, expect } from 'vitest';
import { Calc } from '../calc';

const context = {
  viewportWidth: 1920,
  viewportHeight: 1080,
  fontSize: 16
};

test('px単位をそのまま返す', () => {
  expect(Calc.termToPixels({ value: 100, unit: 'px' }, context)).toBe(100);
});

test('rem/em単位を変換できる', () => {
  expect(Calc.termToPixels({ value: 2, unit: 'rem' }, context)).toBe(32);
  expect(Calc.termToPixels({ value: 1.5, unit: 'em' }, context)).toBe(24);
});

test('viewport単位を変換できる', () => {
  expect(Calc.termToPixels({ value: 50, unit: 'vw' }, context)).toBe(960);
  expect(Calc.termToPixels({ value: 100, unit: 'vh' }, context)).toBe(1080);
});

test('パーセンテージは0を返す（文脈依存）', () => {
  expect(Calc.termToPixels({ value: 50, unit: '%' }, context)).toBe(0);
});