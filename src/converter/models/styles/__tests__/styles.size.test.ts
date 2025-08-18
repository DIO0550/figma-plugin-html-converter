import { describe, test, expect } from 'vitest';
import { Styles } from '../styles';

describe('Styles.parseSize', () => {
  test('ピクセル値をパースできる', () => {
    expect(Styles.parseSize('100px')).toBe(100);
    expect(Styles.parseSize('50.5px')).toBe(50.5);
  });

  test('単位なしの数値をパースできる', () => {
    expect(Styles.parseSize('100')).toBe(100);
    expect(Styles.parseSize('50.5')).toBe(50.5);
  });

  test('他の単位をパースできる', () => {
    expect(Styles.parseSize('100%')).toEqual({ value: 100, unit: '%' });
    // rem/emはピクセルに変換される（デフォルト16px）
    expect(Styles.parseSize('2em')).toEqual(32); // 2 * 16
    expect(Styles.parseSize('1.5rem')).toEqual(24); // 1.5 * 16
    // vh/vwもピクセルに変換される
    expect(Styles.parseSize('50vw')).toEqual(960); // 50 * 19.2
    expect(Styles.parseSize('50vh')).toEqual(540); // 50 * 10.8
  });

  test('特殊な値を処理できる', () => {
    expect(Styles.parseSize('auto')).toBeNull();
    expect(Styles.parseSize('inherit')).toBeNull();
  });

  test('不正な値を処理できる', () => {
    expect(Styles.parseSize('invalid')).toBeNull();
    expect(Styles.parseSize('')).toBeNull();
    expect(Styles.parseSize(undefined)).toBeNull();
  });
});