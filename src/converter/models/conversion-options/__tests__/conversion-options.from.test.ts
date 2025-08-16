import { test, expect } from 'vitest';
import { ConversionOptions } from '../conversion-options';

test('部分的なオプションから完全なオプションを作成する', () => {
  const partial = {
    containerWidth: 1200
  };
  
  const options = ConversionOptions.from(partial);
  
  expect(options.containerWidth).toBe(1200);
  expect(options.containerHeight).toBe(600);
  expect(options.spacing).toBe(8);
  expect(options.colorMode).toBe('rgb');
});

test('空のオブジェクトからデフォルトオプションを作成する', () => {
  const options = ConversionOptions.from();
  
  expect(options).toEqual(ConversionOptions.getDefault());
});

test('負の値が正規化される', () => {
  const partial = {
    containerWidth: -1000,
    spacing: -10
  };
  
  const options = ConversionOptions.from(partial);
  
  expect(options.containerWidth).toBe(1000);
  expect(options.spacing).toBe(10);
});