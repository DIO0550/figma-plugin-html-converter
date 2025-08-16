import { test, expect } from 'vitest';
import { ConversionOptions } from '../conversion-options';

test('負の値を正の値に正規化する', () => {
  const options = {
    containerWidth: -800,
    containerHeight: -600,
    spacing: -8
  };
  
  const normalized = ConversionOptions.normalize(options);
  
  expect(normalized.containerWidth).toBe(800);
  expect(normalized.containerHeight).toBe(600);
  expect(normalized.spacing).toBe(8);
});

test('未定義の値にデフォルト値が設定される', () => {
  const options = {
    containerWidth: 1000
  };
  
  const normalized = ConversionOptions.normalize(options);
  
  expect(normalized.containerWidth).toBe(1000);
  expect(normalized.containerHeight).toBe(600);
  expect(normalized.defaultFont).toEqual({ family: 'Inter', style: 'Regular' });
});