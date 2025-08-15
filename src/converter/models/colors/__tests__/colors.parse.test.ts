import { test, expect } from 'vitest';
import { Colors } from '../colors';

test('16進数カラーをパースできる', () => {
  const color = Colors.parse('#FF0000');
  expect(color).not.toBeNull();
  expect(color!.r).toBeCloseTo(1);
  expect(color!.g).toBeCloseTo(0);
  expect(color!.b).toBeCloseTo(0);
});

test('3桁の16進数カラーをパースできる', () => {
  const color = Colors.parse('#F00');
  expect(color).not.toBeNull();
  expect(color!.r).toBeCloseTo(1);
  expect(color!.g).toBeCloseTo(0);
  expect(color!.b).toBeCloseTo(0);
});

test('rgb()関数をパースできる', () => {
  const color = Colors.parse('rgb(255, 0, 0)');
  expect(color).not.toBeNull();
  expect(color!.r).toBeCloseTo(1);
  expect(color!.g).toBeCloseTo(0);
  expect(color!.b).toBeCloseTo(0);
});

test('rgba()関数をパースできる', () => {
  const color = Colors.parse('rgba(255, 0, 0, 0.5)');
  expect(color).not.toBeNull();
  expect(color!.r).toBeCloseTo(1);
  expect(color!.g).toBeCloseTo(0);
  expect(color!.b).toBeCloseTo(0);
});

test('名前付きカラーをパースできる', () => {
  const color = Colors.parse('red');
  expect(color).not.toBeNull();
  expect(color!.r).toBeCloseTo(1);
  expect(color!.g).toBeCloseTo(0);
  expect(color!.b).toBeCloseTo(0);
});

test('前後の空白を無視してパースできる', () => {
  const color = Colors.parse('  #FF0000  ');
  expect(color).not.toBeNull();
  expect(color!.r).toBeCloseTo(1);
});

test('大文字小文字を区別せずに名前付きカラーをパースできる', () => {
  const color1 = Colors.parse('RED');
  const color2 = Colors.parse('Red');
  const color3 = Colors.parse('red');
  
  expect(color1).toEqual(color2);
  expect(color2).toEqual(color3);
});

test('不正なカラー文字列はnullを返す', () => {
  expect(Colors.parse('invalid')).toBeNull();
  expect(Colors.parse('#GGGGGG')).toBeNull();
  expect(Colors.parse('rgb(invalid)')).toBeNull();
  expect(Colors.parse('')).toBeNull();
});

test('複雑なrgb()関数をパースできる', () => {
  const color = Colors.parse('rgb(  128  ,  128  ,  128  )');
  expect(color).not.toBeNull();
  expect(color!.r).toBeCloseTo(0.5019607843137255);
  expect(color!.g).toBeCloseTo(0.5019607843137255);
  expect(color!.b).toBeCloseTo(0.5019607843137255);
});

test('範囲外のRGB値を含むrgb()関数を正しく処理できる', () => {
  const color = Colors.parse('rgb(256, 300, -10)');
  expect(color).not.toBeNull();
  expect(color!.r).toBe(1); // 256 -> クランプされて255 -> 1
  expect(color!.g).toBe(1); // 300 -> クランプされて255 -> 1
  expect(color!.b).toBe(0); // -10 -> クランプされて0 -> 0
});

test('様々な形式のカラーをパースできる', () => {
  const colors = [
    { input: '#808080', expected: { r: 0.5019607843137255, g: 0.5019607843137255, b: 0.5019607843137255 } },
    { input: 'rgb(128, 128, 128)', expected: { r: 0.5019607843137255, g: 0.5019607843137255, b: 0.5019607843137255 } },
    { input: 'gray', expected: { r: 0.5019607843137255, g: 0.5019607843137255, b: 0.5019607843137255 } }
  ];
  
  for (const { input, expected } of colors) {
    const color = Colors.parse(input);
    expect(color).not.toBeNull();
    expect(color!.r).toBeCloseTo(expected.r);
    expect(color!.g).toBeCloseTo(expected.g);
    expect(color!.b).toBeCloseTo(expected.b);
  }
});