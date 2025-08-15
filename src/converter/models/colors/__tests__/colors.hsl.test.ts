import { test, expect } from 'vitest';
import { Colors } from '../colors';

test('RGBからHSLに変換できる', () => {
  const rgb = { r: 1, g: 0, b: 0 }; // 純粋な赤
  const hsl = Colors.toHsl(rgb);
  expect(hsl.h).toBe(0);
  expect(hsl.s).toBe(100);
  expect(hsl.l).toBe(50);
});

test('グレースケールのRGBをHSLに変換できる', () => {
  const rgb = { r: 0.5, g: 0.5, b: 0.5 };
  const hsl = Colors.toHsl(rgb);
  expect(hsl.h).toBe(0);
  expect(hsl.s).toBe(0);
  expect(hsl.l).toBe(50);
});

test('HSLからRGBに変換できる', () => {
  const hsl = { h: 0, s: 100, l: 50 }; // 純粋な赤
  const rgb = Colors.fromHsl(hsl);
  expect(rgb.r).toBeCloseTo(1);
  expect(rgb.g).toBeCloseTo(0);
  expect(rgb.b).toBeCloseTo(0);
});

test('グレースケールのHSLをRGBに変換できる', () => {
  const hsl = { h: 0, s: 0, l: 50 };
  const rgb = Colors.fromHsl(hsl);
  expect(rgb.r).toBeCloseTo(0.5);
  expect(rgb.g).toBeCloseTo(0.5);
  expect(rgb.b).toBeCloseTo(0.5);
});

test('緑色のRGB-HSL変換が正しく動作する', () => {
  const rgb = { r: 0, g: 1, b: 0 };
  const hsl = Colors.toHsl(rgb);
  expect(hsl.h).toBe(120);
  expect(hsl.s).toBe(100);
  expect(hsl.l).toBe(50);
  
  const rgbBack = Colors.fromHsl(hsl);
  expect(rgbBack.r).toBeCloseTo(0);
  expect(rgbBack.g).toBeCloseTo(1);
  expect(rgbBack.b).toBeCloseTo(0);
});

test('青色のRGB-HSL変換が正しく動作する', () => {
  const rgb = { r: 0, g: 0, b: 1 };
  const hsl = Colors.toHsl(rgb);
  expect(hsl.h).toBe(240);
  expect(hsl.s).toBe(100);
  expect(hsl.l).toBe(50);
  
  const rgbBack = Colors.fromHsl(hsl);
  expect(rgbBack.r).toBeCloseTo(0);
  expect(rgbBack.g).toBeCloseTo(0);
  expect(rgbBack.b).toBeCloseTo(1);
});

test('オレンジ色のRGB-HSL変換が正しく動作する', () => {
  const rgb = { r: 1, g: 0.5, b: 0 };
  const hsl = Colors.toHsl(rgb);
  expect(hsl.h).toBe(30);
  expect(hsl.s).toBe(100);
  expect(hsl.l).toBe(50);
});

test('黒色のRGB-HSL変換が正しく動作する', () => {
  const rgb = { r: 0, g: 0, b: 0 };
  const hsl = Colors.toHsl(rgb);
  expect(hsl.h).toBe(0);
  expect(hsl.s).toBe(0);
  expect(hsl.l).toBe(0);
});

test('白色のRGB-HSL変換が正しく動作する', () => {
  const rgb = { r: 1, g: 1, b: 1 };
  const hsl = Colors.toHsl(rgb);
  expect(hsl.h).toBe(0);
  expect(hsl.s).toBe(0);
  expect(hsl.l).toBe(100);
});