import { test, expect } from 'vitest';
import { CSSSpacing } from '../spacing';

test('CSSSpacing.parseShorthand - 単一値を全方向に適用', () => {
  const box = CSSSpacing.parseShorthand('15px');
  expect(box).toBeDefined();
  if (box) {
    expect(CSSSpacing.getValue(box.top)).toBe(15);
    expect(CSSSpacing.getValue(box.right)).toBe(15);
    expect(CSSSpacing.getValue(box.bottom)).toBe(15);
    expect(CSSSpacing.getValue(box.left)).toBe(15);
  }
});

test('CSSSpacing.parseShorthand - 2値を垂直・水平に適用', () => {
  const box = CSSSpacing.parseShorthand('10px 20px');
  expect(box).toBeDefined();
  if (box) {
    expect(CSSSpacing.getValue(box.top)).toBe(10);
    expect(CSSSpacing.getValue(box.right)).toBe(20);
    expect(CSSSpacing.getValue(box.bottom)).toBe(10);
    expect(CSSSpacing.getValue(box.left)).toBe(20);
  }
});

test('CSSSpacing.parseShorthand - 3値を上・水平・下に適用', () => {
  const box = CSSSpacing.parseShorthand('5px 10px 15px');
  expect(box).toBeDefined();
  if (box) {
    expect(CSSSpacing.getValue(box.top)).toBe(5);
    expect(CSSSpacing.getValue(box.right)).toBe(10);
    expect(CSSSpacing.getValue(box.bottom)).toBe(15);
    expect(CSSSpacing.getValue(box.left)).toBe(10);
  }
});

test('CSSSpacing.parseShorthand - 4値を各方向に適用', () => {
  const box = CSSSpacing.parseShorthand('5px 10px 15px 20px');
  expect(box).toBeDefined();
  if (box) {
    expect(CSSSpacing.getValue(box.top)).toBe(5);
    expect(CSSSpacing.getValue(box.right)).toBe(10);
    expect(CSSSpacing.getValue(box.bottom)).toBe(15);
    expect(CSSSpacing.getValue(box.left)).toBe(20);
  }
});

test('CSSSpacing.parseShorthand - 様々な単位の混在をパースできる', () => {
  const box = CSSSpacing.parseShorthand('10px 1rem 2em 5vw', {
    fontSize: 20,
    viewportWidth: 1000
  });
  expect(box).toBeDefined();
  if (box) {
    expect(CSSSpacing.getValue(box.top)).toBe(10);
    expect(CSSSpacing.getValue(box.right)).toBe(20); // 1rem = 20px (fontSize: 20)
    expect(CSSSpacing.getValue(box.bottom)).toBe(40); // 2em * 20
    expect(CSSSpacing.getValue(box.left)).toBe(50); // 5% of 1000
  }
});

test('CSSSpacing.parseShorthand - 無効な値が含まれる場合はnullを返す', () => {
  expect(CSSSpacing.parseShorthand('auto')).toBeNull();
  expect(CSSSpacing.parseShorthand('10px auto')).toBeNull();
});