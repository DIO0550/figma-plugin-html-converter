import { test, expect } from 'vitest';
import type { ConversionOptions } from './models/conversion-options';

test('ConversionOptions型 - デフォルトオプション - 設定できる', () => {
  const options: ConversionOptions = {
    defaultFont: { family: 'Inter', style: 'Regular' },
    containerWidth: 800,
    containerHeight: 600,
    spacing: 16,
    colorMode: 'rgb'
  };

  expect(options.defaultFont?.family).toBe('Inter');
  expect(options.containerWidth).toBe(800);
  expect(options.colorMode).toBe('rgb');
});

test('ConversionOptions型 - 部分的なオプション - 設定できる', () => {
  const options: ConversionOptions = {
    colorMode: 'hex'
  };

  expect(options.colorMode).toBe('hex');
  expect(options.defaultFont).toBeUndefined();
});
