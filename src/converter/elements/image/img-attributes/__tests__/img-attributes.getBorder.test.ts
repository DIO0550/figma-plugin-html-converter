import { test, expect } from 'vitest';
import { ImgAttributes } from '../img-attributes';

test('ImgAttributes.getBorder - ボーダーが指定されている場合 - ボーダー情報を取得できる', () => {
  const attributes: ImgAttributes = {
    style: 'border: 2px solid #ff0000'
  };
  
  const border = ImgAttributes.getBorder(attributes);
  
  expect(border).toBeTruthy();
  expect(border?.width).toBe(2);
  expect(border?.color).toEqual({ r: 1, g: 0, b: 0 });
});

test('ImgAttributes.getBorder - ボーダーがない場合 - nullを返す', () => {
  const attributes: ImgAttributes = {
    style: 'width: 100px'
  };
  
  expect(ImgAttributes.getBorder(attributes)).toBe(null);
});

test('ImgAttributes.getBorder - スタイルがない場合 - nullを返す', () => {
  const attributes: ImgAttributes = {};
  
  expect(ImgAttributes.getBorder(attributes)).toBe(null);
});
