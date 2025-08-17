import { test, expect } from 'vitest';
import { HTMLNode } from '../html-node';

test('HTMLNode.isElement: 要素ノードを正しく判定する', () => {
  const element = HTMLNode.createElement('div');
  const text = HTMLNode.createText('hello');

  expect(HTMLNode.isElement(element)).toBe(true);
  expect(HTMLNode.isElement(text)).toBe(false);
});

test('HTMLNode.isText: テキストノードを正しく判定する', () => {
  const element = HTMLNode.createElement('div');
  const text = HTMLNode.createText('hello');

  expect(HTMLNode.isText(text)).toBe(true);
  expect(HTMLNode.isText(element)).toBe(false);
});