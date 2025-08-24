import { test, expect } from 'vitest';
import type { FigmaNodeConfig } from '../figma-node-config';
import { FigmaNodeConfig as FigmaNode } from '../figma-node-config';
import { Paint } from '../../../paint';

test('applyHtmlElementDefaults: デフォルト設定を適用する', () => {
  const config: FigmaNodeConfig = {
    type: 'FRAME',
    name: 'test'
  };
  
  const result = FigmaNode.applyHtmlElementDefaults(config, 'div', {
    id: 'container',
    class: 'wrapper main'
  });
  
  expect(result.layoutMode).toBe('VERTICAL');
  expect(result.layoutSizingHorizontal).toBe('FILL');
  expect(result.name).toBe('div#container');
});

test('applyHtmlElementDefaults: クラスのみの場合', () => {
  const config: FigmaNodeConfig = {
    type: 'FRAME',
    name: 'test'
  };
  
  const result = FigmaNode.applyHtmlElementDefaults(config, 'section', {
    class: 'content'
  });
  
  expect(result.name).toBe('section.content');
});

test('applyPaddingStyles: 均一なパディングを適用', () => {
  const config: FigmaNodeConfig = {
    type: 'FRAME',
    name: 'test'
  };
  
  const result = FigmaNode.applyPaddingStyles(config, 20);
  
  expect(result.paddingTop).toBe(20);
  expect(result.paddingRight).toBe(20);
  expect(result.paddingBottom).toBe(20);
  expect(result.paddingLeft).toBe(20);
});

test('applyPaddingStyles: 個別のパディングを適用', () => {
  const config: FigmaNodeConfig = {
    type: 'FRAME',
    name: 'test'
  };
  
  const result = FigmaNode.applyPaddingStyles(config, {
    top: 10,
    right: 20,
    bottom: 30,
    left: 40
  });
  
  expect(result.paddingTop).toBe(10);
  expect(result.paddingRight).toBe(20);
  expect(result.paddingBottom).toBe(30);
  expect(result.paddingLeft).toBe(40);
});

test('applyBackgroundColor: 背景色を適用', () => {
  const config: FigmaNodeConfig = {
    type: 'FRAME',
    name: 'test'
  };
  
  const color = { r: 1, g: 0, b: 0 };
  const result = FigmaNode.applyBackgroundColor(config, color);
  
  expect(result.fills).toHaveLength(1);
  expect(result.fills![0]).toEqual(Paint.solid(color));
});

test('applyFlexboxStyles: flexレイアウトを適用', () => {
  const config: FigmaNodeConfig = {
    type: 'FRAME',
    name: 'test'
  };
  
  const result = FigmaNode.applyFlexboxStyles(config, {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'space-between'
  });
  
  expect(result.layoutMode).toBe('VERTICAL');
  expect(result.itemSpacing).toBe(16);
  expect(result.counterAxisAlignItems).toBe('CENTER');
  expect(result.primaryAxisAlignItems).toBe('SPACE_BETWEEN');
});

test('applyFlexboxStyles: 横方向のflexレイアウト', () => {
  const config: FigmaNodeConfig = {
    type: 'FRAME',
    name: 'test'
  };
  
  const result = FigmaNode.applyFlexboxStyles(config, {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch'
  });
  
  expect(result.layoutMode).toBe('HORIZONTAL');
  expect(result.counterAxisAlignItems).toBe('STRETCH');
});

test('applyFlexboxStyles: flexでない場合は何も変更しない', () => {
  const config: FigmaNodeConfig = {
    type: 'FRAME',
    name: 'test',
    layoutMode: 'NONE'
  };
  
  const result = FigmaNode.applyFlexboxStyles(config, {
    display: 'block'
  });
  
  expect(result.layoutMode).toBe('NONE');
});

test('applyBorderStyles: ボーダーと角丸を適用', () => {
  const config: FigmaNodeConfig = {
    type: 'FRAME',
    name: 'test'
  };
  
  const borderColor = { r: 0, g: 0, b: 1 };
  const result = FigmaNode.applyBorderStyles(config, {
    border: { color: borderColor, width: 2 },
    borderRadius: 8
  });
  
  expect(result.strokes).toHaveLength(1);
  expect(result.strokes![0]).toEqual(Paint.solid(borderColor));
  expect(result.strokeWeight).toBe(2);
  expect(result.cornerRadius).toBe(8);
});

test('applyBorderStyles: ボーダーのみ適用', () => {
  const config: FigmaNodeConfig = {
    type: 'FRAME',
    name: 'test'
  };
  
  const borderColor = { r: 0.5, g: 0.5, b: 0.5 };
  const result = FigmaNode.applyBorderStyles(config, {
    border: { color: borderColor, width: 1 }
  });
  
  expect(result.strokes).toHaveLength(1);
  expect(result.strokeWeight).toBe(1);
  expect(result.cornerRadius).toBeUndefined();
});

test('applySizeStyles: 幅と高さを適用', () => {
  const config: FigmaNodeConfig = {
    type: 'FRAME',
    name: 'test'
  };
  
  const result = FigmaNode.applySizeStyles(config, {
    width: 500,
    height: 300
  });
  
  expect(result.width).toBe(500);
  expect(result.height).toBe(300);
});

test('applySizeStyles: 幅のみ適用', () => {
  const config: FigmaNodeConfig = {
    type: 'FRAME',
    name: 'test'
  };
  
  const result = FigmaNode.applySizeStyles(config, {
    width: 600
  });
  
  expect(result.width).toBe(600);
  expect(result.height).toBeUndefined();
});