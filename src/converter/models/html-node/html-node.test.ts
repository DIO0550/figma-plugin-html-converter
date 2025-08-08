import { describe, test, expect } from 'vitest';
import { HTMLNode } from './html-node';
import { HTML } from '../html';

describe('HTMLNode', () => {
  describe('from', () => {
    test('HTML型からHTMLNodeを作成できる', () => {
      const html = HTML.from('<div>Hello</div>');
      const node = HTMLNode.from(html);

      expect(HTMLNode.isElement(node)).toBe(true);
      expect(node.tagName).toBe('div');
      expect(HTMLNode.getTextContent(node)).toBe('Hello');
    });

    test('空のHTMLからrootノードを作成する', () => {
      const html = HTML.from('');
      const node = HTMLNode.from(html);

      expect(HTMLNode.isElement(node)).toBe(true);
      expect(node.tagName).toBe('root');
      expect(node.children).toEqual([]);
    });
  });

  describe('型ガード', () => {
    test('isElement が要素ノードを正しく判定する', () => {
      const element = HTMLNode.createElement('div');
      const text = HTMLNode.createText('hello');

      expect(HTMLNode.isElement(element)).toBe(true);
      expect(HTMLNode.isElement(text)).toBe(false);
    });

    test('isText がテキストノードを正しく判定する', () => {
      const element = HTMLNode.createElement('div');
      const text = HTMLNode.createText('hello');

      expect(HTMLNode.isText(text)).toBe(true);
      expect(HTMLNode.isText(element)).toBe(false);
    });
  });

  describe('ファクトリーメソッド', () => {
    test('createElement で要素ノードを作成できる', () => {
      const node = HTMLNode.createElement('div', { class: 'container' });

      expect(node.type).toBe('element');
      expect(node.tagName).toBe('div');
      expect(node.attributes?.class).toBe('container');
      expect(node.children).toEqual([]);
    });

    test('createText でテキストノードを作成できる', () => {
      const node = HTMLNode.createText('Hello World');

      expect(node.type).toBe('text');
      expect(node.textContent).toBe('Hello World');
    });

    test('createComment でコメントノードを作成できる', () => {
      const node = HTMLNode.createComment('This is a comment');

      expect(node.type).toBe('comment');
      expect(node.textContent).toBe('This is a comment');
    });
  });

  describe('ユーティリティメソッド', () => {
    test('appendChild で子ノードを追加できる', () => {
      const parent = HTMLNode.createElement('div');
      const child = HTMLNode.createElement('span');

      HTMLNode.appendChild(parent, child);

      expect(parent.children).toHaveLength(1);
      expect(parent.children?.[0]).toBe(child);
    });

    test('getTextContent で全てのテキストを取得できる', () => {
      const parent = HTMLNode.createElement('div');
      const text1 = HTMLNode.createText('Hello ');
      const span = HTMLNode.createElement('span');
      const text2 = HTMLNode.createText('World');

      HTMLNode.appendChild(parent, text1);
      HTMLNode.appendChild(parent, span);
      HTMLNode.appendChild(span, text2);

      expect(HTMLNode.getTextContent(parent)).toBe('Hello World');
    });

    test('hasChildren で子ノードの有無を判定できる', () => {
      const parent = HTMLNode.createElement('div');
      const child = HTMLNode.createElement('span');

      expect(HTMLNode.hasChildren(parent)).toBe(false);
      
      HTMLNode.appendChild(parent, child);
      
      expect(HTMLNode.hasChildren(parent)).toBe(true);
    });
  });
});