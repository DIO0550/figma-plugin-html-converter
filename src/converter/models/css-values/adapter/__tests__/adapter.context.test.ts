import { test, expect, beforeEach, afterEach } from 'vitest';
import { CSSValueAdapter } from '../adapter';

beforeEach(() => {
  CSSValueAdapter.resetContext();
});

afterEach(() => {
  CSSValueAdapter.resetContext();
});

test('コンテキストを設定できる', () => {
  CSSValueAdapter.setContext({
    viewportWidth: 1000,
    viewportHeight: 800,
    fontSize: 20
  });

  expect(CSSValueAdapter.parseSize('50vw')).toBe(500);
  expect(CSSValueAdapter.parseSize('50vh')).toBe(400);
  expect(CSSValueAdapter.parseSize('2rem')).toBe(40);
});

test('部分的にコンテキストを更新できる', () => {
  CSSValueAdapter.setContext({ fontSize: 24 });
  
  expect(CSSValueAdapter.parseSize('1rem')).toBe(24);
  expect(CSSValueAdapter.parseSize('100vw')).toBe(1920);
});

test('リセットでデフォルト値に戻る', () => {
  CSSValueAdapter.setContext({
    viewportWidth: 1000,
    viewportHeight: 800,
    fontSize: 20
  });

  CSSValueAdapter.resetContext();

  expect(CSSValueAdapter.parseSize('100vw')).toBe(1920);
  expect(CSSValueAdapter.parseSize('100vh')).toBe(1080);
  expect(CSSValueAdapter.parseSize('1rem')).toBe(16);
});