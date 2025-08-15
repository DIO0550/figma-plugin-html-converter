import { test, expect } from 'vitest';
import { Attributes } from '../attributes';

test('id属性を取得できる', () => {
  const attrs = Attributes.from({ id: 'main' });
  expect(Attributes.getId(attrs)).toBe('main');
});

test('style属性を取得できる', () => {
  const attrs = Attributes.from({ style: 'color: red;' });
  expect(Attributes.getStyle(attrs)).toBe('color: red;');
});