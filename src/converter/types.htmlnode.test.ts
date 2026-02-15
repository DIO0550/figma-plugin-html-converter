import { test, expect } from 'vitest';
import type { HTMLNode } from './types';

test('HTMLNode型 - 要素ノード - 正しい構造を持つ', () => {
  const htmlNode: HTMLNode = {
    type: 'element',
    tagName: 'div',
    attributes: { class: 'container' },
    children: [],
    textContent: undefined
  };

  expect(htmlNode.type).toBe('element');
  expect(htmlNode.tagName).toBe('div');
  expect(htmlNode.attributes).toEqual({ class: 'container' });
  expect(htmlNode.children).toEqual([]);
});

test('HTMLNode型 - テキストノード - 表現できる', () => {
  const textNode: HTMLNode = {
    type: 'text',
    textContent: 'Hello World'
  };

  expect(textNode.type).toBe('text');
  expect(textNode.textContent).toBe('Hello World');
});
