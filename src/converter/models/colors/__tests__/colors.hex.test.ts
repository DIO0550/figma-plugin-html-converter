import { test, expect } from 'vitest';
import { Colors } from '../colors';

test('6桁の16進数カラーからRGBに変換できる', () => {
  const color = Colors.fromHex('#FF8040');
  expect(color).not.toBeNull();
  expect(color!.r).toBeCloseTo(1);
  expect(color!.g).toBeCloseTo(0.5019607843137255);
  expect(color!.b).toBeCloseTo(0.25098039215686274);
});

test('3桁の16進数カラーからRGBに変換できる', () => {
  const color = Colors.fromHex('#F84');
  expect(color).not.toBeNull();
  expect(color!.r).toBeCloseTo(1);
  expect(color!.g).toBeCloseTo(0.5333333333333333);
  expect(color!.b).toBeCloseTo(0.26666666666666666);
});

test('#なしの16進数カラーを処理できる', () => {
  const color = Colors.fromHex('FF8040');
  expect(color).not.toBeNull();
  expect(color!.r).toBeCloseTo(1);
  expect(color!.g).toBeCloseTo(0.5019607843137255);
  expect(color!.b).toBeCloseTo(0.25098039215686274);
});

test('小文字の16進数カラーを処理できる', () => {
  const color = Colors.fromHex('#ff8040');
  expect(color).not.toBeNull();
  expect(color!.r).toBeCloseTo(1);
});

test('不正な16進数カラーはnullを返す', () => {
  expect(Colors.fromHex('#GGGGGG')).toBeNull();
  expect(Colors.fromHex('#FF')).toBeNull();
  expect(Colors.fromHex('#FFFFFFF')).toBeNull();
  expect(Colors.fromHex('invalid')).toBeNull();
});

test('RGBから16進数カラーに変換できる', () => {
  const color = { r: 1, g: 0.5019607843137255, b: 0.25098039215686274 };
  const hex = Colors.toHex(color);
  expect(hex).toBe('#ff8040');
});

test('黒色を16進数に変換できる', () => {
  const color = { r: 0, g: 0, b: 0 };
  const hex = Colors.toHex(color);
  expect(hex).toBe('#000000');
});

test('白色を16進数に変換できる', () => {
  const color = { r: 1, g: 1, b: 1 };
  const hex = Colors.toHex(color);
  expect(hex).toBe('#ffffff');
});

test('小数値を含むRGBを正しく16進数に変換できる', () => {
  const color = { r: 0.5, g: 0.5, b: 0.5 };
  const hex = Colors.toHex(color);
  expect(hex).toBe('#808080');
});