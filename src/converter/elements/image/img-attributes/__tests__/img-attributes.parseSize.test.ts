import { test, expect } from 'vitest';
import { ImgAttributes } from '../img-attributes';

test('ImgAttributes.parseSize - widthとheight属性 - サイズを取得できる', () => {
  const attributes: ImgAttributes = {
    width: '200',
    height: '150'
  };
  
  const size = ImgAttributes.parseSize(attributes);
  
  expect(size.width).toBe(200);
  expect(size.height).toBe(150);
});

test('ImgAttributes.parseSize - スタイル属性指定 - 属性より優先される', () => {
  const attributes: ImgAttributes = {
    width: '200',
    height: '150',
    style: 'width: 300px; height: 250px'
  };
  
  const size = ImgAttributes.parseSize(attributes);
  
  expect(size.width).toBe(300);
  expect(size.height).toBe(250);
});

test('ImgAttributes.parseSize - 属性なし - デフォルト値を返す', () => {
  const attributes: ImgAttributes = {};
  
  const size = ImgAttributes.parseSize(attributes);
  
  expect(size.width).toBe(100);
  expect(size.height).toBe(100);
});

test('ImgAttributes.parseSize - 不正な値 - デフォルト値を返す', () => {
  const attributes: ImgAttributes = {
    width: 'invalid',
    height: 'abc'
  };
  
  const size = ImgAttributes.parseSize(attributes);
  
  expect(size.width).toBe(100);
  expect(size.height).toBe(100);
});

test('ImgAttributes.parseSize - widthのみ指定 - heightはデフォルト値', () => {
  const attributes: ImgAttributes = {
    width: '250'
  };
  
  const size = ImgAttributes.parseSize(attributes);
  
  expect(size.width).toBe(250);
  expect(size.height).toBe(100);
});

test('ImgAttributes.parseSize - heightのみ指定 - widthはデフォルト値', () => {
  const attributes: ImgAttributes = {
    height: '250'
  };
  
  const size = ImgAttributes.parseSize(attributes);
  
  expect(size.width).toBe(100);
  expect(size.height).toBe(250);
});

test('ImgAttributes.parseSize - スタイルのwidthのみ指定 - heightは属性値', () => {
  const attributes: ImgAttributes = {
    width: '200',
    height: '150',
    style: 'width: 300px'
  };
  
  const size = ImgAttributes.parseSize(attributes);
  
  expect(size.width).toBe(300);
  expect(size.height).toBe(150);
});