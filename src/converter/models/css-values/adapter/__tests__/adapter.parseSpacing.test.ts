import { test, expect, beforeEach, afterEach } from 'vitest';
import { CSSValueAdapter } from '../adapter';

beforeEach(() => {
  CSSValueAdapter.resetContext();
});

afterEach(() => {
  CSSValueAdapter.resetContext();
});

test('ピクセル値をパースできる', () => {
  expect(CSSValueAdapter.parseSpacing('20px')).toBe(20);
  expect(CSSValueAdapter.parseSpacing('0px')).toBe(0);
});

test('rem単位をピクセルに変換する', () => {
  expect(CSSValueAdapter.parseSpacing('1rem')).toBe(16);
  expect(CSSValueAdapter.parseSpacing('2.5rem')).toBe(40);
});

test('calc()式を評価する', () => {
  expect(CSSValueAdapter.parseSpacing('calc(1rem + 5px)')).toBe(21);
});

test('デフォルト値を返す', () => {
  expect(CSSValueAdapter.parseSpacing(undefined)).toBe(0);
  expect(CSSValueAdapter.parseSpacing(undefined, 10)).toBe(10);
  expect(CSSValueAdapter.parseSpacing('invalid', 5)).toBe(5);
});