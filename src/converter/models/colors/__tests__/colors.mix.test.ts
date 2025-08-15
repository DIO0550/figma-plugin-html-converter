import { test, expect } from 'vitest';
import { Colors } from '../colors';

test('2つの色を50:50で混合できる', () => {
  const color1 = { r: 1, g: 0, b: 0 }; // 赤
  const color2 = { r: 0, g: 0, b: 1 }; // 青
  const mixed = Colors.mix(color1, color2);
  
  expect(mixed.r).toBeCloseTo(0.5);
  expect(mixed.g).toBeCloseTo(0);
  expect(mixed.b).toBeCloseTo(0.5);
});

test('指定したウェイトで色を混合できる', () => {
  const color1 = { r: 1, g: 0, b: 0 }; // 赤
  const color2 = { r: 0, g: 0, b: 1 }; // 青
  const mixed = Colors.mix(color1, color2, 0.25); // 75%赤、25%青
  
  expect(mixed.r).toBeCloseTo(0.75);
  expect(mixed.g).toBeCloseTo(0);
  expect(mixed.b).toBeCloseTo(0.25);
});

test('ウェイト0で最初の色のみを返す', () => {
  const color1 = { r: 1, g: 0, b: 0 };
  const color2 = { r: 0, g: 0, b: 1 };
  const mixed = Colors.mix(color1, color2, 0);
  
  expect(mixed).toEqual(color1);
});

test('ウェイト1で2番目の色のみを返す', () => {
  const color1 = { r: 1, g: 0, b: 0 };
  const color2 = { r: 0, g: 0, b: 1 };
  const mixed = Colors.mix(color1, color2, 1);
  
  expect(mixed).toEqual(color2);
});

test('ウェイトが範囲外の場合クランプされる', () => {
  const color1 = { r: 1, g: 0, b: 0 };
  const color2 = { r: 0, g: 0, b: 1 };
  
  const mixed1 = Colors.mix(color1, color2, -0.5);
  expect(mixed1).toEqual(color1);
  
  const mixed2 = Colors.mix(color1, color2, 1.5);
  expect(mixed2).toEqual(color2);
});

test('同じ色を混合しても変わらない', () => {
  const color = { r: 0.5, g: 0.5, b: 0.5 };
  const mixed = Colors.mix(color, color, 0.7);
  
  expect(mixed).toEqual(color);
});

test('白と黒を混合するとグレーになる', () => {
  const white = { r: 1, g: 1, b: 1 };
  const black = { r: 0, g: 0, b: 0 };
  const gray = Colors.mix(white, black);
  
  expect(gray.r).toBeCloseTo(0.5);
  expect(gray.g).toBeCloseTo(0.5);
  expect(gray.b).toBeCloseTo(0.5);
});

test('3つの原色を適切に混合できる', () => {
  const red = { r: 1, g: 0, b: 0 };
  const green = { r: 0, g: 1, b: 0 };
  const yellow = Colors.mix(red, green); // 赤と緑で黄色
  
  expect(yellow.r).toBeCloseTo(0.5);
  expect(yellow.g).toBeCloseTo(0.5);
  expect(yellow.b).toBeCloseTo(0);
});