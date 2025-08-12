import { describe, test, expect } from 'vitest';
import { ImgAttributes } from '../img-attributes';

describe('ImgAttributes.parseSize', () => {
  test('widthとheight属性からサイズを取得できる', () => {
    const attributes: ImgAttributes = {
      width: '200',
      height: '150'
    };
    
    const size = ImgAttributes.parseSize(attributes);
    
    expect(size.width).toBe(200);
    expect(size.height).toBe(150);
  });

  test('スタイル属性が優先される', () => {
    const attributes: ImgAttributes = {
      width: '200',
      height: '150',
      style: 'width: 300px; height: 250px'
    };
    
    const size = ImgAttributes.parseSize(attributes);
    
    expect(size.width).toBe(300);
    expect(size.height).toBe(250);
  });

  test('属性がない場合はデフォルト値を返す', () => {
    const attributes: ImgAttributes = {};
    
    const size = ImgAttributes.parseSize(attributes);
    
    expect(size.width).toBe(100);
    expect(size.height).toBe(100);
  });

  test('不正な値の場合はデフォルト値を返す', () => {
    const attributes: ImgAttributes = {
      width: 'invalid',
      height: 'abc'
    };
    
    const size = ImgAttributes.parseSize(attributes);
    
    expect(size.width).toBe(100);
    expect(size.height).toBe(100);
  });

  test('widthのみ指定された場合', () => {
    const attributes: ImgAttributes = {
      width: '250'
    };
    
    const size = ImgAttributes.parseSize(attributes);
    
    expect(size.width).toBe(250);
    expect(size.height).toBe(100);
  });

  test('heightのみ指定された場合', () => {
    const attributes: ImgAttributes = {
      height: '250'
    };
    
    const size = ImgAttributes.parseSize(attributes);
    
    expect(size.width).toBe(100);
    expect(size.height).toBe(250);
  });

  test('スタイルのwidthのみ指定された場合', () => {
    const attributes: ImgAttributes = {
      width: '200',
      height: '150',
      style: 'width: 300px'
    };
    
    const size = ImgAttributes.parseSize(attributes);
    
    expect(size.width).toBe(300);
    expect(size.height).toBe(150);
  });
});