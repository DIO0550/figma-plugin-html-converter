import { test, expect } from 'vitest';
import { ImgElement } from '../img-element';

test('mapToFigma - ImgElementを変換できる', () => {
  const node = {
    type: 'element' as const,
    tagName: 'img',
    attributes: {
      src: 'test.jpg',
      width: '200',
      height: '150'
    }
  };
  
  const result = ImgElement.mapToFigma(node);
  
  expect(result).toBeTruthy();
  expect(result?.type).toBe('RECTANGLE');
  expect(result?.width).toBe(200);
  expect(result?.height).toBe(150);
});

test('mapToFigma - HTMLNode互換オブジェクトを変換できる', () => {
  const node = {
    type: 'element' as const,
    tagName: 'img',
    attributes: {
      src: 'test.jpg'
    }
  };
  
  const result = ImgElement.mapToFigma(node);
  
  expect(result).toBeTruthy();
  expect(result?.type).toBe('RECTANGLE');
});

test('mapToFigma - img要素でない場合nullを返す', () => {
  const node = {
    type: 'element' as const,
    tagName: 'div',
    attributes: {}
  };
  
  const result = ImgElement.mapToFigma(node);
  
  expect(result).toBeNull();
});

test('mapToFigma - テキストノードの場合nullを返す', () => {
  const node = {
    type: 'text' as const,
    content: 'Hello'
  };
  
  const result = ImgElement.mapToFigma(node);
  
  expect(result).toBeNull();
});

test('fromHTMLNode - ImgElementをそのまま返す', () => {
  const element = ImgElement.create({ src: 'test.jpg' });
  
  const result = ImgElement.fromHTMLNode(element);
  
  expect(result).toBe(element);
});

test('fromHTMLNode - HTMLNode互換オブジェクトをImgElementに変換', () => {
  const node = {
    type: 'element' as const,
    tagName: 'img',
    attributes: {
      src: 'test.jpg',
      alt: 'Test'
    }
  };
  
  const result = ImgElement.fromHTMLNode(node);
  
  expect(result).toBeTruthy();
  expect(result?.tagName).toBe('img');
  expect(result?.attributes.src).toBe('test.jpg');
  expect(result?.attributes.alt).toBe('Test');
});

test('fromHTMLNode - 非img要素の場合nullを返す', () => {
  const node = {
    type: 'element' as const,
    tagName: 'div',
    attributes: {}
  };
  
  const result = ImgElement.fromHTMLNode(node);
  
  expect(result).toBeNull();
});