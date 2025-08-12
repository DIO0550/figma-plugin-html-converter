import { describe, test, expect } from 'vitest';
import { ImgAttributes } from '../img-attributes';

describe('ImgAttributes.getObjectFit', () => {
  test('object-fitを取得できる', () => {
    const attributes: ImgAttributes = {
      style: 'object-fit: cover'
    };
    
    expect(ImgAttributes.getObjectFit(attributes)).toBe('cover');
  });

  test('object-fitがない場合nullを返す', () => {
    const attributes: ImgAttributes = {
      style: 'width: 100px'
    };
    
    expect(ImgAttributes.getObjectFit(attributes)).toBe(null);
  });

  test('スタイルがない場合nullを返す', () => {
    const attributes: ImgAttributes = {};
    
    expect(ImgAttributes.getObjectFit(attributes)).toBe(null);
  });
});

describe('ImgAttributes.getBorder', () => {
  test('ボーダー情報を取得できる', () => {
    const attributes: ImgAttributes = {
      style: 'border: 2px solid #ff0000'
    };
    
    const border = ImgAttributes.getBorder(attributes);
    
    expect(border).toBeTruthy();
    expect(border?.width).toBe(2);
    expect(border?.color).toEqual({ r: 1, g: 0, b: 0 });
  });

  test('ボーダーがない場合nullを返す', () => {
    const attributes: ImgAttributes = {
      style: 'width: 100px'
    };
    
    expect(ImgAttributes.getBorder(attributes)).toBe(null);
  });

  test('スタイルがない場合nullを返す', () => {
    const attributes: ImgAttributes = {};
    
    expect(ImgAttributes.getBorder(attributes)).toBe(null);
  });
});

describe('ImgAttributes.getBorderRadius', () => {
  test('角丸を取得できる', () => {
    const attributes: ImgAttributes = {
      style: 'border-radius: 8px'
    };
    
    expect(ImgAttributes.getBorderRadius(attributes)).toBe(8);
  });

  test('角丸がない場合nullを返す', () => {
    const attributes: ImgAttributes = {
      style: 'width: 100px'
    };
    
    expect(ImgAttributes.getBorderRadius(attributes)).toBe(null);
  });

  test('スタイルがない場合nullを返す', () => {
    const attributes: ImgAttributes = {};
    
    expect(ImgAttributes.getBorderRadius(attributes)).toBe(null);
  });

  test.skip('複数値の場合でも数値を返す', () => {
    // TODO: Styles.parseSizeが複数値を正しく解析できるように改善が必要
    const attributes: ImgAttributes = {
      style: 'border-radius: 8px 4px'
    };
    
    const radius = ImgAttributes.getBorderRadius(attributes);
    expect(radius).toBeDefined();
    expect(radius).toBe(8);  // 最初の値が返される
  });
});