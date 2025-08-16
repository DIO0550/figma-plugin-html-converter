import { test, expect } from 'vitest';
import { FigmaNode } from './figma-node';

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