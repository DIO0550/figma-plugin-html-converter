import { test, expect } from 'vitest';
import { ImgAttributes } from '../img-attributes';

test('ImgAttributes.getObjectFit - object-fitが指定されている場合 - 値を取得できる', () => {
  const attributes: ImgAttributes = {
    style: 'object-fit: cover'
  };
  
  expect(ImgAttributes.getObjectFit(attributes)).toBe('cover');
});

test('ImgAttributes.getObjectFit - object-fitがない場合 - nullを返す', () => {
  const attributes: ImgAttributes = {
    style: 'width: 100px'
  };
  
  expect(ImgAttributes.getObjectFit(attributes)).toBe(null);
});

test('ImgAttributes.getObjectFit - スタイルがない場合 - nullを返す', () => {
  const attributes: ImgAttributes = {};
  
  expect(ImgAttributes.getObjectFit(attributes)).toBe(null);
});
