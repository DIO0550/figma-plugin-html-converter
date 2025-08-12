import { describe, expect, test } from 'vitest';
import { mapHTMLNodeToFigma } from './mapper';
import { HTMLNode } from './models/html-node/html-node';
import { FigmaNode } from './models/figma-node/figma-node';

describe('mapHTMLNodeToFigma', () => {
  describe('div要素の変換', () => {
    test('div要素をFrameノードに変換できる', () => {
      const htmlNode: HTMLNode = HTMLNode.createElement('div');
      const result = mapHTMLNodeToFigma(htmlNode);
      
      expect(result.type).toBe('FRAME');
      expect(result.name).toBe('div');
    });

    test('入れ子のdiv要素を正しく変換できる', () => {
      const childNode = HTMLNode.createElement('div');
      const parentNode = HTMLNode.createElement('div', {}, [childNode]);
      
      const result = mapHTMLNodeToFigma(parentNode);
      
      expect(result.type).toBe('FRAME');
      expect(result.children).toHaveLength(1);
      expect(result.children![0].type).toBe('FRAME');
    });
  });

  describe('テキスト要素の変換', () => {
    test('p要素をTextノードに変換できる', () => {
      const textContent = HTMLNode.createText('Hello, World!');
      const htmlNode = HTMLNode.createElement('p', {}, [textContent]);
      
      const result = mapHTMLNodeToFigma(htmlNode);
      
      expect(result.type).toBe('TEXT');
      expect(result.name).toBe('p');
      expect(result.characters).toBe('Hello, World!');
    });

    test('span要素をTextノードに変換できる', () => {
      const textContent = HTMLNode.createText('Inline text');
      const htmlNode = HTMLNode.createElement('span', {}, [textContent]);
      
      const result = mapHTMLNodeToFigma(htmlNode);
      
      expect(result.type).toBe('TEXT');
      expect(result.characters).toBe('Inline text');
    });
  });

  describe('スタイル属性の処理', () => {
    test('背景色が適用される', () => {
      const htmlNode = HTMLNode.createElement('div', {
        style: 'background-color: #ff0000;'
      });
      
      const result = mapHTMLNodeToFigma(htmlNode);
      
      expect(result.fills).toBeDefined();
      expect(result.fills).toHaveLength(1);
      expect(result.fills![0].type).toBe('SOLID');
      if (result.fills![0].type === 'SOLID') {
        expect(result.fills![0].color).toEqual({ r: 1, g: 0, b: 0 });
      }
    });

    test('サイズが適用される', () => {
      const htmlNode = HTMLNode.createElement('div', {
        style: 'width: 200px; height: 100px;'
      });
      
      const result = mapHTMLNodeToFigma(htmlNode);
      
      expect(result.width).toBe(200);
      expect(result.height).toBe(100);
    });
  });

  describe('Flexboxレイアウトの変換', () => {
    test('display: flexがAuto Layoutに変換される', () => {
      const htmlNode = HTMLNode.createElement('div', {
        style: 'display: flex; gap: 10px;'
      });
      
      const result = mapHTMLNodeToFigma(htmlNode);
      
      expect(result.layoutMode).toBe('HORIZONTAL');
      expect(result.itemSpacing).toBe(10);
    });

    test('flex-directionが正しく変換される', () => {
      const htmlNode = HTMLNode.createElement('div', {
        style: 'display: flex; flex-direction: column;'
      });
      
      const result = mapHTMLNodeToFigma(htmlNode);
      
      expect(result.layoutMode).toBe('VERTICAL');
    });
  });

  describe('img要素の変換', () => {
    test('img要素をRectangleノードに変換できる', () => {
      const htmlNode = HTMLNode.createElement('img', {
        src: 'https://example.com/image.jpg',
        alt: 'Sample Image'
      });
      
      const result = mapHTMLNodeToFigma(htmlNode);
      
      expect(result.type).toBe('RECTANGLE');
      expect(result.name).toBe('img: Sample Image');
    });

    test('img要素にsrc属性がない場合でもRectangleノードに変換される', () => {
      const htmlNode = HTMLNode.createElement('img', {
        alt: 'No source image'
      });
      
      const result = mapHTMLNodeToFigma(htmlNode);
      
      expect(result.type).toBe('RECTANGLE');
      expect(result.name).toBe('img: No source image');
    });

    test('alt属性がない場合は"img"という名前になる', () => {
      const htmlNode = HTMLNode.createElement('img', {
        src: 'https://example.com/image.jpg'
      });
      
      const result = mapHTMLNodeToFigma(htmlNode);
      
      expect(result.type).toBe('RECTANGLE');
      expect(result.name).toBe('img');
    });

    test('width属性とheight属性が適用される', () => {
      const htmlNode = HTMLNode.createElement('img', {
        src: 'https://example.com/image.jpg',
        width: '300',
        height: '200'
      });
      
      const result = mapHTMLNodeToFigma(htmlNode);
      
      expect(result.width).toBe(300);
      expect(result.height).toBe(200);
    });

    test('スタイル属性のwidth/heightが優先される', () => {
      const htmlNode = HTMLNode.createElement('img', {
        src: 'https://example.com/image.jpg',
        width: '300',
        height: '200',
        style: 'width: 400px; height: 250px;'
      });
      
      const result = mapHTMLNodeToFigma(htmlNode);
      
      expect(result.width).toBe(400);
      expect(result.height).toBe(250);
    });

    test('画像URLがfillsに設定される', () => {
      const htmlNode = HTMLNode.createElement('img', {
        src: 'https://example.com/image.jpg'
      });
      
      const result = mapHTMLNodeToFigma(htmlNode);
      
      expect(result.fills).toBeDefined();
      expect(result.fills).toHaveLength(1);
      expect(result.fills![0].type).toBe('IMAGE');
      if (result.fills![0].type === 'IMAGE') {
        expect(result.fills![0].imageHash).toBe('https://example.com/image.jpg');
      }
    });

    test('相対URLも処理できる', () => {
      const htmlNode = HTMLNode.createElement('img', {
        src: '/images/logo.png'
      });
      
      const result = mapHTMLNodeToFigma(htmlNode);
      
      expect(result.fills).toBeDefined();
      expect(result.fills).toHaveLength(1);
      expect(result.fills![0].type).toBe('IMAGE');
      if (result.fills![0].type === 'IMAGE') {
        expect(result.fills![0].imageHash).toBe('/images/logo.png');
      }
    });

    test('データURLも処理できる', () => {
      const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      const htmlNode = HTMLNode.createElement('img', {
        src: dataUrl
      });
      
      const result = mapHTMLNodeToFigma(htmlNode);
      
      expect(result.fills).toBeDefined();
      expect(result.fills).toHaveLength(1);
      expect(result.fills![0].type).toBe('IMAGE');
      if (result.fills![0].type === 'IMAGE') {
        expect(result.fills![0].imageHash).toBe(dataUrl);
      }
    });

    test('object-fit: coverがscaleModeに変換される', () => {
      const htmlNode = HTMLNode.createElement('img', {
        src: 'https://example.com/image.jpg',
        style: 'object-fit: cover;'
      });
      
      const result = mapHTMLNodeToFigma(htmlNode);
      
      expect(result.fills).toBeDefined();
      expect(result.fills).toHaveLength(1);
      expect(result.fills![0].type).toBe('IMAGE');
      if (result.fills![0].type === 'IMAGE') {
        expect(result.fills![0].scaleMode).toBe('FILL');
      }
    });

    test('object-fit: containがscaleModeに変換される', () => {
      const htmlNode = HTMLNode.createElement('img', {
        src: 'https://example.com/image.jpg',
        style: 'object-fit: contain;'
      });
      
      const result = mapHTMLNodeToFigma(htmlNode);
      
      expect(result.fills).toBeDefined();
      expect(result.fills).toHaveLength(1);
      expect(result.fills![0].type).toBe('IMAGE');
      if (result.fills![0].type === 'IMAGE') {
        expect(result.fills![0].scaleMode).toBe('FIT');
      }
    });

    test('srcがない場合はプレースホルダーが設定される', () => {
      const htmlNode = HTMLNode.createElement('img', {
        alt: 'Placeholder'
      });
      
      const result = mapHTMLNodeToFigma(htmlNode);
      
      expect(result.fills).toBeDefined();
      expect(result.fills).toHaveLength(1);
      expect(result.fills![0].type).toBe('SOLID');
      if (result.fills![0].type === 'SOLID') {
        // グレーのプレースホルダー背景
        expect(result.fills![0].color).toEqual({ r: 0.8, g: 0.8, b: 0.8 });
      }
    });

    test('デフォルトサイズが設定される', () => {
      const htmlNode = HTMLNode.createElement('img', {
        src: 'https://example.com/image.jpg'
      });
      
      const result = mapHTMLNodeToFigma(htmlNode);
      
      // width/height属性がない場合のデフォルト値
      expect(result.width).toBe(100);
      expect(result.height).toBe(100);
    });
  });
});