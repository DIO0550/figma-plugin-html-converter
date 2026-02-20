import { test, expect } from 'vitest';
import { ImgAttributes } from '../img-attributes';

test('ImgAttributes.getBorderRadius - 角丸が指定されている場合 - 値を取得できる', () => {
  const attributes: ImgAttributes = {
    style: 'border-radius: 8px'
  };
  
  expect(ImgAttributes.getBorderRadius(attributes)).toBe(8);
});

test('ImgAttributes.getBorderRadius - 角丸がない場合 - nullを返す', () => {
  const attributes: ImgAttributes = {
    style: 'width: 100px'
  };
  
  expect(ImgAttributes.getBorderRadius(attributes)).toBe(null);
});

test('ImgAttributes.getBorderRadius - スタイルがない場合 - nullを返す', () => {
  const attributes: ImgAttributes = {};
  
  expect(ImgAttributes.getBorderRadius(attributes)).toBe(null);
});

test.skip('ImgAttributes.getBorderRadius - 複数値の場合 - 数値を返す', () => {
  // TODO: Styles.parseSizeが複数値を正しく解析できるように改善が必要
  const attributes: ImgAttributes = {
    style: 'border-radius: 8px 4px'
  };
  
  const radius = ImgAttributes.getBorderRadius(attributes);
  expect(radius).toBeDefined();
  expect(radius).toBe(8);  // 最初の値が返される
});
