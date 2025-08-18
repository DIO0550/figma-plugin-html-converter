import { test, expect } from 'vitest';
import { Styles } from '../styles';

test('Styles.parseColor: 16進数カラーをパースできる', () => {
    expect(Styles.parseColor('#ff0000')).toEqual({ r: 1, g: 0, b: 0 });
    expect(Styles.parseColor('#00ff00')).toEqual({ r: 0, g: 1, b: 0 });
    expect(Styles.parseColor('#0000ff')).toEqual({ r: 0, g: 0, b: 1 });
  });

test('Styles.parseColor: 3桁の16進数カラーをパースできる', () => {
    expect(Styles.parseColor('#f00')).toEqual({ r: 1, g: 0, b: 0 });
    expect(Styles.parseColor('#0f0')).toEqual({ r: 0, g: 1, b: 0 });
    expect(Styles.parseColor('#00f')).toEqual({ r: 0, g: 0, b: 1 });
  });

test('Styles.parseColor: rgb()関数をパースできる', () => {
    expect(Styles.parseColor('rgb(255, 0, 0)')).toEqual({ r: 1, g: 0, b: 0 });
    expect(Styles.parseColor('rgb(0, 255, 0)')).toEqual({ r: 0, g: 1, b: 0 });
    expect(Styles.parseColor('rgb(0, 0, 255)')).toEqual({ r: 0, g: 0, b: 1 });
  });

test('Styles.parseColor: rgba()関数をパースできる', () => {
    expect(Styles.parseColor('rgba(255, 0, 0, 0.5)')).toEqual({ r: 1, g: 0, b: 0 });
    expect(Styles.parseColor('rgba(0, 255, 0, 1)')).toEqual({ r: 0, g: 1, b: 0 });
  });

test('Styles.parseColor: 名前付きカラーをパースできる', () => {
    expect(Styles.parseColor('red')).toEqual({ r: 1, g: 0, b: 0 });
    expect(Styles.parseColor('blue')).toEqual({ r: 0, g: 0, b: 1 });
    expect(Styles.parseColor('black')).toEqual({ r: 0, g: 0, b: 0 });
    expect(Styles.parseColor('white')).toEqual({ r: 1, g: 1, b: 1 });
  });

test('Styles.parseColor: 大文字小文字を無視する', () => {
    expect(Styles.parseColor('RED')).toEqual({ r: 1, g: 0, b: 0 });
    expect(Styles.parseColor('Blue')).toEqual({ r: 0, g: 0, b: 1 });
});

test('Styles.parseColor: 不正なカラー値をnullとして処理する', () => {
  expect(Styles.parseColor('invalid')).toBeNull();
  expect(Styles.parseColor('#gggggg')).toBeNull();
  expect(Styles.parseColor('')).toBeNull();
});

test('Styles.parseColor: 特殊な名前付きカラーをパースできる', () => {
  expect(Styles.parseColor('transparent')).toEqual({ r: 0, g: 0, b: 0 });
  expect(Styles.parseColor('gray')).toEqual({ r: 0.5019607843137255, g: 0.5019607843137255, b: 0.5019607843137255 });
});

test('Styles.parseColor: currentColorやinheritをnullとして処理する', () => {
  expect(Styles.parseColor('currentColor')).toBeNull();
  expect(Styles.parseColor('inherit')).toBeNull();
});