import { test, expect } from 'vitest';
import { HTML } from '../html';

test('HTML.from: 文字列からHTML型を作成できる', () => {
  const html = HTML.from('<div>Hello</div>');
  expect(typeof html).toBe('string');
  expect(html).toBe('<div>Hello</div>');
});

test('HTML.from: 空文字列も受け入れる', () => {
  const html = HTML.from('');
  expect(html).toBe('');
});