import { test, expect } from 'vitest';
import { DivElement } from '../div-element';

// スタイル適用のテスト
test('背景色が正しくFigmaノードに適用される', () => {
  const element = DivElement.create({ 
    style: 'background-color: #ff0000;'
  });
  const node = DivElement.toFigmaNode(element);
  
  expect(node.fills).toBeDefined();
  expect(node.fills?.[0]).toMatchObject({
    type: 'SOLID',
    color: { r: 1, g: 0, b: 0 }
  });
});

test('パディングが正しくFigmaノードに適用される', () => {
  const element = DivElement.create({ 
    style: 'padding: 10px;'
  });
  const node = DivElement.toFigmaNode(element);
  
  expect(node.paddingTop).toBe(10);
  expect(node.paddingRight).toBe(10);
  expect(node.paddingBottom).toBe(10);
  expect(node.paddingLeft).toBe(10);
});

test('ボーダーが正しくFigmaノードに適用される', () => {
  const element = DivElement.create({ 
    style: 'border: 2px solid #000000;'
  });
  const node = DivElement.toFigmaNode(element);
  
  expect(node.strokes).toBeDefined();
  expect(node.strokes?.[0]).toMatchObject({
    type: 'SOLID',
    color: { r: 0, g: 0, b: 0 }
  });
  expect(node.strokeWeight).toBe(2);
});

test('border-radiusが正しくFigmaノードに適用される', () => {
  const element = DivElement.create({ 
    style: 'border-radius: 8px;'
  });
  const node = DivElement.toFigmaNode(element);
  
  expect(node.cornerRadius).toBe(8);
});

// test.eachを使用したサイズ設定のパラメータ化テスト
test.each([
  ['width: 300px;', { width: 300 }],
  ['height: 200px;', { height: 200 }],
  ['width: 300px; height: 200px;', { width: 300, height: 200 }]
])('スタイル%sが正しくサイズ%pに変換される', (style, expectedSize) => {
  const element = DivElement.create({ style });
  const node = DivElement.toFigmaNode(element);
  
  if ('width' in expectedSize) {
    expect(node.width).toBe(expectedSize.width);
  }
  if ('height' in expectedSize) {
    expect(node.height).toBe(expectedSize.height);
  }
});