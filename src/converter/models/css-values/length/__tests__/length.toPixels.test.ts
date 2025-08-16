import { test, expect } from 'vitest';
import { CSSLength } from '../length';

test('px値をそのまま返す', () => {
  const length = CSSLength.from(100, 'px');
  expect(CSSLength.toPixels(length)).toBe(100);
});

test('rem値を変換する', () => {
  const length = CSSLength.from(2, 'rem');
  expect(CSSLength.toPixels(length)).toBe(32); // 2 * 16
  expect(CSSLength.toPixels(length, { fontSize: 20 })).toBe(40); // 2 * 20
});

test('em値を変換する', () => {
  const length = CSSLength.from(1.5, 'em');
  expect(CSSLength.toPixels(length)).toBe(24); // 1.5 * 16
  expect(CSSLength.toPixels(length, { fontSize: 14 })).toBe(21); // 1.5 * 14
});

test('vw値を変換する', () => {
  const length = CSSLength.from(50, 'vw');
  expect(CSSLength.toPixels(length)).toBe(960); // 50% of 1920
  expect(CSSLength.toPixels(length, { viewportWidth: 1440 })).toBe(720); // 50% of 1440
});

test('vh値を変換する', () => {
  const length = CSSLength.from(25, 'vh');
  expect(CSSLength.toPixels(length)).toBe(270); // 25% of 1080
  expect(CSSLength.toPixels(length, { viewportHeight: 800 })).toBe(200); // 25% of 800
});