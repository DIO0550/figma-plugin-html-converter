import { test, expect } from 'vitest';
import { Colors } from '../colors';

test('色を明るくできる', () => {
  const color = { r: 0.5, g: 0.5, b: 0.5 };
  const lighter = Colors.lighten(color, 20);
  const hsl = Colors.toHsl(lighter);
  expect(hsl.l).toBe(70); // 50 + 20
});

test('明度が100を超えないようにクランプされる', () => {
  const color = { r: 0.9, g: 0.9, b: 0.9 };
  const lighter = Colors.lighten(color, 50);
  const hsl = Colors.toHsl(lighter);
  expect(hsl.l).toBe(100);
});

test('色を暗くできる', () => {
  const color = { r: 0.5, g: 0.5, b: 0.5 };
  const darker = Colors.darken(color, 20);
  const hsl = Colors.toHsl(darker);
  expect(hsl.l).toBe(30); // 50 - 20
});

test('明度が0未満にならないようにクランプされる', () => {
  const color = { r: 0.1, g: 0.1, b: 0.1 };
  const darker = Colors.darken(color, 50);
  const hsl = Colors.toHsl(darker);
  expect(hsl.l).toBe(0);
});

test('彩度を上げることができる', () => {
  const color = { r: 0.5, g: 0.3, b: 0.3 };
  const saturated = Colors.saturate(color, 20);
  const hsl = Colors.toHsl(saturated);
  const originalHsl = Colors.toHsl(color);
  expect(hsl.s).toBeGreaterThan(originalHsl.s);
});

test('彩度が100を超えないようにクランプされる', () => {
  const color = { r: 1, g: 0, b: 0 };
  const saturated = Colors.saturate(color, 50);
  const hsl = Colors.toHsl(saturated);
  expect(hsl.s).toBe(100);
});

test('彩度を下げることができる', () => {
  const color = { r: 1, g: 0, b: 0 };
  const desaturated = Colors.desaturate(color, 50);
  const hsl = Colors.toHsl(desaturated);
  expect(hsl.s).toBe(50); // 100 - 50
});

test('彩度が0未満にならないようにクランプされる', () => {
  const color = { r: 0.6, g: 0.4, b: 0.4 };
  const desaturated = Colors.desaturate(color, 100);
  const hsl = Colors.toHsl(desaturated);
  expect(hsl.s).toBe(0);
});

test('グレースケールに変換できる', () => {
  const color = { r: 1, g: 0, b: 0 };
  const gray = Colors.grayscale(color);
  // 輝度計算: 1 * 0.299 + 0 * 0.587 + 0 * 0.114 = 0.299
  expect(gray.r).toBeCloseTo(0.299);
  expect(gray.g).toBeCloseTo(0.299);
  expect(gray.b).toBeCloseTo(0.299);
});

test('色を反転できる', () => {
  const color = { r: 0.2, g: 0.4, b: 0.6 };
  const inverted = Colors.invert(color);
  expect(inverted.r).toBeCloseTo(0.8);
  expect(inverted.g).toBeCloseTo(0.6);
  expect(inverted.b).toBeCloseTo(0.4);
});

test('黒と白の反転が正しく動作する', () => {
  const black = { r: 0, g: 0, b: 0 };
  const white = { r: 1, g: 1, b: 1 };
  
  const invertedBlack = Colors.invert(black);
  expect(invertedBlack).toEqual({ r: 1, g: 1, b: 1 });
  
  const invertedWhite = Colors.invert(white);
  expect(invertedWhite).toEqual({ r: 0, g: 0, b: 0 });
});