import { test, expect, beforeEach, afterEach } from 'vitest';
import { CSSValueAdapter } from '../adapter';

beforeEach(() => {
  CSSValueAdapter.resetContext();
});

afterEach(() => {
  CSSValueAdapter.resetContext();
});

test('名前付き色をパースできる', () => {
  expect(CSSValueAdapter.parseColor('red')).toEqual({ r: 255, g: 0, b: 0 });
  expect(CSSValueAdapter.parseColor('green')).toEqual({ r: 0, g: 128, b: 0 });
  expect(CSSValueAdapter.parseColor('blue')).toEqual({ r: 0, g: 0, b: 255 });
});

test('HEX値をパースできる', () => {
  expect(CSSValueAdapter.parseColor('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
  expect(CSSValueAdapter.parseColor('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
  expect(CSSValueAdapter.parseColor('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
});

test('rgb()関数をパースできる', () => {
  expect(CSSValueAdapter.parseColor('rgb(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0 });
  expect(CSSValueAdapter.parseColor('rgb(128, 128, 128)')).toEqual({ r: 128, g: 128, b: 128 });
});

test('無効な値はnullを返す', () => {
  expect(CSSValueAdapter.parseColor('')).toBeNull();
  expect(CSSValueAdapter.parseColor(undefined)).toBeNull();
  expect(CSSValueAdapter.parseColor('invalid')).toBeNull();
});