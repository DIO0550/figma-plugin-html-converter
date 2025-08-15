import { describe, test, expect } from 'vitest';
import { HTMLNode } from '../../models/html-node';
import { HTML } from '../../models/html';

describe('HTMLNode.from (パーサー統合テスト)', () => {
  test('シンプルなdiv要素を解析できる', () => {
    const html = HTML.from('<div>Hello World</div>');
    const result = HTMLNode.from(html);

    expect(HTMLNode.isElement(result)).toBe(true);
    expect(result.tagName).toBe('div');
    expect(HTMLNode.hasChildren(result)).toBe(true);
    expect(HTMLNode.getTextContent(result)).toBe('Hello World');
  });

  test('属性を持つ要素を解析できる', () => {
    const html = HTML.from('<div class="container" id="main">Content</div>');
    const result = HTMLNode.from(html);

    expect(result.attributes).toBeDefined();
    expect(result.attributes?.class).toBe('container');
    expect(result.attributes?.id).toBe('main');
  });

  test('ネストされた要素を解析できる', () => {
    const html = HTML.from('<div><p>Paragraph</p><span>Span</span></div>');
    const result = HTMLNode.from(html);

    expect(result.children).toHaveLength(2);
    expect(result.children?.[0].tagName).toBe('p');
    expect(result.children?.[1].tagName).toBe('span');
  });

  test('空のHTMLを解析できる', () => {
    const html = HTML.from('');
    const result = HTMLNode.from(html);

    expect(HTMLNode.isElement(result)).toBe(true);
    expect(result.tagName).toBe('root');
    expect(result.children).toHaveLength(0);
  });

  test.skip('複雑なネスト構造を解析できる', () => {
    const html = HTML.from('<div class="outer"><div class="inner"><p>Text in paragraph</p></div></div>');
    const result = HTMLNode.from(html);

    expect(result.tagName).toBe('div');
    expect(result.attributes?.class).toBe('outer');
    
    expect(result.children).toBeDefined();
    expect(result.children).toHaveLength(1);
    
    const inner = result.children?.[0];
    expect(inner?.tagName).toBe('div');
    expect(inner?.attributes?.class).toBe('inner');
  });
});