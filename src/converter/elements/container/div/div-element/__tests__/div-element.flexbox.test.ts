import { test, expect } from 'vitest';
import { DivElement } from '../div-element';

// Flexboxスタイルのテスト
test('display:flexでlayoutModeがHORIZONTALに設定される', () => {
  const element = DivElement.create({ 
    style: 'display: flex;'
  });
  const node = DivElement.toFigmaNode(element);
  
  expect(node.layoutMode).toBe('HORIZONTAL');
});

test('flex-direction:columnでlayoutModeがVERTICALに設定される', () => {
  const element = DivElement.create({ 
    style: 'display: flex; flex-direction: column;'
  });
  const node = DivElement.toFigmaNode(element);
  
  expect(node.layoutMode).toBe('VERTICAL');
});

test('gapがitemSpacingに正しく変換される', () => {
  const element = DivElement.create({ 
    style: 'display: flex; gap: 20px;'
  });
  const node = DivElement.toFigmaNode(element);
  
  expect(node.itemSpacing).toBe(20);
});

// test.eachを使用したalign-itemsのパラメータ化テスト
test.each([
  ['flex-start', 'MIN'],
  ['center', 'CENTER'],
  ['flex-end', 'MAX'],
  ['stretch', 'STRETCH']
])('align-items:%sがcounterAxisAlignItems:%sに変換される', (cssValue, figmaValue: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH') => {
  const element = DivElement.create({ 
    style: `display: flex; align-items: ${cssValue};`
  });
  const node = DivElement.toFigmaNode(element);
  
  expect(node.counterAxisAlignItems).toBe(figmaValue);
});

// test.eachを使用したjustify-contentのパラメータ化テスト
test.each([
  ['flex-start', 'MIN'],
  ['center', 'CENTER'],
  ['flex-end', 'MAX'],
  ['space-between', 'SPACE_BETWEEN']
])('justify-content:%sがprimaryAxisAlignItems:%sに変換される', (cssValue, figmaValue) => {
  const element = DivElement.create({ 
    style: `display: flex; justify-content: ${cssValue};`
  });
  const node = DivElement.toFigmaNode(element);
  
  expect(node.primaryAxisAlignItems).toBe(figmaValue);
});

test('複数のFlexboxプロパティが同時に適用される', () => {
  const element = DivElement.create({ 
    style: 'display: flex; flex-direction: column; gap: 20px; align-items: center; justify-content: space-between;'
  });
  const node = DivElement.toFigmaNode(element);
  
  expect(node.layoutMode).toBe('VERTICAL');
  expect(node.itemSpacing).toBe(20);
  expect(node.primaryAxisAlignItems).toBe('SPACE_BETWEEN');
  expect(node.counterAxisAlignItems).toBe('CENTER');
});