import { test, expect } from 'vitest';
import { HTML } from '../html';

test.each([
  ['<div>Hello</div>', true],
  ['<p>Text</p>', true],
  ['', true],
])('HTML.isValid: 有効なHTML "%s" を判定できる', (input, expected) => {
  expect(HTML.isValid(input)).toBe(expected);
});

test.each([
  ['<div>Hello', false],
  ['<div><p>Text</div>', false],
])('HTML.isValid: 不完全なHTML "%s" を検出できる', (input, expected) => {
  expect(HTML.isValid(input)).toBe(expected);
});