import { test, expect } from 'vitest';
import { DivElement } from '../div-element';

// ファクトリメソッドのテスト
test('空の属性でdiv要素を作成できる', () => {
  const element = DivElement.create();
  
  expect(element.type).toBe('element');
  expect(element.tagName).toBe('div');
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test('ID属性を指定してdiv要素を作成できる', () => {
  const element = DivElement.create({ id: 'test-id' });
  
  expect(element.attributes.id).toBe('test-id');
});

test('class属性を指定してdiv要素を作成できる', () => {
  const element = DivElement.create({ class: 'test-class' });
  
  expect(element.attributes.class).toBe('test-class');
});

test('style属性を指定してdiv要素を作成できる', () => {
  const element = DivElement.create({ style: 'color: red;' });
  
  expect(element.attributes.style).toBe('color: red;');
});

// test.eachを使用した複数属性のテスト
test.each([
  { id: 'header', class: 'container', style: 'padding: 10px;' },
  { 'data-testid': 'test', 'data-value': '123' },
  { 'aria-label': 'Main content', 'aria-hidden': 'false' },
  { role: 'main', tabindex: '0' }
])('複数の属性%pを含むdiv要素を作成できる', (attributes) => {
  const element = DivElement.create(attributes);
  
  Object.entries(attributes).forEach(([key, value]) => {
    expect(element.attributes[key]).toBe(value);
  });
});