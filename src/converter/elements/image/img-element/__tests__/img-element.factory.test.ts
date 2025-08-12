import { test, expect } from 'vitest';
import { ImgElement } from '../img-element';

test('create - 空の属性でImgElementを作成できる', () => {
  const element = ImgElement.create();
  
  expect(element.type).toBe('element');
  expect(element.tagName).toBe('img');
  expect(element.attributes).toEqual({});
  expect(element.children).toBeUndefined();
});

test('create - 属性を持つImgElementを作成できる', () => {
  const element = ImgElement.create({
    src: 'test.jpg',
    alt: 'Test Image',
    width: '200',
    height: '150'
  });
  
  expect(element.type).toBe('element');
  expect(element.tagName).toBe('img');
  expect(element.attributes.src).toBe('test.jpg');
  expect(element.attributes.alt).toBe('Test Image');
  expect(element.attributes.width).toBe('200');
  expect(element.attributes.height).toBe('150');
});

test('create - 部分的な属性でImgElementを作成できる', () => {
  const element = ImgElement.create({
    src: 'test.jpg'
  });
  
  expect(element.attributes.src).toBe('test.jpg');
  expect(element.attributes.alt).toBeUndefined();
});