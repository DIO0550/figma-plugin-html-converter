import { test, expect } from 'vitest';
import { ConversionOptions } from '../conversion-options';

test('ベースオプションとオーバーライドをマージできる', () => {
  const base = ConversionOptions.getDefault();
  const override = {
    containerWidth: 1200,
    colorMode: 'hex' as const
  };
  
  const merged = ConversionOptions.merge(base, override);
  
  expect(merged.containerWidth).toBe(1200);
  expect(merged.colorMode).toBe('hex');
  expect(merged.containerHeight).toBe(600);
  expect(merged.spacing).toBe(8);
});

test('空のオーバーライドでベースオプションが保持される', () => {
  const base = ConversionOptions.getDefault();
  const merged = ConversionOptions.merge(base, {});
  
  expect(merged).toEqual(base);
});

test('複数のオプションをマージできる', () => {
  const options1 = { containerWidth: 1000 };
  const options2 = { containerHeight: 800 };
  const options3 = { colorMode: 'hex' as const };
  
  const merged = ConversionOptions.mergeAll(options1, options2, options3);
  
  expect(merged.containerWidth).toBe(1000);
  expect(merged.containerHeight).toBe(800);
  expect(merged.colorMode).toBe('hex');
  expect(merged.spacing).toBe(8);
});

test('後のオプションが前のオプションを上書きする', () => {
  const options1 = { containerWidth: 1000 };
  const options2 = { containerWidth: 1200 };
  
  const merged = ConversionOptions.mergeAll(options1, options2);
  
  expect(merged.containerWidth).toBe(1200);
});