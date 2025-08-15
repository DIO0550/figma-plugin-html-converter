import { test, expect } from 'vitest';
import { Attributes } from '../attributes';

test('オブジェクトからAttributes型を作成できる', () => {
  const attrs = Attributes.from({ id: 'test', class: 'container' });
  expect(attrs).toEqual({ id: 'test', class: 'container' });
});

test('空のAttributesを作成できる', () => {
  const attrs = Attributes.empty();
  expect(attrs).toEqual({});
  expect(Attributes.isEmpty(attrs)).toBe(true);
});