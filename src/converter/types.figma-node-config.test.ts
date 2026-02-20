import { test, expect } from 'vitest';
import type { FigmaNodeConfig } from './types';

test('FigmaNodeConfig型 - 基本プロパティ - 正しい構造を持つ', () => {
  const nodeConfig: FigmaNodeConfig = {
    type: 'FRAME',
    name: 'Container',
    x: 0,
    y: 0,
    width: 100,
    height: 100
  };

  expect(nodeConfig.type).toBe('FRAME');
  expect(nodeConfig.name).toBe('Container');
  expect(nodeConfig.width).toBe(100);
  expect(nodeConfig.height).toBe(100);
});

test('FigmaNodeConfig型 - スタイルプロパティ - 正しい構造を持つ', () => {
  const nodeConfig: FigmaNodeConfig = {
    type: 'FRAME',
    name: 'StyledContainer',
    fills: [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }],
    strokes: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }],
    strokeWeight: 2,
    cornerRadius: 8
  };

  expect(nodeConfig.fills).toBeDefined();
  expect(nodeConfig.strokes).toBeDefined();
  expect(nodeConfig.strokeWeight).toBe(2);
  expect(nodeConfig.cornerRadius).toBe(8);
});
