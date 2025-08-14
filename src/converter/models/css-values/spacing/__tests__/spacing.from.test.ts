import { test, expect } from 'vitest';
import { CSSSpacing } from '../spacing';

test('CSSSpacing.from - ピクセル値からCSSSpacing型を作成できる', () => {
  const spacing = CSSSpacing.from(10);
  expect(spacing).toBeDefined();
  expect(CSSSpacing.getValue(spacing)).toBe(10);
});

test('CSSSpacing.from - 負の値は0にクランプされる', () => {
  const spacing = CSSSpacing.from(-10);
  expect(CSSSpacing.getValue(spacing)).toBe(0);
});

test('CSSSpacing.from - ゼロ値を作成できる', () => {
  const spacing = CSSSpacing.from(0);
  expect(CSSSpacing.getValue(spacing)).toBe(0);
});