import { test, expect } from 'vitest';
import { Attributes } from '../attributes';

test('単一の属性をパースできる', () => {
  const attrs = Attributes.parse('id="test"');
  expect(attrs).toEqual({ id: 'test' });
});

test('複数の属性をパースできる', () => {
  const attrs = Attributes.parse('id="test" class="container"');
  expect(attrs).toEqual({ id: 'test', class: 'container' });
});

test('値のない属性をパースできる', () => {
  const attrs = Attributes.parse('disabled checked');
  expect(attrs).toEqual({ disabled: '', checked: '' });
});

test('混在した属性をパースできる', () => {
  const attrs = Attributes.parse('id="main" disabled class="active"');
  expect(attrs).toEqual({ id: 'main', disabled: '', class: 'active' });
});

test('空文字列から空のAttributesを作成する', () => {
  const attrs = Attributes.parse('');
  expect(attrs).toEqual({});
});