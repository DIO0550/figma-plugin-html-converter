import { test, expect } from 'vitest';
import { HTML } from '../html';

test.each([
  ['', true],
  ['   ', true],
  ['\t\n', true],
])('HTML.isEmpty: 空文字列"%s"を判定できる', (input, expected) => {
  expect(HTML.isEmpty(input)).toBe(expected);
});

test.each([
  ['<div>Hello</div>', false],
  ['Hello', false],
  ['  <p>Text</p>  ', false],
])('HTML.isEmpty: 内容がある文字列"%s"を判定できる', (input, expected) => {
  expect(HTML.isEmpty(input)).toBe(expected);
});

test('HTML.isEmpty: HTML型でも動作する', () => {
  const emptyHtml = HTML.from('');
  const contentHtml = HTML.from('<div>Content</div>');
  expect(HTML.isEmpty(emptyHtml)).toBe(true);
  expect(HTML.isEmpty(contentHtml)).toBe(false);
});