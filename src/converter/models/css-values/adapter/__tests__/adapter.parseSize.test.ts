import { test, expect, beforeEach, afterEach } from 'vitest';
import { CSSValueAdapter } from '../adapter';

beforeEach(() => {
  CSSValueAdapter.resetContext();
});

afterEach(() => {
  CSSValueAdapter.resetContext();
});

test('ピクセル値をパースできる', () => {
  expect(CSSValueAdapter.parseSize('100px')).toBe(100);
  expect(CSSValueAdapter.parseSize('42.5px')).toBe(42.5);
});

test('パーセンテージ値をパースできる', () => {
  const result = CSSValueAdapter.parseSize('50%');
  expect(result).toEqual({ value: 50, unit: '%' });
});

test('rem単位をピクセルに変換する', () => {
  expect(CSSValueAdapter.parseSize('2rem')).toBe(32);
  expect(CSSValueAdapter.parseSize('1.5rem')).toBe(24);
});

test('em単位をピクセルに変換する', () => {
  expect(CSSValueAdapter.parseSize('2em')).toBe(32);
  expect(CSSValueAdapter.parseSize('0.5em')).toBe(8);
});

test('vw単位をピクセルに変換する', () => {
  expect(CSSValueAdapter.parseSize('50vw')).toBe(960);
  expect(CSSValueAdapter.parseSize('100vw')).toBe(1920);
});

test('vh単位をピクセルに変換する', () => {
  expect(CSSValueAdapter.parseSize('50vh')).toBe(540);
  expect(CSSValueAdapter.parseSize('100vh')).toBe(1080);
});

test('calc()式を評価する', () => {
  expect(CSSValueAdapter.parseSize('calc(2rem + 10px)')).toBe(42);
  expect(CSSValueAdapter.parseSize('calc(100vh - 100px)')).toBe(980);
});

test('calc(100% - Xpx)をパーセンテージとして扱う', () => {
  const result = CSSValueAdapter.parseSize('calc(100% - 40px)');
  expect(result).toEqual({ value: 100, unit: '%' });
});

test('単位なしの数値をピクセルとして扱う', () => {
  expect(CSSValueAdapter.parseSize('200')).toBe(200);
  expect(CSSValueAdapter.parseSize('42')).toBe(42);
});

test('特殊な値はnullを返す', () => {
  expect(CSSValueAdapter.parseSize('auto')).toBeNull();
  expect(CSSValueAdapter.parseSize('inherit')).toBeNull();
  expect(CSSValueAdapter.parseSize('initial')).toBeNull();
});

test('無効な値はnullを返す', () => {
  expect(CSSValueAdapter.parseSize('invalid')).toBeNull();
  expect(CSSValueAdapter.parseSize('')).toBeNull();
  expect(CSSValueAdapter.parseSize(undefined)).toBeNull();
});