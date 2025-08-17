import { test, expect } from 'vitest';
import { HTML } from '../html';

test.each([
  ['  <div>Hello</div>  ', '<div>Hello</div>'],
  ['\n\t<p>Text</p>\n\t', '<p>Text</p>'],
])('HTML.normalize: 前後の空白を削除する "%s" → "%s"', (input, expected) => {
  expect(HTML.normalize(input)).toBe(expected);
});

test('HTML.normalize: HTML型でも動作する', () => {
  const html = HTML.from('  <div>Hello</div>  ');
  expect(HTML.normalize(html)).toBe('<div>Hello</div>');
});