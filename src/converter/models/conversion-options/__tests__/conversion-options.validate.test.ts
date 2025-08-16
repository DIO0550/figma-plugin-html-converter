import { test, expect } from 'vitest';
import { ConversionOptions } from '../conversion-options';
import type { ConversionOptions as ConversionOptionsType } from '../conversion-options';

test('有効なオプションがtrueを返す', () => {
  const options = ConversionOptions.getDefault();
  expect(ConversionOptions.validate(options)).toBe(true);
});

test('負のcontainerWidthがfalseを返す', () => {
  const options: ConversionOptionsType = {
    containerWidth: -100
  };
  expect(ConversionOptions.validate(options)).toBe(false);
});

test('負のcontainerHeightがfalseを返す', () => {
  const options: ConversionOptionsType = {
    containerHeight: -100
  };
  expect(ConversionOptions.validate(options)).toBe(false);
});

test('負のspacingがfalseを返す', () => {
  const options: ConversionOptionsType = {
    spacing: -5
  };
  expect(ConversionOptions.validate(options)).toBe(false);
});

test('無効なcolorModeがfalseを返す', () => {
  const options: ConversionOptionsType = {
    colorMode: 'invalid' as ConversionOptionsType['colorMode']
  };
  expect(ConversionOptions.validate(options)).toBe(false);
});

test('ゼロのcontainerWidthがfalseを返す', () => {
  const options: ConversionOptionsType = {
    containerWidth: 0
  };
  expect(ConversionOptions.validate(options)).toBe(false);
});