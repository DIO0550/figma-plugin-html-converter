import { describe, test, expect } from 'vitest';
import { mapHTMLNodeToFigma } from './mapper';
import type { HTMLNode } from './types';

describe('レイアウトテスト', () => {
  describe('Flexboxレイアウトの統合テスト', () => {
    test('複雑なFlexboxレイアウトを正しく変換できる', () => {
      const htmlNode: HTMLNode = {
        type: 'element',
        tagName: 'div',
        attributes: {
          style: `
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
            padding: 16px;
            width: 800px;
            height: 600px;
          `
        },
        children: [
          {
            type: 'element',
            tagName: 'div',
            attributes: {
              style: 'width: 200px; height: 150px; background-color: #ff0000;'
            },
            children: []
          },
          {
            type: 'element',
            tagName: 'div',
            attributes: {
              style: 'width: 200px; height: 150px; background-color: #00ff00;'
            },
            children: []
          },
          {
            type: 'element',
            tagName: 'div',
            attributes: {
              style: 'width: 200px; height: 150px; background-color: #0000ff;'
            },
            children: []
          }
        ]
      };

      const result = mapHTMLNodeToFigma(htmlNode);

      expect(result.type).toBe('FRAME');
      expect(result.layoutMode).toBe('HORIZONTAL');
      expect(result.primaryAxisAlignItems).toBe('SPACE_BETWEEN');
      expect(result.counterAxisAlignItems).toBe('CENTER');
      expect(result.layoutWrap).toBe('WRAP');
      expect(result.itemSpacing).toBe(20);
      expect(result.paddingTop).toBe(16);
      expect(result.paddingRight).toBe(16);
      expect(result.paddingBottom).toBe(16);
      expect(result.paddingLeft).toBe(16);
      expect(result.width).toBe(800);
      expect(result.height).toBe(600);
      expect(result.children).toHaveLength(3);
    });

    test('flex-growとflex-shrinkを持つ子要素を正しく処理できる', () => {
      const htmlNode: HTMLNode = {
        type: 'element',
        tagName: 'div',
        attributes: {
          style: 'display: flex; width: 600px; gap: 10px;'
        },
        children: [
          {
            type: 'element',
            tagName: 'div',
            attributes: {
              style: 'flex: 1; background-color: red;'
            },
            children: []
          },
          {
            type: 'element',
            tagName: 'div',
            attributes: {
              style: 'flex: 2; background-color: blue;'
            },
            children: []
          },
          {
            type: 'element',
            tagName: 'div',
            attributes: {
              style: 'width: 100px; flex-shrink: 0; background-color: green;'
            },
            children: []
          }
        ]
      };

      const result = mapHTMLNodeToFigma(htmlNode);

      expect(result.type).toBe('FRAME');
      expect(result.layoutMode).toBe('HORIZONTAL');
      expect(result.itemSpacing).toBe(10);
      expect(result.width).toBe(600);
      
      const children = result.children || [];
      expect(children).toHaveLength(3);
      
      // flex: 1の要素
      expect(children[0].layoutGrow).toBe(1);
      
      // flex: 2の要素
      expect(children[1].layoutGrow).toBe(2);
      
      // flex-shrink: 0の要素
      expect(children[2].width).toBe(100);
      expect(children[2].layoutGrow).toBe(0);
    });

    test('column方向のFlexboxレイアウトを正しく変換できる', () => {
      const htmlNode: HTMLNode = {
        type: 'element',
        tagName: 'div',
        attributes: {
          style: `
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
            gap: 15px;
            padding: 20px;
            width: 400px;
          `
        },
        children: [
          {
            type: 'element',
            tagName: 'p',
            children: [{ type: 'text', textContent: 'Header' }]
          },
          {
            type: 'element',
            tagName: 'div',
            attributes: {
              style: 'height: 200px; background-color: #f0f0f0;'
            },
            children: []
          },
          {
            type: 'element',
            tagName: 'p',
            children: [{ type: 'text', textContent: 'Footer' }]
          }
        ]
      };

      const result = mapHTMLNodeToFigma(htmlNode);

      expect(result.type).toBe('FRAME');
      expect(result.layoutMode).toBe('VERTICAL');
      expect(result.primaryAxisAlignItems).toBe('MIN');
      expect(result.counterAxisAlignItems).toBe('MIN'); // stretchはMINとして扱われる
      expect(result.itemSpacing).toBe(15);
      expect(result.paddingTop).toBe(20);
      expect(result.paddingRight).toBe(20);
      expect(result.paddingBottom).toBe(20);
      expect(result.paddingLeft).toBe(20);
      expect(result.width).toBe(400);
      expect(result.children).toHaveLength(3);
    });
  });

  describe('ネストされたレイアウトのテスト', () => {
    test('Flexコンテナ内にFlexコンテナをネストできる', () => {
      const htmlNode: HTMLNode = {
        type: 'element',
        tagName: 'div',
        attributes: {
          style: `
            display: flex;
            flex-direction: column;
            gap: 20px;
            padding: 24px;
            width: 600px;
            background-color: #f5f5f5;
          `
        },
        children: [
          {
            type: 'element',
            tagName: 'div',
            attributes: {
              style: `
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                background-color: white;
              `
            },
            children: [
              {
                type: 'element',
                tagName: 'span',
                children: [{ type: 'text', textContent: 'Left' }]
              },
              {
                type: 'element',
                tagName: 'span',
                children: [{ type: 'text', textContent: 'Right' }]
              }
            ]
          },
          {
            type: 'element',
            tagName: 'div',
            attributes: {
              style: `
                display: flex;
                flex-direction: row;
                gap: 10px;
                padding: 12px;
                background-color: white;
              `
            },
            children: [
              {
                type: 'element',
                tagName: 'div',
                attributes: {
                  style: 'width: 100px; height: 100px; background-color: red;'
                },
                children: []
              },
              {
                type: 'element',
                tagName: 'div',
                attributes: {
                  style: 'width: 100px; height: 100px; background-color: green;'
                },
                children: []
              },
              {
                type: 'element',
                tagName: 'div',
                attributes: {
                  style: 'width: 100px; height: 100px; background-color: blue;'
                },
                children: []
              }
            ]
          }
        ]
      };

      const result = mapHTMLNodeToFigma(htmlNode);

      // 親コンテナの検証
      expect(result.type).toBe('FRAME');
      expect(result.layoutMode).toBe('VERTICAL');
      expect(result.itemSpacing).toBe(20);
      expect(result.paddingTop).toBe(24);
      expect(result.width).toBe(600);
      
      const children = result.children || [];
      expect(children).toHaveLength(2);

      // 最初の子コンテナ（横並び）
      const firstChild = children[0];
      expect(firstChild.type).toBe('FRAME');
      expect(firstChild.layoutMode).toBe('HORIZONTAL');
      expect(firstChild.primaryAxisAlignItems).toBe('SPACE_BETWEEN');
      expect(firstChild.counterAxisAlignItems).toBe('CENTER');
      expect(firstChild.paddingTop).toBe(12);
      expect(firstChild.children).toHaveLength(2);

      // 2番目の子コンテナ（横並び）
      const secondChild = children[1];
      expect(secondChild.type).toBe('FRAME');
      expect(secondChild.layoutMode).toBe('HORIZONTAL');
      expect(secondChild.itemSpacing).toBe(10);
      expect(secondChild.paddingTop).toBe(12);
      expect(secondChild.children).toHaveLength(3);
    });

    test('3階層以上の深いネスト構造を処理できる', () => {
      const htmlNode: HTMLNode = {
        type: 'element',
        tagName: 'div',
        attributes: {
          style: 'display: flex; flex-direction: column; gap: 16px; padding: 20px;'
        },
        children: [
          {
            type: 'element',
            tagName: 'div',
            attributes: {
              style: 'display: flex; flex-direction: row; gap: 12px;'
            },
            children: [
              {
                type: 'element',
                tagName: 'div',
                attributes: {
                  style: 'display: flex; flex-direction: column; gap: 8px; padding: 10px;'
                },
                children: [
                  {
                    type: 'element',
                    tagName: 'div',
                    attributes: {
                      style: 'display: flex; justify-content: center; align-items: center; width: 50px; height: 50px;'
                    },
                    children: [
                      {
                        type: 'element',
                        tagName: 'span',
                        children: [{ type: 'text', textContent: 'A' }]
                      }
                    ]
                  },
                  {
                    type: 'element',
                    tagName: 'span',
                    children: [{ type: 'text', textContent: 'Label' }]
                  }
                ]
              }
            ]
          }
        ]
      };

      const result = mapHTMLNodeToFigma(htmlNode);

      // レベル1
      expect(result.type).toBe('FRAME');
      expect(result.layoutMode).toBe('VERTICAL');
      expect(result.itemSpacing).toBe(16);
      
      // レベル2
      const level2 = result.children?.[0];
      expect(level2?.type).toBe('FRAME');
      expect(level2?.layoutMode).toBe('HORIZONTAL');
      expect(level2?.itemSpacing).toBe(12);
      
      // レベル3
      const level3 = level2?.children?.[0];
      expect(level3?.type).toBe('FRAME');
      expect(level3?.layoutMode).toBe('VERTICAL');
      expect(level3?.itemSpacing).toBe(8);
      expect(level3?.paddingTop).toBe(10);
      
      // レベル4
      const level4 = level3?.children?.[0];
      expect(level4?.type).toBe('FRAME');
      expect(level4?.layoutMode).toBe('HORIZONTAL');
      expect(level4?.primaryAxisAlignItems).toBe('CENTER');
      expect(level4?.counterAxisAlignItems).toBe('CENTER');
      expect(level4?.width).toBe(50);
      expect(level4?.height).toBe(50);
    });

    test('Flexと非Flexの混在レイアウトを処理できる', () => {
      const htmlNode: HTMLNode = {
        type: 'element',
        tagName: 'div',
        attributes: {
          style: 'display: flex; flex-direction: column; gap: 16px;'
        },
        children: [
          {
            type: 'element',
            tagName: 'div',
            attributes: {
              style: 'display: flex; gap: 10px;'
            },
            children: [
              {
                type: 'element',
                tagName: 'span',
                children: [{ type: 'text', textContent: 'Flex item 1' }]
              },
              {
                type: 'element',
                tagName: 'span',
                children: [{ type: 'text', textContent: 'Flex item 2' }]
              }
            ]
          },
          {
            type: 'element',
            tagName: 'div',
            attributes: {
              style: 'width: 300px; height: 100px; background-color: gray;'
            },
            children: [
              {
                type: 'element',
                tagName: 'p',
                children: [{ type: 'text', textContent: 'Non-flex container' }]
              }
            ]
          },
          {
            type: 'element',
            tagName: 'div',
            attributes: {
              style: 'display: flex; justify-content: flex-end;'
            },
            children: [
              {
                type: 'element',
                tagName: 'button',
                children: [{ type: 'text', textContent: 'Submit' }]
              }
            ]
          }
        ]
      };

      const result = mapHTMLNodeToFigma(htmlNode);

      expect(result.type).toBe('FRAME');
      expect(result.layoutMode).toBe('VERTICAL');
      expect(result.itemSpacing).toBe(16);
      
      const children = result.children || [];
      expect(children).toHaveLength(3);

      // 最初の子（Flexコンテナ）
      expect(children[0].layoutMode).toBe('HORIZONTAL');
      expect(children[0].itemSpacing).toBe(10);

      // 2番目の子（非Flexコンテナ）
      expect(children[1].layoutMode).toBeUndefined();
      expect(children[1].width).toBe(300);
      expect(children[1].height).toBe(100);

      // 3番目の子（Flexコンテナ）
      expect(children[2].layoutMode).toBe('HORIZONTAL');
      expect(children[2].primaryAxisAlignItems).toBe('MAX');
    });
  });

  describe('レスポンシブ要素のテスト', () => {
    test('max-widthとmin-widthを処理できる', () => {
      const htmlNode: HTMLNode = {
        type: 'element',
        tagName: 'div',
        attributes: {
          style: `
            width: 100%;
            max-width: 1200px;
            min-width: 300px;
            height: auto;
            min-height: 100px;
            max-height: 500px;
          `
        },
        children: []
      };

      const result = mapHTMLNodeToFigma(htmlNode);

      expect(result.type).toBe('FRAME');
      // Figmaでは制約として処理される
      expect(result.constraints).toEqual({
        horizontal: 'SCALE',
        vertical: 'MIN'
      });
      expect(result.minWidth).toBe(300);
      expect(result.maxWidth).toBe(1200);
      expect(result.minHeight).toBe(100);
      expect(result.maxHeight).toBe(500);
    });

    test('パーセンテージベースの幅と高さを処理できる', () => {
      const htmlNode: HTMLNode = {
        type: 'element',
        tagName: 'div',
        attributes: {
          style: 'display: flex; width: 800px; height: 600px;'
        },
        children: [
          {
            type: 'element',
            tagName: 'div',
            attributes: {
              style: 'width: 50%; height: 100%; background-color: red;'
            },
            children: []
          },
          {
            type: 'element',
            tagName: 'div',
            attributes: {
              style: 'width: 25%; height: 50%; background-color: green;'
            },
            children: []
          },
          {
            type: 'element',
            tagName: 'div',
            attributes: {
              style: 'width: 25%; height: auto; background-color: blue;'
            },
            children: []
          }
        ]
      };

      const result = mapHTMLNodeToFigma(htmlNode);

      expect(result.type).toBe('FRAME');
      expect(result.width).toBe(800);
      expect(result.height).toBe(600);

      const children = result.children || [];
      expect(children).toHaveLength(3);

      // 50%幅の要素
      expect(children[0].layoutSizingHorizontal).toBe('FILL');
      expect(children[0].layoutSizingVertical).toBe('FILL');

      // 25%幅、50%高さの要素
      expect(children[1].layoutSizingHorizontal).toBe('FIXED');
      expect(children[1].width).toBe(200); // 800px * 0.25
      expect(children[1].height).toBe(300); // 600px * 0.5

      // 25%幅、auto高さの要素
      expect(children[2].layoutSizingHorizontal).toBe('FIXED');
      expect(children[2].width).toBe(200); // 800px * 0.25
      expect(children[2].layoutSizingVertical).toBe('HUG');
    });

    test('viewportユニット（vw、vh）を処理できる', () => {
      const htmlNode: HTMLNode = {
        type: 'element',
        tagName: 'div',
        attributes: {
          style: `
            width: 100vw;
            height: 100vh;
            padding: 5vw;
            margin: 2vh;
          `
        },
        children: [
          {
            type: 'element',
            tagName: 'div',
            attributes: {
              style: 'width: 50vw; height: 50vh; background-color: purple;'
            },
            children: []
          }
        ]
      };

      const result = mapHTMLNodeToFigma(htmlNode);

      expect(result.type).toBe('FRAME');
      // viewportユニットは1920x1080をデフォルトとして変換
      expect(result.width).toBe(1920); // 100vw = 1920px
      expect(result.height).toBe(1080); // 100vh = 1080px
      expect(result.paddingTop).toBe(96); // 5vw = 1920 * 0.05
      expect(result.paddingRight).toBe(96);
      expect(result.paddingBottom).toBe(96);
      expect(result.paddingLeft).toBe(96);

      const child = result.children?.[0];
      expect(child?.width).toBe(960); // 50vw = 1920 * 0.5
      expect(child?.height).toBe(540); // 50vh = 1080 * 0.5
    });

    test('calc()関数を使用した動的な値を処理できる', () => {
      const htmlNode: HTMLNode = {
        type: 'element',
        tagName: 'div',
        attributes: {
          style: `
            width: calc(100% - 40px);
            height: calc(50vh + 100px);
            padding: calc(1rem + 5px);
          `
        },
        children: []
      };

      const result = mapHTMLNodeToFigma(htmlNode);

      expect(result.type).toBe('FRAME');
      // calc()は簡略化して処理
      expect(result.layoutSizingHorizontal).toBe('FILL');
      expect(result.height).toBe(640); // 50vh (540px) + 100px
      expect(result.paddingTop).toBe(21); // 1rem (16px) + 5px
    });

    test('メディアクエリ相当のレスポンシブ設定を処理できる', () => {
      const htmlNode: HTMLNode = {
        type: 'element',
        tagName: 'div',
        attributes: {
          style: `
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 20px;
            width: 100%;
            max-width: 1400px;
          `
        },
        children: [
          {
            type: 'element',
            tagName: 'div',
            attributes: {
              style: 'flex: 1 1 300px; min-width: 250px;'
            },
            children: [{ type: 'text', textContent: 'Card 1' }]
          },
          {
            type: 'element',
            tagName: 'div',
            attributes: {
              style: 'flex: 1 1 300px; min-width: 250px;'
            },
            children: [{ type: 'text', textContent: 'Card 2' }]
          },
          {
            type: 'element',
            tagName: 'div',
            attributes: {
              style: 'flex: 1 1 300px; min-width: 250px;'
            },
            children: [{ type: 'text', textContent: 'Card 3' }]
          }
        ]
      };

      const result = mapHTMLNodeToFigma(htmlNode);

      expect(result.type).toBe('FRAME');
      expect(result.layoutMode).toBe('HORIZONTAL');
      expect(result.layoutWrap).toBe('WRAP');
      expect(result.itemSpacing).toBe(20);
      expect(result.maxWidth).toBe(1400);
      expect(result.layoutSizingHorizontal).toBe('FILL');

      const children = result.children || [];
      expect(children).toHaveLength(3);

      children.forEach(child => {
        expect(child.layoutGrow).toBe(1);
        expect(child.minWidth).toBe(250);
        expect(child.layoutSizingHorizontal).toBe('FILL');
      });
    });

    test('aspect-ratioプロパティを処理できる', () => {
      const htmlNode: HTMLNode = {
        type: 'element',
        tagName: 'div',
        attributes: {
          style: `
            width: 400px;
            aspect-ratio: 16 / 9;
            background-color: black;
          `
        },
        children: []
      };

      const result = mapHTMLNodeToFigma(htmlNode);

      expect(result.type).toBe('FRAME');
      expect(result.width).toBe(400);
      expect(result.height).toBe(225); // 400 * (9/16)
      expect(result.aspectRatio).toBe(16 / 9);
    });
  });
});