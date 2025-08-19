import { test, expect } from 'vitest';
import { FigmaNode } from '../figma-node';

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