import { test, expect } from 'vitest';
import { Attributes } from '../attributes';

test('クラスを追加できる', () => {
  const attrs = Attributes.empty();
  const updated = Attributes.addClass(attrs, 'active');
  expect(updated.class).toBe('active');
});

test('既存のクラスに追加できる', () => {
  const attrs = Attributes.from({ class: 'container' });
  const updated = Attributes.addClass(attrs, 'active');
  expect(updated.class).toBe('container active');
});

test('重複するクラスは追加されない', () => {
  const attrs = Attributes.from({ class: 'active container' });
  const updated = Attributes.addClass(attrs, 'active');
  expect(updated.class).toBe('active container');
});

test('クラスを削除できる', () => {
  const attrs = Attributes.from({ class: 'container active' });
  const updated = Attributes.removeClass(attrs, 'active');
  expect(updated.class).toBe('container');
});

test('最後のクラスを削除するとclass属性も削除される', () => {
  const attrs = Attributes.from({ class: 'active' });
  const updated = Attributes.removeClass(attrs, 'active');
  expect(updated.class).toBeUndefined();
});