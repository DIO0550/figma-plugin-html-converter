import { describe, test, expect } from 'vitest';
import { DivElement } from '../div-element';

// 型ガードのテスト（フラット構造）
test('有効なdiv要素を正しく判定できる', () => {
  const element = {
    type: 'element',
    tagName: 'div',
    attributes: {},
    children: []
  };
  
  expect(DivElement.isDivElement(element)).toBe(true);
});

test('typeがelementでない場合はfalseを返す', () => {
  const element = {
    type: 'text',
    tagName: 'div',
    attributes: {},
    children: []
  };
  
  expect(DivElement.isDivElement(element)).toBe(false);
});

test('tagNameがdivでない場合はfalseを返す', () => {
  const element = {
    type: 'element',
    tagName: 'span',
    attributes: {},
    children: []
  };
  
  expect(DivElement.isDivElement(element)).toBe(false);
});

// test.eachを使用したパラメータ化テスト
test.each([
  [null, false],
  [undefined, false],
  ['div', false],
  [123, false],
  [true, false],
  [[], false],
  [{}, false],
  [{ type: 'element' }, false],
  [{ type: 'element', tagName: 'div' }, true], // attributesとchildrenはオプショナル
  [{ type: 'element', tagName: 'div', attributes: {}, children: [] }, true]
])('isDivElement(%p)は%pを返す', (input, expected) => {
  expect(DivElement.isDivElement(input)).toBe(expected);
});