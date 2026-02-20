import { test, expect } from 'vitest';
import type { BaseElement } from '..';

test('BaseElement - 有効なインターフェース - 正しい構造を持つ', () => {
  const divElement: BaseElement<'div'> = {
    type: 'element',
    tagName: 'div',
    children: []
  };

  expect(divElement.type).toBe('element');
  expect(divElement.tagName).toBe('div');
  expect(divElement.children).toEqual([]);
});

test('BaseElement - children省略可能 - undefinedを許容する', () => {
  const imgElement: BaseElement<'img'> = {
    type: 'element',
    tagName: 'img'
  };

  expect(imgElement.type).toBe('element');
  expect(imgElement.tagName).toBe('img');
  expect(imgElement.children).toBeUndefined();
});

test('BaseElement - 特定のtagName型 - 強制する', () => {
  const pElement: BaseElement<'p'> = {
    type: 'element',
    tagName: 'p'
  };

  expect(pElement.tagName).toBe('p');
});

test('BaseElement - ネスト要素 - サポートする', () => {
  const spanElement: BaseElement<'span'> = {
    type: 'element',
    tagName: 'span'
  };

  const divElement: BaseElement<'div'> = {
    type: 'element',
    tagName: 'div',
    children: [spanElement as unknown]
  };

  expect(divElement.children).toHaveLength(1);
  expect((divElement.children![0] as BaseElement<'span'>).tagName).toBe('span');
});