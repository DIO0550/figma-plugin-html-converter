import { test, expect } from 'vitest';
import { ConversionOptions } from '../conversion-options';
import type { ConversionOptions as ConversionOptionsType } from '../conversion-options';

test('hasDefaultFontが正しく動作する', () => {
  const withFont: ConversionOptionsType = {
    defaultFont: { family: 'Arial', style: 'Bold' }
  };
  const withoutFont: ConversionOptionsType = {};
  
  expect(ConversionOptions.hasDefaultFont(withFont)).toBe(true);
  expect(ConversionOptions.hasDefaultFont(withoutFont)).toBe(false);
});

test('hasContainerSizeが正しく動作する', () => {
  const withSize: ConversionOptionsType = {
    containerWidth: 800,
    containerHeight: 600
  };
  const withoutSize: ConversionOptionsType = {
    containerWidth: 800
  };
  
  expect(ConversionOptions.hasContainerSize(withSize)).toBe(true);
  expect(ConversionOptions.hasContainerSize(withoutSize)).toBe(false);
});