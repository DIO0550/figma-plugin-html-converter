import { test, expect } from 'vitest';
import type { FigmaNodeConfig } from '../figma-node-config';
import { FigmaNodeConfig as FigmaNode } from '../figma-node-config';

test('isFrame: FRAME型を正しく判定する', () => {
  const frameNode: FigmaNodeConfig = {
    type: 'FRAME',
    name: 'test-frame'
  };
  expect(FigmaNode.isFrame(frameNode)).toBe(true);
  
  const textNode: FigmaNodeConfig = {
    type: 'TEXT',
    name: 'test-text'
  };
  expect(FigmaNode.isFrame(textNode)).toBe(false);
});

test('isText: TEXT型を正しく判定する', () => {
  const textNode: FigmaNodeConfig = {
    type: 'TEXT',
    name: 'test-text'
  };
  expect(FigmaNode.isText(textNode)).toBe(true);
  
  const frameNode: FigmaNodeConfig = {
    type: 'FRAME',
    name: 'test-frame'
  };
  expect(FigmaNode.isText(frameNode)).toBe(false);
});

test('isRectangle: RECTANGLE型を正しく判定する', () => {
  const rectangleNode: FigmaNodeConfig = {
    type: 'RECTANGLE',
    name: 'test-rectangle'
  };
  expect(FigmaNode.isRectangle(rectangleNode)).toBe(true);
  
  const frameNode: FigmaNodeConfig = {
    type: 'FRAME',
    name: 'test-frame'
  };
  expect(FigmaNode.isRectangle(frameNode)).toBe(false);
});

test('isGroup: GROUP型を正しく判定する', () => {
  const groupNode: FigmaNodeConfig = {
    type: 'GROUP',
    name: 'test-group'
  };
  expect(FigmaNode.isGroup(groupNode)).toBe(true);
  
  const frameNode: FigmaNodeConfig = {
    type: 'FRAME',
    name: 'test-frame'
  };
  expect(FigmaNode.isGroup(frameNode)).toBe(false);
});