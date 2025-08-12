import { test, expect } from 'vitest';
import { ImgElement } from '../img-element';

test('isImgElement - img要素を正しく判定する', () => {
  const node = {
    type: 'element',
    tagName: 'img',
    attributes: { src: 'test.jpg' }
  };
  
  expect(ImgElement.isImgElement(node)).toBe(true);
});

test('isImgElement - 他の要素をfalseと判定する', () => {
  const node = {
    type: 'element',
    tagName: 'div',
    attributes: {}
  };
  
  expect(ImgElement.isImgElement(node)).toBe(false);
});

test('isImgElement - テキストノードをfalseと判定する', () => {
  const node = {
    type: 'text',
    content: 'Hello'
  };
  
  expect(ImgElement.isImgElement(node)).toBe(false);
});

test('isImgElement - nullをfalseと判定する', () => {
  expect(ImgElement.isImgElement(null)).toBe(false);
});

test('isImgElement - undefinedをfalseと判定する', () => {
  expect(ImgElement.isImgElement(undefined)).toBe(false);
});

test('isImgElement - 空オブジェクトをfalseと判定する', () => {
  expect(ImgElement.isImgElement({})).toBe(false);
});

test('isImgElement - tagNameがない場合falseを返す', () => {
  const node = {
    type: 'element',
    attributes: {}
  };
  
  expect(ImgElement.isImgElement(node)).toBe(false);
});

test('isImgElement - typeが違う場合falseを返す', () => {
  const node = {
    type: 'other',
    tagName: 'img',
    attributes: {}
  };
  
  expect(ImgElement.isImgElement(node)).toBe(false);
});