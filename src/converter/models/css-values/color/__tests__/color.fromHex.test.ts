import { test, expect } from 'vitest';
import { CSSColor } from '../color';

test('6文字のHEX値からCSSColor型を作成できる', () => {
  const color = CSSColor.fromHex('#FF0000');
  expect(color).toBeDefined();
  if (color) {
    const rgb = CSSColor.toRGB(color);
    expect(rgb).toEqual({ r: 255, g: 0, b: 0 });
  }
});

test('3文字のHEX値からCSSColor型を作成できる', () => {
  const color = CSSColor.fromHex('#F00');
  expect(color).toBeDefined();
  if (color) {
    const rgb = CSSColor.toRGB(color);
    expect(rgb).toEqual({ r: 255, g: 0, b: 0 });
  }
});

test('小文字のHEX値も処理できる', () => {
  const color = CSSColor.fromHex('#ff0000');
  expect(color).toBeDefined();
  if (color) {
    const rgb = CSSColor.toRGB(color);
    expect(rgb).toEqual({ r: 255, g: 0, b: 0 });
  }
});

test('#記号なしのHEX値も処理できる', () => {
  const color = CSSColor.fromHex('00FF00');
  expect(color).toBeDefined();
  if (color) {
    const rgb = CSSColor.toRGB(color);
    expect(rgb).toEqual({ r: 0, g: 255, b: 0 });
  }
});

test('無効なHEX値はnullを返す', () => {
  expect(CSSColor.fromHex('#GGGGGG')).toBeNull();
  expect(CSSColor.fromHex('#12')).toBeNull();
  expect(CSSColor.fromHex('invalid')).toBeNull();
});