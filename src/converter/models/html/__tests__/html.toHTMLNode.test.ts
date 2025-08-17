import { test, expect } from 'vitest';
import { HTML } from '../html';

test('HTML.toHTMLNode: HTMLからHTMLNodeに変換できる', () => {
  const html = HTML.from('<div>Hello</div>');
  const node = HTML.toHTMLNode(html);

  expect(node.type).toBe('element');
  expect(node.tagName).toBe('div');
  expect(node.children).toHaveLength(1);
  expect(node.children?.[0]).toEqual({
    type: 'text',
    textContent: 'Hello'
  });
});

test('HTML.toHTMLNode: 空のHTMLはrootノードになる', () => {
  const html = HTML.from('');
  const node = HTML.toHTMLNode(html);

  expect(node.type).toBe('element');
  expect(node.tagName).toBe('root');
  expect(node.children).toHaveLength(0);
});

test('HTML.toHTMLNode: 属性付きのHTMLを変換できる', () => {
  const html = HTML.from('<div class="test" id="main">Content</div>');
  const node = HTML.toHTMLNode(html);

  expect(node.attributes).toEqual({
    class: 'test',
    id: 'main'
  });
});

test('HTML.toHTMLNode: ネストされたHTMLを変換できる', () => {
  const html = HTML.from('<div><p>Text</p><span>More</span></div>');
  const node = HTML.toHTMLNode(html);

  expect(node.children).toHaveLength(2);
  expect(node.children?.[0].tagName).toBe('p');
  expect(node.children?.[1].tagName).toBe('span');
});