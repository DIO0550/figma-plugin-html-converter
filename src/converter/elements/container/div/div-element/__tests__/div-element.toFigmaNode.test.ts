import { describe, test, expect } from 'vitest';
import { DivElement } from '../div-element';

// 基本的な変換テスト
test('基本的なFrameノードを作成できる', () => {
  const element = DivElement.create();
  const node = DivElement.toFigmaNode(element);
  
  expect(node.type).toBe('FRAME');
  expect(node.name).toBe('div');
  expect(node.layoutMode).toBe('NONE');
});

// ノード名の設定テスト
test('ID属性がノード名に反映される', () => {
  const element = DivElement.create({ id: 'header' });
  const node = DivElement.toFigmaNode(element);
  
  expect(node.name).toBe('#header');
});

test('class属性の最初のクラス名がノード名に反映される', () => {
  const element = DivElement.create({ class: 'container main' });
  const node = DivElement.toFigmaNode(element);
  
  expect(node.name).toBe('.container');
});

test('IDが優先されてノード名に設定される', () => {
  const element = DivElement.create({ 
    id: 'header',
    class: 'container'
  });
  const node = DivElement.toFigmaNode(element);
  
  expect(node.name).toBe('#header');
});

// test.eachを使用したノード名のパラメータ化テスト
test.each([
  [{}, 'div'],
  [{ id: 'main' }, '#main'],
  [{ class: 'wrapper' }, '.wrapper'],
  [{ class: 'first second third' }, '.first'],
  [{ id: 'test', class: 'ignored' }, '#test']
])('属性%pの場合、ノード名は%sになる', (attributes, expectedName) => {
  const element = DivElement.create(attributes);
  const node = DivElement.toFigmaNode(element);
  
  expect(node.name).toBe(expectedName);
});