import { test, expect } from 'vitest';
import { ImgAttributes } from '../img-attributes';

test('ImgAttributes.isValidUrl - データURL - 有効と判定する', () => {
  const url = 'data:image/png;base64,iVBORw0KGgo';
  expect(ImgAttributes.isValidUrl(url)).toBe(true);
});

test('ImgAttributes.isValidUrl - http URL - 有効と判定する', () => {
  expect(ImgAttributes.isValidUrl('http://example.com/image.jpg')).toBe(true);
});

test('ImgAttributes.isValidUrl - https URL - 有効と判定する', () => {
  expect(ImgAttributes.isValidUrl('https://example.com/image.jpg')).toBe(true);
});

test('ImgAttributes.isValidUrl - 絶対パス - 有効と判定する', () => {
  expect(ImgAttributes.isValidUrl('/images/photo.jpg')).toBe(true);
});

test('ImgAttributes.isValidUrl - 相対パス - 有効と判定する', () => {
  expect(ImgAttributes.isValidUrl('./images/photo.jpg')).toBe(true);
  expect(ImgAttributes.isValidUrl('../images/photo.jpg')).toBe(true);
});

test('ImgAttributes.isValidUrl - 空のURL - 無効と判定する', () => {
  expect(ImgAttributes.isValidUrl('')).toBe(false);
  expect(ImgAttributes.isValidUrl(undefined)).toBe(false);
});

test('ImgAttributes.isValidUrl - XSS攻撃を含むURL - 無効と判定する', () => {
  expect(ImgAttributes.isValidUrl('javascript:alert("XSS")')).toBe(false);
  expect(ImgAttributes.isValidUrl('<script>alert("XSS")</script>')).toBe(false);
  expect(ImgAttributes.isValidUrl('><img src=x onerror=alert(1)>')).toBe(false);
});

test('ImgAttributes.isValidUrl - 通常のファイル名 - 有効と判定する', () => {
  expect(ImgAttributes.isValidUrl('image.jpg')).toBe(true);
  expect(ImgAttributes.isValidUrl('photo_001.png')).toBe(true);
});