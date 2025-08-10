import { describe, test, expect } from 'vitest';
import { mapHTMLNodeToFigma } from './mapper';
import type { HTMLNode } from './types';

describe('mapHTMLNodeToFigma', () => {
  test('div要素をFrameノードに変換できる', () => {
    const htmlNode: HTMLNode = {
      type: 'element',
      tagName: 'div',
      children: []
    };

    const result = mapHTMLNodeToFigma(htmlNode);

    expect(result.type).toBe('FRAME');
    expect(result.name).toBe('div');
  });

  test('p要素をTextノードに変換できる', () => {
    const htmlNode: HTMLNode = {
      type: 'element',
      tagName: 'p',
      children: [{
        type: 'text',
        textContent: 'Hello World'
      }]
    };

    const result = mapHTMLNodeToFigma(htmlNode);

    expect(result.type).toBe('TEXT');
    expect(result.name).toBe('p');
  });

  test('テキストノードを変換できる', () => {
    const htmlNode: HTMLNode = {
      type: 'text',
      textContent: 'Plain text'
    };

    const result = mapHTMLNodeToFigma(htmlNode);

    expect(result.type).toBe('TEXT');
    expect(result.name).toBe('Text');
  });

  test('属性からスタイルを適用できる', () => {
    const htmlNode: HTMLNode = {
      type: 'element',
      tagName: 'div',
      attributes: {
        style: 'width: 200px; height: 100px;'
      },
      children: []
    };

    const result = mapHTMLNodeToFigma(htmlNode);

    expect(result.width).toBe(200);
    expect(result.height).toBe(100);
  });

  test('h1-h6要素をTextノードに変換できる', () => {
    const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    
    headings.forEach(tagName => {
      const htmlNode: HTMLNode = {
        type: 'element',
        tagName,
        children: [{
          type: 'text',
          textContent: 'Heading'
        }]
      };

      const result = mapHTMLNodeToFigma(htmlNode);

      expect(result.type).toBe('TEXT');
      expect(result.name).toBe(tagName);
    });
  });

  test('Flexboxレイアウトを適用できる', () => {
    const htmlNode: HTMLNode = {
      type: 'element',
      tagName: 'div',
      attributes: {
        style: 'display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 16px;'
      },
      children: []
    };

    const result = mapHTMLNodeToFigma(htmlNode);

    expect(result.layoutMode).toBe('VERTICAL');
    expect(result.primaryAxisAlignItems).toBe('CENTER');
    expect(result.counterAxisAlignItems).toBe('CENTER');
    expect(result.itemSpacing).toBe(16);
  });

  test('Flexbox with padding', () => {
    const htmlNode: HTMLNode = {
      type: 'element',
      tagName: 'div',
      attributes: {
        style: 'display: flex; padding: 10px 20px;'
      },
      children: []
    };

    const result = mapHTMLNodeToFigma(htmlNode);

    expect(result.layoutMode).toBe('HORIZONTAL');
    expect(result.paddingTop).toBe(10);
    expect(result.paddingBottom).toBe(10);
    expect(result.paddingLeft).toBe(20);
    expect(result.paddingRight).toBe(20);
  });

  test('Flexbox with row-gap and column-gap for horizontal layout', () => {
    const htmlNode: HTMLNode = {
      type: 'element',
      tagName: 'div',
      attributes: {
        style: 'display: flex; flex-direction: row; row-gap: 10px; column-gap: 20px;'
      },
      children: []
    };

    const result = mapHTMLNodeToFigma(htmlNode);

    expect(result.layoutMode).toBe('HORIZONTAL');
    expect(result.itemSpacing).toBe(20); // column-gap for horizontal
  });

  test('Flexbox with row-gap and column-gap for vertical layout', () => {
    const htmlNode: HTMLNode = {
      type: 'element',
      tagName: 'div',
      attributes: {
        style: 'display: flex; flex-direction: column; row-gap: 10px; column-gap: 20px;'
      },
      children: []
    };

    const result = mapHTMLNodeToFigma(htmlNode);

    expect(result.layoutMode).toBe('VERTICAL');
    expect(result.itemSpacing).toBe(10); // row-gap for vertical
  });

  test('Flexbox with gap shorthand (two values)', () => {
    const htmlNodeHorizontal: HTMLNode = {
      type: 'element',
      tagName: 'div',
      attributes: {
        style: 'display: flex; gap: 15px 25px;'
      },
      children: []
    };

    const resultHorizontal = mapHTMLNodeToFigma(htmlNodeHorizontal);
    expect(resultHorizontal.layoutMode).toBe('HORIZONTAL');
    expect(resultHorizontal.itemSpacing).toBe(25); // column-gap

    const htmlNodeVertical: HTMLNode = {
      type: 'element',
      tagName: 'div',
      attributes: {
        style: 'display: flex; flex-direction: column; gap: 15px 25px;'
      },
      children: []
    };

    const resultVertical = mapHTMLNodeToFigma(htmlNodeVertical);
    expect(resultVertical.layoutMode).toBe('VERTICAL');
    expect(resultVertical.itemSpacing).toBe(15); // row-gap
  });

  test('Flexbox space-between with padding', () => {
    const htmlNode: HTMLNode = {
      type: 'element',
      tagName: 'div',
      attributes: {
        style: 'display: flex; justify-content: space-between; padding: 10px;'
      },
      children: []
    };

    const result = mapHTMLNodeToFigma(htmlNode);

    expect(result.layoutMode).toBe('HORIZONTAL');
    expect(result.primaryAxisAlignItems).toBe('SPACE_BETWEEN');
    expect(result.paddingTop).toBe(10);
    expect(result.paddingBottom).toBe(10);
    expect(result.paddingLeft).toBe(10);
    expect(result.paddingRight).toBe(10);
  });
});