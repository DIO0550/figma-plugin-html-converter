import { describe, test, expect } from 'vitest';
import { DivElement } from '../div-element';
import type { DivElement as DivElementType } from '../div-element';

// mapToFigmaメソッドのテスト
test('DivElement型の要素を正しく変換できる', () => {
  const element: DivElementType = {
    type: 'element',
    tagName: 'div',
    attributes: { id: 'test' },
    children: []
  };
  
  const node = DivElement.mapToFigma(element);
  
  expect(node).not.toBeNull();
  expect(node?.type).toBe('FRAME');
  expect(node?.name).toBe('#test');
});

test('HTMLNode互換の構造から変換できる', () => {
  const htmlNode = {
    type: 'element',
    tagName: 'div',
    attributes: { class: 'container' }
  };
  
  const node = DivElement.mapToFigma(htmlNode);
  
  expect(node).not.toBeNull();
  expect(node?.type).toBe('FRAME');
  expect(node?.name).toBe('.container');
});

// test.eachを使用した無効な要素のテスト
test.each([
  { type: 'element', tagName: 'span', attributes: {} },
  { type: 'text', tagName: 'div', attributes: {} },
  null,
  undefined,
  'div',
  123,
  true
])('無効な要素%pの場合はnullを返す', (input) => {
  const node = DivElement.mapToFigma(input);
  expect(node).toBeNull();
});

test('attributesがない要素でも変換できる', () => {
  const element = { type: 'element', tagName: 'div' };
  const node = DivElement.mapToFigma(element);
  
  expect(node).not.toBeNull();
  expect(node?.type).toBe('FRAME');
  expect(node?.name).toBe('div');
});

test('属性を持つHTMLNode互換構造から正しく変換される', () => {
  const htmlNode = {
    type: 'element',
    tagName: 'div',
    attributes: {
      id: 'main',
      class: 'wrapper',
      style: 'padding: 20px; background-color: #f0f0f0;'
    }
  };
  
  const node = DivElement.mapToFigma(htmlNode);
  
  expect(node).not.toBeNull();
  expect(node?.type).toBe('FRAME');
  expect(node?.name).toBe('#main');
  expect(node?.paddingTop).toBe(20);
  expect(node?.fills?.[0]).toMatchObject({
    type: 'SOLID',
    color: { r: 0.9411764705882353, g: 0.9411764705882353, b: 0.9411764705882353 }
  });
});