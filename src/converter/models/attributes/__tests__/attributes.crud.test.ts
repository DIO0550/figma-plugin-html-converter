import { test, expect } from 'vitest';
import { Attributes } from '../attributes';

test('属性を取得できる', () => {
  const attrs = Attributes.from({ id: 'test' });
  expect(Attributes.get(attrs, 'id')).toBe('test');
  expect(Attributes.get(attrs, 'class')).toBeUndefined();
});

test('属性を設定できる', () => {
  const attrs = Attributes.empty();
  const updated = Attributes.set(attrs, 'id', 'test');
  expect(updated.id).toBe('test');
});

test('属性を削除できる', () => {
  const attrs = Attributes.from({ id: 'test', class: 'container' });
  const updated = Attributes.remove(attrs, 'id');
  expect(updated).toEqual({ class: 'container' });
});