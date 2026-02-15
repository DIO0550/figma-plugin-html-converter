import { test, expect } from 'vitest';
import type { GlobalAttributes } from '..';

test('GlobalAttributes - 共通HTML属性 - 正しく定義できる', () => {
  const attributes: GlobalAttributes = {
    id: 'test-id',
    className: 'test-class another-class',
    style: 'color: red; background: blue;',
    title: 'Test Title',
    lang: 'ja',
    dir: 'ltr'
  };

  expect(attributes.id).toBe('test-id');
  expect(attributes.className).toBe('test-class another-class');
  expect(attributes.style).toBe('color: red; background: blue;');
  expect(attributes.title).toBe('Test Title');
  expect(attributes.lang).toBe('ja');
  expect(attributes.dir).toBe('ltr');
});

test('GlobalAttributes - 全属性が省略可能 - 空オブジェクトを許容する', () => {
  const emptyAttributes: GlobalAttributes = {};
  
  expect(emptyAttributes).toEqual({});
});

test('GlobalAttributes - data属性 - サポートする', () => {
  const attributes: GlobalAttributes = {
    'data-test': 'value',
    'data-id': '123',
    'data-custom-attribute': 'custom-value'
  };

  expect(attributes['data-test']).toBe('value');
  expect(attributes['data-id']).toBe('123');
  expect(attributes['data-custom-attribute']).toBe('custom-value');
});

test('GlobalAttributes - aria属性 - サポートする', () => {
  const attributes: GlobalAttributes = {
    'aria-label': 'Button Label',
    'aria-hidden': 'true',
    'aria-describedby': 'description-id',
    'aria-live': 'polite'
  };

  expect(attributes['aria-label']).toBe('Button Label');
  expect(attributes['aria-hidden']).toBe('true');
  expect(attributes['aria-describedby']).toBe('description-id');
  expect(attributes['aria-live']).toBe('polite');
});

test('GlobalAttributes - イベントハンドラ - サポートする', () => {
  const attributes: GlobalAttributes = {
    onclick: 'handleClick()',
    onmouseover: 'handleMouseOver()',
    onkeydown: 'handleKeyDown(event)'
  };

  expect(attributes.onclick).toBe('handleClick()');
  expect(attributes.onmouseover).toBe('handleMouseOver()');
  expect(attributes.onkeydown).toBe('handleKeyDown(event)');
});

test('GlobalAttributes - アクセシビリティ属性(文字列型) - サポートする', () => {
  const attributes: GlobalAttributes = {
    tabindex: '0',
    role: 'button',
    accesskey: 'b'
  };

  expect(attributes.tabindex).toBe('0');
  expect(attributes.role).toBe('button');
  expect(attributes.accesskey).toBe('b');
});

test('GlobalAttributes - アクセシビリティ属性(数値型) - サポートする', () => {
  const attributes: GlobalAttributes = {
    tabindex: -1,
    role: 'navigation'
  };

  expect(attributes.tabindex).toBe(-1);
  expect(attributes.role).toBe('navigation');
});

test('GlobalAttributes - メタデータ属性(文字列型) - サポートする', () => {
  const attributes: GlobalAttributes = {
    hidden: 'true',
    draggable: 'true',
    contenteditable: 'true',
    spellcheck: 'false'
  };

  expect(attributes.hidden).toBe('true');
  expect(attributes.draggable).toBe('true');
  expect(attributes.contenteditable).toBe('true');
  expect(attributes.spellcheck).toBe('false');
});

test('GlobalAttributes - メタデータ属性(boolean型) - サポートする', () => {
  const attributes: GlobalAttributes = {
    hidden: true,
    draggable: false,
    contenteditable: 'inherit',
    spellcheck: true
  };

  expect(attributes.hidden).toBe(true);
  expect(attributes.draggable).toBe(false);
  expect(attributes.contenteditable).toBe('inherit');
  expect(attributes.spellcheck).toBe(true);
});

test('GlobalAttributes - dir属性 - 厳密な型でサポートする', () => {
  const ltrAttributes: GlobalAttributes = { dir: 'ltr' };
  const rtlAttributes: GlobalAttributes = { dir: 'rtl' };
  const autoAttributes: GlobalAttributes = { dir: 'auto' };

  expect(ltrAttributes.dir).toBe('ltr');
  expect(rtlAttributes.dir).toBe('rtl');
  expect(autoAttributes.dir).toBe('auto');
});