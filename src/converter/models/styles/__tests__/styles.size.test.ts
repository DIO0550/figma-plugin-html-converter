import { test, expect } from 'vitest';
import { Styles } from '../styles';

test('Styles.parseSize: ピクセル値をパースできる', () => {
    expect(Styles.parseSize('100px')).toBe(100);
    expect(Styles.parseSize('50.5px')).toBe(50.5);
  });

test('Styles.parseSize: 単位なしの数値をパースできる', () => {
    expect(Styles.parseSize('100')).toBe(100);
    expect(Styles.parseSize('50.5')).toBe(50.5);
  });

test('Styles.parseSize: 他の単位をパースできる', () => {
    expect(Styles.parseSize('100%')).toEqual({ value: 100, unit: '%' });
    // rem/emはピクセルに変換される（デフォルト16px）
    expect(Styles.parseSize('2em')).toEqual(32); // 2 * 16
    expect(Styles.parseSize('1.5rem')).toEqual(24); // 1.5 * 16
    // vh/vwもピクセルに変換される
    expect(Styles.parseSize('50vw')).toEqual(960); // 50 * 19.2
    expect(Styles.parseSize('50vh')).toEqual(540); // 50 * 10.8
  });

test('Styles.parseSize: 特殊な値を処理できる', () => {
    expect(Styles.parseSize('auto')).toBeNull();
    expect(Styles.parseSize('inherit')).toBeNull();
  });

test('Styles.parseSize: 不正な値を処理できる', () => {
    expect(Styles.parseSize('invalid')).toBeNull();
    expect(Styles.parseSize('')).toBeNull();
    expect(Styles.parseSize(undefined)).toBeNull();
});

test('Styles.parseSize: calc関数を処理できる', () => {
  expect(Styles.parseSize('calc(100% - 20px)')).toEqual({ value: 100, unit: '%' });
  expect(Styles.parseSize('calc(50px + 10px)')).toBe(60);
});

test('Styles.parseSize: 極端に大きい値を処理できる', () => {
  expect(Styles.parseSize('999999px')).toBe(999999);
  expect(Styles.parseSize('0.0001px')).toBe(0.0001);
});

test('Styles.parseSize: ゼロ値を処理できる', () => {
  expect(Styles.parseSize('0')).toBe(0);
  expect(Styles.parseSize('0px')).toBe(0);
  expect(Styles.parseSize('0em')).toBe(0);
});