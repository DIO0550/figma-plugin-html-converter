import { describe, test, expect } from 'vitest';
import { HTML } from './html';

describe('HTML', () => {
  describe('from', () => {
    test('文字列からHTML型を作成できる', () => {
      const html = HTML.from('<div>Hello</div>');
      expect(typeof html).toBe('string');
      expect(html).toBe('<div>Hello</div>');
    });

    test('空文字列も受け入れる', () => {
      const html = HTML.from('');
      expect(html).toBe('');
    });
  });

  describe('isValid', () => {
    test('有効なHTMLを判定できる', () => {
      expect(HTML.isValid('<div>Hello</div>')).toBe(true);
      expect(HTML.isValid('<p>Text</p>')).toBe(true);
      expect(HTML.isValid('')).toBe(true);
    });

    test('不完全なHTMLを検出できる', () => {
      expect(HTML.isValid('<div>Hello')).toBe(false);
      expect(HTML.isValid('<div><p>Text</div>')).toBe(false);
    });
  });

  describe('sanitize', () => {
    test('余分な空白を削除する', () => {
      const html = HTML.sanitize('  <div>  Hello  </div>  ');
      expect(html).toBe('<div>  Hello  </div>');
    });

    test('改行を含むHTMLを整形する', () => {
      const html = HTML.sanitize(`
        <div>
          Hello
        </div>
      `);
      expect(html).toBe('<div>\n          Hello\n        </div>');
    });
  });

  // ブランド型は実行時には判定できないため、isメソッドのテストは省略
  // TypeScriptの型システムでのみ機能する
});

describe('HTML.toHTMLNode', () => {
  test('HTMLからHTMLNodeに変換できる', () => {
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

  test('空のHTMLはrootノードになる', () => {
    const html = HTML.from('');
    const node = HTML.toHTMLNode(html);

    expect(node.type).toBe('element');
    expect(node.tagName).toBe('root');
    expect(node.children).toHaveLength(0);
  });

  test('属性付きのHTMLを変換できる', () => {
    const html = HTML.from('<div class="test" id="main">Content</div>');
    const node = HTML.toHTMLNode(html);

    expect(node.attributes).toEqual({
      class: 'test',
      id: 'main'
    });
  });

  test('ネストされたHTMLを変換できる', () => {
    const html = HTML.from('<div><p>Text</p><span>More</span></div>');
    const node = HTML.toHTMLNode(html);

    expect(node.children).toHaveLength(2);
    expect(node.children?.[0].tagName).toBe('p');
    expect(node.children?.[1].tagName).toBe('span');
  });
});