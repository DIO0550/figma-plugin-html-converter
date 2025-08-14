import { test, expect } from 'vitest';
import { CSSSpacing } from '../spacing';

test('CSSSpacing.parse - px単位の値をパースできる', () => {
  const spacing = CSSSpacing.parse('20px');
  expect(spacing).toBeDefined();
  if (spacing) {
    expect(CSSSpacing.getValue(spacing)).toBe(20);
  }
});

test('CSSSpacing.parse - rem単位の値をパースできる', () => {
  const spacing = CSSSpacing.parse('2rem');
  expect(spacing).toBeDefined();
  if (spacing) {
    expect(CSSSpacing.getValue(spacing)).toBe(32); // 2 * 16
  }
});

test('CSSSpacing.parse - em単位の値をパースできる', () => {
  const spacing = CSSSpacing.parse('1.5em', { fontSize: 20 });
  expect(spacing).toBeDefined();
  if (spacing) {
    expect(CSSSpacing.getValue(spacing)).toBe(30); // 1.5 * 20
  }
});

test('CSSSpacing.parse - vw単位の値をパースできる', () => {
  const spacing = CSSSpacing.parse('5vw', { viewportWidth: 1000 });
  expect(spacing).toBeDefined();
  if (spacing) {
    expect(CSSSpacing.getValue(spacing)).toBe(50); // 5% of 1000
  }
});

test('CSSSpacing.parse - vh単位の値をパースできる', () => {
  const spacing = CSSSpacing.parse('10vh', { viewportHeight: 800 });
  expect(spacing).toBeDefined();
  if (spacing) {
    expect(CSSSpacing.getValue(spacing)).toBe(80); // 10% of 800
  }
});

test('CSSSpacing.parse - パーセンテージは有効な値として扱う', () => {
  const spacing = CSSSpacing.parse('50%');
  expect(spacing).toBeDefined();
  if (spacing) {
    expect(CSSSpacing.getValue(spacing)).toBe(50);
  }
});

test('CSSSpacing.parse - 負の値は0にクランプされる', () => {
  const spacing = CSSSpacing.parse('-20px');
  expect(spacing).toBeDefined();
  if (spacing) {
    expect(CSSSpacing.getValue(spacing)).toBe(0);
  }
});

test('CSSSpacing.parse - 無効な文字列はnullを返す', () => {
  expect(CSSSpacing.parse('invalid')).toBeNull();
  expect(CSSSpacing.parse('auto')).toBeNull();
  expect(CSSSpacing.parse('')).toBeNull();
});