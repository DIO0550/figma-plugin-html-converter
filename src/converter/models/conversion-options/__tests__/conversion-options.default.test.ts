import { test, expect } from 'vitest';
import { ConversionOptions } from '../conversion-options';

test('デフォルトオプションを取得できる', () => {
  const options = ConversionOptions.getDefault();
  
  expect(options).toEqual({
    defaultFont: { family: 'Inter', style: 'Regular' },
    containerWidth: 800,
    containerHeight: 600,
    spacing: 8,
    colorMode: 'rgb'
  });
});