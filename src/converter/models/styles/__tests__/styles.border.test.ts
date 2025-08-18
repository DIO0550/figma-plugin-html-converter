import { test, expect } from 'vitest';
import { Styles } from '../styles';

test('Styles.parseBorder: 完全なボーダー定義をパースできる', () => {
    const border = Styles.parseBorder('2px solid red');
    expect(border).toEqual({
      width: 2,
      style: 'solid',
      color: { r: 1, g: 0, b: 0 }
    });
  });

test('Styles.parseBorder: 順序が異なるボーダー定義をパースできる', () => {
    const border = Styles.parseBorder('solid 3px #00ff00');
    expect(border).toEqual({
      width: 3,
      style: 'solid',
      color: { r: 0, g: 1, b: 0 }
    });
  });

test('Styles.parseBorder: 一部のプロパティのみのボーダーをパースできる', () => {
    const border = Styles.parseBorder('1px');
    expect(border).toEqual({
      width: 1,
      style: 'solid',
      color: { r: 0, g: 0, b: 0 }
    });
});

test('Styles.parseBorder: 空文字列をデフォルト値で処理する', () => {
  const border = Styles.parseBorder('');
  expect(border).toEqual({
    width: 1,
    style: 'solid',
    color: { r: 0, g: 0, b: 0 }
  });
});

test('Styles.parseBorder: 不正なスタイルをデフォルト値で処理する', () => {
  const border = Styles.parseBorder('invalid-style');
  expect(border).toEqual({
    width: 1,
    style: 'solid',
    color: { r: 0, g: 0, b: 0 }
  });
});

test('Styles.parseBorder: dotted・dashedスタイルを処理する', () => {
  const dotted = Styles.parseBorder('2px dotted blue');
  expect(dotted).toEqual({
    width: 2,
    style: 'dotted',
    color: { r: 0, g: 0, b: 1 }
  });
  
  const dashed = Styles.parseBorder('3px dashed #ff0000');
  expect(dashed).toEqual({
    width: 3,
    style: 'dashed',
    color: { r: 1, g: 0, b: 0 }
  });
});

test('Styles.parseBorder: noneキーワードを処理する', () => {
  const border = Styles.parseBorder('none');
  expect(border).toEqual({
    width: 1,
    style: 'solid',
    color: { r: 0, g: 0, b: 0 }
  });
});