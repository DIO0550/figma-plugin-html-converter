import { test, expect } from 'vitest';
import type { 
  ExtractTagName,
  IsVoidElement,
  ElementChildren,
  StrictAttributes
} from '..';
import type { BaseElement } from '../../base-element';

test('ExtractTagName - BaseElementから - tagNameを抽出できる', () => {
  type DivElement = BaseElement<'div'>;
  type TagName = ExtractTagName<DivElement>;
  
  const tagName: TagName = 'div';
  expect(tagName).toBe('div');
});

test('IsVoidElement - void要素 - 正しく判定できる', () => {
  type ImgVoid = IsVoidElement<'img'>;
  type DivVoid = IsVoidElement<'div'>;
  type InputVoid = IsVoidElement<'input'>;
  type BrVoid = IsVoidElement<'br'>;
  type HrVoid = IsVoidElement<'hr'>;
  
  const imgVoid: ImgVoid = true;
  const divVoid: DivVoid = false;
  const inputVoid: InputVoid = true;
  const brVoid: BrVoid = true;
  const hrVoid: HrVoid = true;
  
  expect(imgVoid).toBe(true);
  expect(divVoid).toBe(false);
  expect(inputVoid).toBe(true);
  expect(brVoid).toBe(true);
  expect(hrVoid).toBe(true);
});

test('ElementChildren - 要素タイプに基づいて - children型を決定できる', () => {
  type ImgChildren = ElementChildren<'img'>;
  type DivChildren = ElementChildren<'div'>;
  
  const imgChildren: ImgChildren = undefined;
  const divChildren: DivChildren = [];
  
  expect(imgChildren).toBeUndefined();
  expect(divChildren).toEqual([]);
});

test('StrictAttributes - 要素固有属性とグローバル属性 - マージできる', () => {
  interface DivSpecificAttributes {
    align?: 'left' | 'center' | 'right';
  }
  
  type DivAttributes = StrictAttributes<DivSpecificAttributes>;
  
  const attributes: DivAttributes = {
    id: 'test',
    className: 'container',
    align: 'center',
    'data-test': 'value',
    'aria-label': 'Container'
  };
  
  expect(attributes.id).toBe('test');
  expect(attributes.className).toBe('container');
  expect(attributes.align).toBe('center');
  expect(attributes['data-test']).toBe('value');
  expect(attributes['aria-label']).toBe('Container');
});

test('TypeGuard - 型ガードユーティリティ - 正しく動作する', () => {
  const isString = (value: unknown): value is string => {
    return typeof value === 'string';
  };
  
  const isNumber = (value: unknown): value is number => {
    return typeof value === 'number';
  };
  
  expect(isString('test')).toBe(true);
  expect(isString(123)).toBe(false);
  expect(isNumber(123)).toBe(true);
  expect(isNumber('test')).toBe(false);
});