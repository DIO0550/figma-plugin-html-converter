import { test, expect } from 'vitest';
import { HTMLNode } from '../html-node';

test('HTMLNode.appendChild: 子ノードを追加できる', () => {
  const parent = HTMLNode.createElement('div');
  const child = HTMLNode.createElement('span');

  HTMLNode.appendChild(parent, child);

  expect(parent.children).toHaveLength(1);
  expect(parent.children?.[0]).toBe(child);
});

test('HTMLNode.getTextContent: 全てのテキストを取得できる', () => {
  const parent = HTMLNode.createElement('div');
  const text1 = HTMLNode.createText('Hello ');
  const span = HTMLNode.createElement('span');
  const text2 = HTMLNode.createText('World');

  HTMLNode.appendChild(parent, text1);
  HTMLNode.appendChild(parent, span);
  HTMLNode.appendChild(span, text2);

  expect(HTMLNode.getTextContent(parent)).toBe('Hello World');
});

test('HTMLNode.hasChildren: 子ノードの有無を判定できる', () => {
  const parent = HTMLNode.createElement('div');
  const child = HTMLNode.createElement('span');

  expect(HTMLNode.hasChildren(parent)).toBe(false);
  
  HTMLNode.appendChild(parent, child);
  
  expect(HTMLNode.hasChildren(parent)).toBe(true);
});