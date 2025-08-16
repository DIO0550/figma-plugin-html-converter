import { test, expect, beforeEach, afterEach } from 'vitest';
import { CSSValueAdapter } from '../adapter';

beforeEach(() => {
  CSSValueAdapter.resetContext();
});

afterEach(() => {
  CSSValueAdapter.resetContext();
});

test('1つの値（全方向同じ）', () => {
  const result = CSSValueAdapter.parsePadding('10px');
  expect(result).toEqual({
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  });
});

test('2つの値（上下、左右）', () => {
  const result = CSSValueAdapter.parsePadding('10px 20px');
  expect(result).toEqual({
    top: 10,
    right: 20,
    bottom: 10,
    left: 20
  });
});

test('3つの値（上、左右、下）', () => {
  const result = CSSValueAdapter.parsePadding('10px 20px 30px');
  expect(result).toEqual({
    top: 10,
    right: 20,
    bottom: 30,
    left: 20
  });
});

test('4つの値（上、右、下、左）', () => {
  const result = CSSValueAdapter.parsePadding('10px 20px 30px 40px');
  expect(result).toEqual({
    top: 10,
    right: 20,
    bottom: 30,
    left: 40
  });
});

test('calc()を含むパディングをパースする', () => {
  const result = CSSValueAdapter.parsePadding('calc(1rem + 5px)');
  expect(result).toEqual({
    top: 21,
    right: 21,
    bottom: 21,
    left: 21
  });
});

test('様々な単位の混在をパースする', () => {
  const result = CSSValueAdapter.parsePadding('10px 1rem 20px 2rem');
  expect(result).toEqual({
    top: 10,
    right: 16,
    bottom: 20,
    left: 32
  });
});

test('無効な値はnullを返す', () => {
  expect(CSSValueAdapter.parsePadding('')).toBeNull();
  expect(CSSValueAdapter.parsePadding(undefined)).toBeNull();
  expect(CSSValueAdapter.parsePadding('auto')).toBeNull();
});