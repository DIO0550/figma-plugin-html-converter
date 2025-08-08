import { describe, test, expect } from 'vitest';
import type { HTMLNode, FigmaNodeConfig } from './types';
import type { ConversionOptions } from './models/conversion-options';

describe('HTMLNode型定義', () => {
  test('HTMLNodeが正しい構造を持つ', () => {
    const htmlNode: HTMLNode = {
      type: 'element',
      tagName: 'div',
      attributes: { class: 'container' },
      children: [],
      textContent: undefined
    };

    expect(htmlNode.type).toBe('element');
    expect(htmlNode.tagName).toBe('div');
    expect(htmlNode.attributes).toEqual({ class: 'container' });
    expect(htmlNode.children).toEqual([]);
  });

  test('テキストノードを表現できる', () => {
    const textNode: HTMLNode = {
      type: 'text',
      textContent: 'Hello World'
    };

    expect(textNode.type).toBe('text');
    expect(textNode.textContent).toBe('Hello World');
  });
});

describe('FigmaNodeConfig型定義', () => {
  test('FigmaNodeConfigが基本的なプロパティを持つ', () => {
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

  test('FigmaNodeConfigがスタイルプロパティを持つ', () => {
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
});

describe('ConversionOptions型定義', () => {
  test('デフォルトオプションを設定できる', () => {
    const options: ConversionOptions = {
      defaultFont: { family: 'Inter', style: 'Regular' },
      containerWidth: 800,
      containerHeight: 600,
      spacing: 16,
      colorMode: 'rgb'
    };

    expect(options.defaultFont?.family).toBe('Inter');
    expect(options.containerWidth).toBe(800);
    expect(options.colorMode).toBe('rgb');
  });

  test('部分的なオプションを設定できる', () => {
    const options: ConversionOptions = {
      colorMode: 'hex'
    };

    expect(options.colorMode).toBe('hex');
    expect(options.defaultFont).toBeUndefined();
  });
});