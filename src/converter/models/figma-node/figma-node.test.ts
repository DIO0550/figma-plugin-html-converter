import { describe, test, expect } from 'vitest';
import { FigmaNode } from './figma-node';

describe('FigmaNode', () => {
  describe('型ガード', () => {
    test('isFrame がFrameノードを正しく判定する', () => {
      const frame = FigmaNode.createFrame('Container');
      const text = FigmaNode.createText('Hello');

      expect(FigmaNode.isFrame(frame)).toBe(true);
      expect(FigmaNode.isFrame(text)).toBe(false);
    });

    test('isText がTextノードを正しく判定する', () => {
      const frame = FigmaNode.createFrame('Container');
      const text = FigmaNode.createText('Hello');

      expect(FigmaNode.isText(text)).toBe(true);
      expect(FigmaNode.isText(frame)).toBe(false);
    });
  });

  describe('ファクトリーメソッド', () => {
    test('createFrame でFrameノードを作成できる', () => {
      const node = FigmaNode.createFrame('MyFrame', {
        width: 200,
        height: 100
      });

      expect(node.type).toBe('FRAME');
      expect(node.name).toBe('MyFrame');
      expect(node.width).toBe(200);
      expect(node.height).toBe(100);
    });

    test('createText でTextノードを作成できる', () => {
      const node = FigmaNode.createText('Hello World');

      expect(node.type).toBe('TEXT');
      expect(node.name).toBe('Hello World');
    });

    test('createRectangle でRectangleノードを作成できる', () => {
      const node = FigmaNode.createRectangle('Shape', {
        width: 50,
        height: 50,
        fills: [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }]
      });

      expect(node.type).toBe('RECTANGLE');
      expect(node.name).toBe('Shape');
      expect(node.fills).toHaveLength(1);
    });
  });

  describe('スタイルヘルパー', () => {
    test('setSize でサイズを設定できる', () => {
      const node = FigmaNode.createFrame('Frame');
      FigmaNode.setSize(node, 300, 200);

      expect(node.width).toBe(300);
      expect(node.height).toBe(200);
    });

    test('setPosition で位置を設定できる', () => {
      const node = FigmaNode.createFrame('Frame');
      FigmaNode.setPosition(node, 100, 50);

      expect(node.x).toBe(100);
      expect(node.y).toBe(50);
    });

    test('setFills で塗りを設定できる', () => {
      const node = FigmaNode.createFrame('Frame');
      const fills = [{ type: 'SOLID' as const, color: { r: 0, g: 1, b: 0 } }];
      
      FigmaNode.setFills(node, fills);

      expect(node.fills).toEqual(fills);
    });

    test('setAutoLayout でAuto Layoutを設定できる', () => {
      const node = FigmaNode.createFrame('Frame');
      
      FigmaNode.setAutoLayout(node, {
        mode: 'HORIZONTAL',
        spacing: 16,
        padding: { top: 20, right: 20, bottom: 20, left: 20 }
      });

      expect(node.layoutMode).toBe('HORIZONTAL');
      expect(node.itemSpacing).toBe(16);
      expect(node.paddingTop).toBe(20);
      expect(node.paddingRight).toBe(20);
      expect(node.paddingBottom).toBe(20);
      expect(node.paddingLeft).toBe(20);
    });
  });
});