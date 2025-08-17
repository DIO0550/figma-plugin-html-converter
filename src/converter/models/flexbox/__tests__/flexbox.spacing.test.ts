import { test, expect } from 'vitest';
import { Flexbox } from '../flexbox';

test.each([
  ['10px', 10],
  ['20.5px', 20.5],
])('Flexbox.parseSpacing: ピクセル値%sを%iにパースできる', (input, expected) => {
  expect(Flexbox.parseSpacing(input)).toBe(expected);
});

test('Flexbox.parseSpacing: 単位なしの値をパースできる', () => {
  expect(Flexbox.parseSpacing('15')).toBe(15);
});

test.each([
  [undefined, 0],
  ['', 0],
  ['auto', 0],
])('Flexbox.parseSpacing: 無効な値%sの場合0を返す', (input, expected) => {
  expect(Flexbox.parseSpacing(input)).toBe(expected);
});