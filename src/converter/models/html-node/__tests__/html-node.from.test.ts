import { test, expect } from 'vitest';
import { HTMLNode } from '../html-node';
import { HTML } from '../../html';

test('HTMLNode.from: HTML型からHTMLNodeを作成できる', () => {
  const html = HTML.from('<div>Hello</div>');
  const node = HTMLNode.from(html);

  expect(HTMLNode.isElement(node)).toBe(true);
  expect(node.tagName).toBe('div');
  expect(HTMLNode.getTextContent(node)).toBe('Hello');
});

test('HTMLNode.from: 空のHTMLからrootノードを作成する', () => {
  const html = HTML.from('');
  const node = HTMLNode.from(html);

  expect(HTMLNode.isElement(node)).toBe(true);
  expect(node.tagName).toBe('root');
  expect(node.children).toEqual([]);
});