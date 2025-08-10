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

  describe('margin処理', () => {
    test('marginをAuto Layoutの要素間スペースに変換できる', () => {
      const parentNode: HTMLNode = {
        type: 'element',
        tagName: 'div',
        attributes: {
          style: 'display: flex; flex-direction: column;'
        },
        children: [
          {
            type: 'element',
            tagName: 'div',
            attributes: {
              style: 'margin: 20px;'
            },
            children: []
          },
          {
            type: 'element',
            tagName: 'div',
            attributes: {
              style: 'margin: 20px;'
            },
            children: []
          }
        ]
      };

      const result = mapHTMLNodeToFigma(parentNode);
      const children = (result as any).children;

      expect(result.layoutMode).toBe('VERTICAL');
      expect(children).toHaveLength(2);
      // marginは親のAuto Layoutのitemspacingとして適用される想定
    });

    test('個別のmargin値を処理できる', () => {
      const htmlNode: HTMLNode = {
        type: 'element',
        tagName: 'div',
        attributes: {
          style: 'margin-top: 10px; margin-right: 20px; margin-bottom: 30px; margin-left: 40px;'
        },
        children: []
      };

      const result = mapHTMLNodeToFigma(htmlNode);

      // Figmaではmarginは要素の配置に影響を与える
      // 実装によってはx, yの位置調整として反映される
      expect(result).toBeDefined();
    });

    test('marginショートハンドを処理できる', () => {
      const htmlNode: HTMLNode = {
        type: 'element',
        tagName: 'div',
        attributes: {
          style: 'margin: 10px 20px;'
        },
        children: []
      };

      const result = mapHTMLNodeToFigma(htmlNode);
      expect(result).toBeDefined();
    });
  });

  describe('padding処理の改善', () => {
    test('個別のpadding値を処理できる', () => {
      const htmlNode: HTMLNode = {
        type: 'element',
        tagName: 'div',
        attributes: {
          style: 'padding-top: 5px; padding-right: 10px; padding-bottom: 15px; padding-left: 20px;'
        },
        children: []
      };

      const result = mapHTMLNodeToFigma(htmlNode);

      expect(result.paddingTop).toBe(5);
      expect(result.paddingRight).toBe(10);
      expect(result.paddingBottom).toBe(15);
      expect(result.paddingLeft).toBe(20);
    });

    test('paddingとmarginを同時に処理できる', () => {
      const htmlNode: HTMLNode = {
        type: 'element',
        tagName: 'div',
        attributes: {
          style: 'padding: 10px; margin: 20px;'
        },
        children: []
      };

      const result = mapHTMLNodeToFigma(htmlNode);

      expect(result.paddingTop).toBe(10);
      expect(result.paddingBottom).toBe(10);
      expect(result.paddingLeft).toBe(10);
      expect(result.paddingRight).toBe(10);
    });
  });

  describe('position処理', () => {
    test('絶対配置を処理できる', () => {
      const htmlNode: HTMLNode = {
        type: 'element',
        tagName: 'div',
        attributes: {
          style: 'position: absolute; top: 10px; left: 20px; width: 100px; height: 50px;'
        },
        children: []
      };

      const result = mapHTMLNodeToFigma(htmlNode);

      expect(result.x).toBe(20);
      expect(result.y).toBe(10);
      expect(result.width).toBe(100);
      expect(result.height).toBe(50);
      // Figmaでは絶対配置はconstraintsで表現される
      expect(result.constraints).toEqual({
        horizontal: 'MIN',
        vertical: 'MIN'
      });
    });

    test('相対配置を処理できる', () => {
      const htmlNode: HTMLNode = {
        type: 'element',
        tagName: 'div',
        attributes: {
          style: 'position: relative; top: 5px; left: 10px;'
        },
        children: []
      };

      const result = mapHTMLNodeToFigma(htmlNode);

      // 相対配置はオフセットとして適用
      expect(result.x).toBe(10);
      expect(result.y).toBe(5);
    });

    test('固定配置を処理できる', () => {
      const htmlNode: HTMLNode = {
        type: 'element',
        tagName: 'div',
        attributes: {
          style: 'position: fixed; top: 0; left: 0; right: 0; height: 60px;'
        },
        children: []
      };

      const result = mapHTMLNodeToFigma(htmlNode);

      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
      expect(result.height).toBe(60);
      // fixedは画面に固定される
      expect(result.constraints).toEqual({
        horizontal: 'STRETCH',
        vertical: 'MIN'
      });
    });

    test('z-indexを処理できる', () => {
      const htmlNode: HTMLNode = {
        type: 'element',
        tagName: 'div',
        attributes: {
          style: 'position: absolute; z-index: 10;'
        },
        children: []
      };

      const result = mapHTMLNodeToFigma(htmlNode);

      // z-indexは描画順序として保存される（実際のFigmaでの実装は異なる可能性）
      expect((result as any).zIndex).toBe(10);
    });

    test('rightとbottomを使った配置を処理できる', () => {
      const htmlNode: HTMLNode = {
        type: 'element',
        tagName: 'div',
        attributes: {
          style: 'position: absolute; right: 20px; bottom: 30px; width: 100px; height: 50px;'
        },
        children: []
      };

      const result = mapHTMLNodeToFigma(htmlNode);

      // rightとbottomはconstraintsで表現
      expect(result.width).toBe(100);
      expect(result.height).toBe(50);
      expect(result.constraints).toEqual({
        horizontal: 'MAX',
        vertical: 'MAX'
      });
    });
  });
});