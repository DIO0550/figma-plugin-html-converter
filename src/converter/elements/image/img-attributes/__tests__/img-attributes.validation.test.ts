import { describe, test, expect } from 'vitest';
import { ImgAttributes } from '../img-attributes';

describe('ImgAttributes.isValidUrl', () => {
  test('データURLを有効と判定する', () => {
    const url = 'data:image/png;base64,iVBORw0KGgo';
    expect(ImgAttributes.isValidUrl(url)).toBe(true);
  });

  test('http URLを有効と判定する', () => {
    expect(ImgAttributes.isValidUrl('http://example.com/image.jpg')).toBe(true);
  });

  test('https URLを有効と判定する', () => {
    expect(ImgAttributes.isValidUrl('https://example.com/image.jpg')).toBe(true);
  });

  test('絶対パスを有効と判定する', () => {
    expect(ImgAttributes.isValidUrl('/images/photo.jpg')).toBe(true);
  });

  test('相対パスを有効と判定する', () => {
    expect(ImgAttributes.isValidUrl('./images/photo.jpg')).toBe(true);
    expect(ImgAttributes.isValidUrl('../images/photo.jpg')).toBe(true);
  });

  test('空のURLを無効と判定する', () => {
    expect(ImgAttributes.isValidUrl('')).toBe(false);
    expect(ImgAttributes.isValidUrl(undefined)).toBe(false);
  });

  test('XSS攻撃を含むURLを無効と判定する', () => {
    expect(ImgAttributes.isValidUrl('javascript:alert("XSS")')).toBe(false);
    expect(ImgAttributes.isValidUrl('<script>alert("XSS")</script>')).toBe(false);
    expect(ImgAttributes.isValidUrl('><img src=x onerror=alert(1)>')).toBe(false);
  });

  test('通常のファイル名を有効と判定する', () => {
    expect(ImgAttributes.isValidUrl('image.jpg')).toBe(true);
    expect(ImgAttributes.isValidUrl('photo_001.png')).toBe(true);
  });
});