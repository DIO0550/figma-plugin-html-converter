import { test, expect } from 'vitest';
import { ImgElement } from '../img-element';

test('getSrc - src属性を取得できる', () => {
  const element = ImgElement.create({ src: 'test.jpg' });
  expect(ImgElement.getSrc(element)).toBe('test.jpg');
});

test('getSrc - srcがない場合undefinedを返す', () => {
  const element = ImgElement.create();
  expect(ImgElement.getSrc(element)).toBeUndefined();
});

test('getAlt - alt属性を取得できる', () => {
  const element = ImgElement.create({ alt: 'Test Image' });
  expect(ImgElement.getAlt(element)).toBe('Test Image');
});

test('getAlt - altがない場合undefinedを返す', () => {
  const element = ImgElement.create();
  expect(ImgElement.getAlt(element)).toBeUndefined();
});

test('getWidth - width属性を取得できる', () => {
  const element = ImgElement.create({ width: '200' });
  expect(ImgElement.getWidth(element)).toBe('200');
});

test('getHeight - height属性を取得できる', () => {
  const element = ImgElement.create({ height: '150' });
  expect(ImgElement.getHeight(element)).toBe('150');
});

test('getStyle - style属性を取得できる', () => {
  const element = ImgElement.create({ style: 'width: 100px' });
  expect(ImgElement.getStyle(element)).toBe('width: 100px');
});

test('getNodeName - altがある場合"img: [alt]"を返す', () => {
  const element = ImgElement.create({ alt: 'Test Image' });
  expect(ImgElement.getNodeName(element)).toBe('img: Test Image');
});

test('getNodeName - altがない場合"img"を返す', () => {
  const element = ImgElement.create();
  expect(ImgElement.getNodeName(element)).toBe('img');
});