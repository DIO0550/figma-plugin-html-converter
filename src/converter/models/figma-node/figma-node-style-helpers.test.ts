import { test, expect } from 'vitest';
import { FigmaNode } from './figma-node';

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