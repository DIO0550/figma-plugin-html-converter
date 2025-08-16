import { test, expect } from 'vitest';
import { CSSColor } from '../color';

test('名前付き色をパースできる', () => {
  const tests = [
    { input: 'red', expected: { r: 255, g: 0, b: 0 } },
    { input: 'green', expected: { r: 0, g: 128, b: 0 } },
    { input: 'blue', expected: { r: 0, g: 0, b: 255 } },
    { input: 'white', expected: { r: 255, g: 255, b: 255 } },
    { input: 'black', expected: { r: 0, g: 0, b: 0 } },
  ];

  tests.forEach(({ input, expected }) => {
    const color = CSSColor.parse(input);
    expect(color).toBeDefined();
    if (color) {
      expect(CSSColor.toRGB(color)).toEqual(expected);
    }
  });
});

test('HEX値をパースできる', () => {
  const color = CSSColor.parse('#FF00FF');
  expect(color).toBeDefined();
  if (color) {
    expect(CSSColor.toRGB(color)).toEqual({ r: 255, g: 0, b: 255 });
  }
});

test('rgb()関数をパースできる', () => {
  const tests = [
    { input: 'rgb(255, 0, 0)', expected: { r: 255, g: 0, b: 0 } },
    { input: 'rgb(0, 255, 0)', expected: { r: 0, g: 255, b: 0 } },
    { input: 'rgb(128, 128, 128)', expected: { r: 128, g: 128, b: 128 } },
  ];

  tests.forEach(({ input, expected }) => {
    const color = CSSColor.parse(input);
    expect(color).toBeDefined();
    if (color) {
      expect(CSSColor.toRGB(color)).toEqual(expected);
    }
  });
});

test('rgba()関数をパースできる（アルファ値は無視）', () => {
  const color = CSSColor.parse('rgba(255, 0, 0, 0.5)');
  expect(color).toBeDefined();
  if (color) {
    expect(CSSColor.toRGB(color)).toEqual({ r: 255, g: 0, b: 0 });
  }
});

test('transparentを透明色として処理する', () => {
  const color = CSSColor.parse('transparent');
  expect(color).toBeDefined();
  if (color) {
    expect(CSSColor.toRGB(color)).toEqual({ r: 0, g: 0, b: 0 });
  }
});

test('無効な値はnullを返す', () => {
  expect(CSSColor.parse('invalid')).toBeNull();
  expect(CSSColor.parse('rgb(300, 0, 0)')).toBeNull(); // 範囲外
  expect(CSSColor.parse('notacolor')).toBeNull();
});