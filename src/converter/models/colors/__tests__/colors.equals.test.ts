import { test, expect } from 'vitest';
import { Colors } from '../colors';

test('同じ色が等しいと判定される', () => {
  const color1 = { r: 0.5, g: 0.5, b: 0.5 };
  const color2 = { r: 0.5, g: 0.5, b: 0.5 };
  
  expect(Colors.equals(color1, color2)).toBe(true);
});

test('異なる色が等しくないと判定される', () => {
  const color1 = { r: 1, g: 0, b: 0 };
  const color2 = { r: 0, g: 0, b: 1 };
  
  expect(Colors.equals(color1, color2)).toBe(false);
});

test('デフォルトの許容誤差内の色が等しいと判定される', () => {
  const color1 = { r: 0.5, g: 0.5, b: 0.5 };
  const color2 = { r: 0.5005, g: 0.5005, b: 0.5005 };
  
  expect(Colors.equals(color1, color2)).toBe(true); // デフォルト許容誤差は0.001
});

test('デフォルトの許容誤差を超える色が等しくないと判定される', () => {
  const color1 = { r: 0.5, g: 0.5, b: 0.5 };
  const color2 = { r: 0.502, g: 0.5, b: 0.5 };
  
  expect(Colors.equals(color1, color2)).toBe(false);
});

test('カスタム許容誤差で色を比較できる', () => {
  const color1 = { r: 0.5, g: 0.5, b: 0.5 };
  const color2 = { r: 0.55, g: 0.55, b: 0.55 };
  
  expect(Colors.equals(color1, color2, 0.1)).toBe(true);
  expect(Colors.equals(color1, color2, 0.01)).toBe(false);
});

test('一つのチャンネルだけ異なる色を正しく判定する', () => {
  const color1 = { r: 0.5, g: 0.5, b: 0.5 };
  const color2 = { r: 0.6, g: 0.5, b: 0.5 };
  
  expect(Colors.equals(color1, color2)).toBe(false);
  expect(Colors.equals(color1, color2, 0.2)).toBe(true);
});

test('黒と白が等しくないと判定される', () => {
  const black = { r: 0, g: 0, b: 0 };
  const white = { r: 1, g: 1, b: 1 };
  
  expect(Colors.equals(black, white)).toBe(false);
});

test('許容誤差0で完全一致のみ等しいと判定される', () => {
  const color1 = { r: 0.5, g: 0.5, b: 0.5 };
  const color2 = { r: 0.5, g: 0.5, b: 0.5 };
  const color3 = { r: 0.5001, g: 0.5, b: 0.5 };
  
  expect(Colors.equals(color1, color2, 0)).toBe(true);
  expect(Colors.equals(color1, color3, 0)).toBe(false);
});

test('負の値を含む色も正しく比較できる（エラーケース）', () => {
  // 通常は発生しないが、エラーケースとして
  const color1 = { r: -0.1, g: 0.5, b: 0.5 };
  const color2 = { r: -0.1, g: 0.5, b: 0.5 };
  
  expect(Colors.equals(color1, color2)).toBe(true);
});