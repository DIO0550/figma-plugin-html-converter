import { test, expect } from 'vitest';
import type { FigmaNodeConfig } from '../figma-node-config';
import { FigmaNodeConfig as FigmaNode } from '../figma-node-config';
import { Paint } from '../../../paint';

test('setSize: サイズを設定する', () => {
  const node: FigmaNodeConfig = {
    type: 'FRAME',
    name: 'test'
  };
  
  FigmaNode.setSize(node, 300, 400);
  
  expect(node.width).toBe(300);
  expect(node.height).toBe(400);
});

test('setPosition: 位置を設定する', () => {
  const node: FigmaNodeConfig = {
    type: 'FRAME',
    name: 'test'
  };
  
  FigmaNode.setPosition(node, 50, 100);
  
  expect(node.x).toBe(50);
  expect(node.y).toBe(100);
});

test('setFills: fillsを設定する', () => {
  const node: FigmaNodeConfig = {
    type: 'FRAME',
    name: 'test'
  };
  
  const fills = [Paint.solid({ r: 1, g: 0, b: 0 })];
  FigmaNode.setFills(node, fills);
  
  expect(node.fills).toEqual(fills);
});

test('setStrokes: strokesとweightを設定する', () => {
  const node: FigmaNodeConfig = {
    type: 'FRAME',
    name: 'test'
  };
  
  const strokes = [Paint.solid({ r: 0, g: 0, b: 1 })];
  FigmaNode.setStrokes(node, strokes, 2);
  
  expect(node.strokes).toEqual(strokes);
  expect(node.strokeWeight).toBe(2);
});

test('setCornerRadius: 角丸を設定する', () => {
  const node: FigmaNodeConfig = {
    type: 'FRAME',
    name: 'test'
  };
  
  FigmaNode.setCornerRadius(node, 8);
  
  expect(node.cornerRadius).toBe(8);
});

test('setAutoLayout: Auto Layoutプロパティを設定する', () => {
  const node: FigmaNodeConfig = {
    type: 'FRAME',
    name: 'test'
  };
  
  FigmaNode.setAutoLayout(node, {
    mode: 'HORIZONTAL',
    spacing: 16,
    padding: {
      top: 10,
      right: 20,
      bottom: 30,
      left: 40
    },
    primaryAxisAlign: 'CENTER',
    counterAxisAlign: 'STRETCH'
  });
  
  expect(node.layoutMode).toBe('HORIZONTAL');
  expect(node.itemSpacing).toBe(16);
  expect(node.paddingTop).toBe(10);
  expect(node.paddingRight).toBe(20);
  expect(node.paddingBottom).toBe(30);
  expect(node.paddingLeft).toBe(40);
  expect(node.primaryAxisAlignItems).toBe('CENTER');
  expect(node.counterAxisAlignItems).toBe('STRETCH');
});