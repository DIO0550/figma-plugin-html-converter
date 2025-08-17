import { test, expect } from 'vitest';
import { HTMLNode } from '../html-node';

test('HTMLNode.createElement: 要素ノードを作成できる', () => {
  const node = HTMLNode.createElement('div', { class: 'container' });

  expect(node.type).toBe('element');
  expect(node.tagName).toBe('div');
  expect(node.attributes?.class).toBe('container');
  expect(node.children).toEqual([]);
});

test('HTMLNode.createText: テキストノードを作成できる', () => {
  const node = HTMLNode.createText('Hello World');

  expect(node.type).toBe('text');
  expect(node.textContent).toBe('Hello World');
});

test('HTMLNode.createComment: コメントノードを作成できる', () => {
  const node = HTMLNode.createComment('This is a comment');

  expect(node.type).toBe('comment');
  expect(node.textContent).toBe('This is a comment');
});