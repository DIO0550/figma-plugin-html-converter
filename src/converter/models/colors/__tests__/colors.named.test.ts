import { test, expect } from 'vitest';
import { Colors, NAMED_COLORS } from '../colors';

test('基本的な名前付きカラーを取得できる', () => {
  const red = Colors.fromName('red');
  expect(red).toEqual({ r: 1, g: 0, b: 0 });
  
  const green = Colors.fromName('green');
  expect(green).toEqual({ r: 0, g: 0.5019607843137255, b: 0 });
  
  const blue = Colors.fromName('blue');
  expect(blue).toEqual({ r: 0, g: 0, b: 1 });
});

test('大文字小文字を区別せずに名前付きカラーを取得できる', () => {
  expect(Colors.fromName('RED')).toEqual(NAMED_COLORS.red);
  expect(Colors.fromName('Red')).toEqual(NAMED_COLORS.red);
  expect(Colors.fromName('rEd')).toEqual(NAMED_COLORS.red);
});

test('グレーの米国/英国スペルの両方を認識できる', () => {
  const gray = Colors.fromName('gray');
  const grey = Colors.fromName('grey');
  expect(gray).toEqual(grey);
  expect(gray).toEqual({ r: 0.5019607843137255, g: 0.5019607843137255, b: 0.5019607843137255 });
});

test('Web標準色を取得できる', () => {
  expect(Colors.fromName('orange')).toEqual({ r: 1, g: 0.6470588235294118, b: 0 });
  expect(Colors.fromName('purple')).toEqual({ r: 0.5019607843137255, g: 0, b: 0.5019607843137255 });
  expect(Colors.fromName('brown')).toEqual({ r: 0.6470588235294118, g: 0.16470588235294117, b: 0.16470588235294117 });
});

test('透明色を取得できる', () => {
  const transparent = Colors.fromName('transparent');
  expect(transparent).toEqual({ r: 0, g: 0, b: 0 });
});

test('存在しない名前付きカラーはnullを返す', () => {
  expect(Colors.fromName('invalid')).toBeNull();
  expect(Colors.fromName('notacolor')).toBeNull();
  expect(Colors.fromName('')).toBeNull();
});

test('黒と白を取得できる', () => {
  expect(Colors.fromName('black')).toEqual({ r: 0, g: 0, b: 0 });
  expect(Colors.fromName('white')).toEqual({ r: 1, g: 1, b: 1 });
});

test('追加の基本色を取得できる', () => {
  expect(Colors.fromName('yellow')).toEqual({ r: 1, g: 1, b: 0 });
  expect(Colors.fromName('cyan')).toEqual({ r: 0, g: 1, b: 1 });
  expect(Colors.fromName('magenta')).toEqual({ r: 1, g: 0, b: 1 });
});

test('その他のWeb標準色を取得できる', () => {
  expect(Colors.fromName('pink')).toEqual({ r: 1, g: 0.7529411764705882, b: 0.796078431372549 });
  expect(Colors.fromName('lime')).toEqual({ r: 0, g: 1, b: 0 });
  expect(Colors.fromName('navy')).toEqual({ r: 0, g: 0, b: 0.5019607843137255 });
});