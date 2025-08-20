import { test, expect } from 'vitest';
import type { DivAttributes } from '../div-attributes';

// フラット構造のテスト
test('DivAttributesはグローバル属性を含むインターフェースである', () => {
  const attributes: DivAttributes = {
    id: 'my-div',
    class: 'container',
    style: 'background-color: blue;',
    title: 'Container div',
    lang: 'ja',
    dir: 'ltr',
    hidden: false,
    tabindex: '0',
    role: 'main',
    'data-testid': 'test-div',
    'aria-label': 'Main container'
  };

  expect(attributes.id).toBe('my-div');
  expect(attributes.class).toBe('container');
  expect(attributes.style).toBe('background-color: blue;');
  expect(attributes['data-testid']).toBe('test-div');
  expect(attributes['aria-label']).toBe('Main container');
});

test('DivAttributesの全ての属性はオプショナルである', () => {
  const emptyAttributes: DivAttributes = {};
  expect(emptyAttributes).toEqual({});
});

// test.eachを使用したdata属性のパラメータ化テスト
test.each([
  ['data-foo', 'bar'],
  ['data-baz', 'qux'],
  ['data-test-id', '12345'],
  ['data-custom-prop', 'value']
])('data属性 %s を値 %s で設定できる', (key, value) => {
  const attributes: DivAttributes = {
    [key]: value
  };
  
  expect(attributes[key]).toBe(value);
});

// test.eachを使用したaria属性のパラメータ化テスト
test.each([
  ['aria-hidden', 'true'],
  ['aria-expanded', 'false'],
  ['aria-label', 'Navigation menu'],
  ['aria-describedby', 'help-text']
])('aria属性 %s を値 %s で設定できる', (key, value) => {
  const attributes: DivAttributes = {
    [key]: value
  };
  
  expect(attributes[key]).toBe(value);
});