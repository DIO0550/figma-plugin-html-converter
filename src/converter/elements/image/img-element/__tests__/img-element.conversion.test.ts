import { test, expect } from 'vitest';
import { ImgElement } from '../img-element';
import type { FigmaNodeConfig } from '../../../../models/figma-node';

test('toFigmaNode - 基本的なimg要素をRectangleに変換', () => {
  const element = ImgElement.create({
    src: 'https://example.com/image.jpg',
    width: '200',
    height: '150'
  });
  
  const figmaNode = ImgElement.toFigmaNode(element);
  
  expect(figmaNode.type).toBe('RECTANGLE');
  expect(figmaNode.width).toBe(200);
  expect(figmaNode.height).toBe(150);
  expect(figmaNode.fills).toHaveLength(1);
  expect(figmaNode.fills![0].type).toBe('IMAGE');
});

test('toFigmaNode - alt属性をノード名に反映', () => {
  const element = ImgElement.create({
    src: 'test.jpg',
    alt: 'Test Image'
  });
  
  const figmaNode = ImgElement.toFigmaNode(element);
  
  expect(figmaNode.name).toBe('img: Test Image');
});

test('toFigmaNode - 無効なURLの場合プレースホルダーを表示', () => {
  const element = ImgElement.create({
    src: '<script>alert("XSS")</script>'
  });
  
  const figmaNode = ImgElement.toFigmaNode(element);
  
  expect(figmaNode.fills).toHaveLength(1);
  expect(figmaNode.fills![0].type).toBe('SOLID');
  if (figmaNode.fills![0].type === 'SOLID') {
    expect(figmaNode.fills![0].color).toEqual({ r: 0.8, g: 0.8, b: 0.8 });
  }
});

test('toFigmaNode - srcがない場合プレースホルダーを表示', () => {
  const element = ImgElement.create();
  
  const figmaNode = ImgElement.toFigmaNode(element);
  
  expect(figmaNode.fills).toHaveLength(1);
  expect(figmaNode.fills![0].type).toBe('SOLID');
});

test('createFills - 有効なURLでIMAGE fillを作成', () => {
  const element = ImgElement.create({
    src: 'https://example.com/image.jpg'
  });
  
  const fills = ImgElement.createFills(element);
  
  expect(fills).toHaveLength(1);
  expect(fills[0].type).toBe('IMAGE');
  if (fills[0].type === 'IMAGE') {
    expect(fills[0].imageUrl).toBe('https://example.com/image.jpg');
  }
});

test('createFills - データURLでIMAGE fillを作成', () => {
  const element = ImgElement.create({
    src: 'data:image/png;base64,iVBORw0KGgo'
  });
  
  const fills = ImgElement.createFills(element);
  
  expect(fills).toHaveLength(1);
  expect(fills[0].type).toBe('IMAGE');
});

test('applyObjectFit - object-fitをscaleModeに変換', () => {
  const element = ImgElement.create({
    src: 'test.jpg',
    style: 'object-fit: cover'
  });
  
  const figmaNode: FigmaNodeConfig = {
    type: 'RECTANGLE',
    name: 'test',
    fills: [{ type: 'IMAGE', imageUrl: 'test.jpg', scaleMode: 'FILL', visible: true }]
  };
  
  ImgElement.applyObjectFit(figmaNode, element);
  
  if (figmaNode.fills && figmaNode.fills[0].type === 'IMAGE') {
    expect(figmaNode.fills[0].scaleMode).toBe('FILL');
  }
});

test('applyStyles - ボーダーを適用', () => {
  const element = ImgElement.create({
    style: 'border: 2px solid #ff0000'
  });
  
  const figmaNode: FigmaNodeConfig = {
    type: 'RECTANGLE',
    name: 'test'
  };
  
  ImgElement.applyStyles(figmaNode, element);
  
  expect(figmaNode.strokes).toHaveLength(1);
  expect(figmaNode.strokeWeight).toBe(2);
});

test('applyStyles - 角丸を適用', () => {
  const element = ImgElement.create({
    style: 'border-radius: 8px'
  });
  
  const figmaNode: FigmaNodeConfig = {
    type: 'RECTANGLE',
    name: 'test'
  };
  
  ImgElement.applyStyles(figmaNode, element);
  
  expect(figmaNode.cornerRadius).toBe(8);
});