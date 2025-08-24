import { test, expect } from 'vitest';
import { FigmaNodeConfig } from '../figma-node-config';

test('createFrame: FRAMEノードを作成する', () => {
  const frame = FigmaNodeConfig.createFrame('test-frame', {
    width: 100,
    height: 200
  });
  
  expect(frame.type).toBe('FRAME');
  expect(frame.name).toBe('test-frame');
  expect(frame.width).toBe(100);
  expect(frame.height).toBe(200);
});

test('createText: TEXTノードを作成する', () => {
  const text = FigmaNodeConfig.createText('Hello World');
  
  expect(text.type).toBe('TEXT');
  expect(text.name).toBe('Hello World');
});

test('createRectangle: RECTANGLEノードを作成する', () => {
  const rectangle = FigmaNodeConfig.createRectangle('test-rectangle', {
    width: 150,
    height: 75
  });
  
  expect(rectangle.type).toBe('RECTANGLE');
  expect(rectangle.name).toBe('test-rectangle');
  expect(rectangle.width).toBe(150);
  expect(rectangle.height).toBe(75);
});

test('createGroup: GROUPノードを作成する', () => {
  const group = FigmaNodeConfig.createGroup('test-group', {
    x: 10,
    y: 20
  });
  
  expect(group.type).toBe('GROUP');
  expect(group.name).toBe('test-group');
  expect(group.x).toBe(10);
  expect(group.y).toBe(20);
});