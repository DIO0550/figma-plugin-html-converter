import { test, expect } from 'vitest';
import { ConversionOptions } from '../conversion-options';
import type { ConversionOptions as ConversionOptionsType } from '../conversion-options';

test('isRGBModeが正しく動作する', () => {
  const rgbOptions: ConversionOptionsType = { colorMode: 'rgb' };
  const hexOptions: ConversionOptionsType = { colorMode: 'hex' };
  const noMode: ConversionOptionsType = {};
  
  expect(ConversionOptions.isRGBMode(rgbOptions)).toBe(true);
  expect(ConversionOptions.isRGBMode(hexOptions)).toBe(false);
  expect(ConversionOptions.isRGBMode(noMode)).toBe(false);
});

test('isHexModeが正しく動作する', () => {
  const hexOptions: ConversionOptionsType = { colorMode: 'hex' };
  const rgbOptions: ConversionOptionsType = { colorMode: 'rgb' };
  const noMode: ConversionOptionsType = {};
  
  expect(ConversionOptions.isHexMode(hexOptions)).toBe(true);
  expect(ConversionOptions.isHexMode(rgbOptions)).toBe(false);
  expect(ConversionOptions.isHexMode(noMode)).toBe(false);
});