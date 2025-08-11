import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { CSSValueAdapter } from './adapter';

describe('CSSValueAdapter', () => {
  beforeEach(() => {
    // 各テストの前にコンテキストをリセット
    CSSValueAdapter.resetContext();
  });

  afterEach(() => {
    // テスト後もコンテキストをリセット
    CSSValueAdapter.resetContext();
  });

  describe('parseSize', () => {
    test('ピクセル値をパースできる', () => {
      expect(CSSValueAdapter.parseSize('100px')).toBe(100);
      expect(CSSValueAdapter.parseSize('42.5px')).toBe(42.5);
    });

    test('パーセンテージ値をパースできる', () => {
      const result = CSSValueAdapter.parseSize('50%');
      expect(result).toEqual({ value: 50, unit: '%' });
    });

    test('rem単位をピクセルに変換する', () => {
      expect(CSSValueAdapter.parseSize('2rem')).toBe(32); // 2 * 16
      expect(CSSValueAdapter.parseSize('1.5rem')).toBe(24); // 1.5 * 16
    });

    test('em単位をピクセルに変換する', () => {
      expect(CSSValueAdapter.parseSize('2em')).toBe(32); // 2 * 16
      expect(CSSValueAdapter.parseSize('0.5em')).toBe(8); // 0.5 * 16
    });

    test('vw単位をピクセルに変換する', () => {
      expect(CSSValueAdapter.parseSize('50vw')).toBe(960); // 50% of 1920
      expect(CSSValueAdapter.parseSize('100vw')).toBe(1920);
    });

    test('vh単位をピクセルに変換する', () => {
      expect(CSSValueAdapter.parseSize('50vh')).toBe(540); // 50% of 1080
      expect(CSSValueAdapter.parseSize('100vh')).toBe(1080);
    });

    test('calc()式を評価する', () => {
      expect(CSSValueAdapter.parseSize('calc(2rem + 10px)')).toBe(42); // 32 + 10
      expect(CSSValueAdapter.parseSize('calc(100vh - 100px)')).toBe(980); // 1080 - 100
    });

    test('calc(100% - Xpx)をパーセンテージとして扱う', () => {
      const result = CSSValueAdapter.parseSize('calc(100% - 40px)');
      expect(result).toEqual({ value: 100, unit: '%' });
    });

    test('単位なしの数値をピクセルとして扱う', () => {
      expect(CSSValueAdapter.parseSize('200')).toBe(200);
      expect(CSSValueAdapter.parseSize('42')).toBe(42);
    });

    test('特殊な値はnullを返す', () => {
      expect(CSSValueAdapter.parseSize('auto')).toBeNull();
      expect(CSSValueAdapter.parseSize('inherit')).toBeNull();
      expect(CSSValueAdapter.parseSize('initial')).toBeNull();
    });

    test('無効な値はnullを返す', () => {
      expect(CSSValueAdapter.parseSize('invalid')).toBeNull();
      expect(CSSValueAdapter.parseSize('')).toBeNull();
      expect(CSSValueAdapter.parseSize(undefined)).toBeNull();
    });
  });

  describe('parseSpacing', () => {
    test('ピクセル値をパースできる', () => {
      expect(CSSValueAdapter.parseSpacing('20px')).toBe(20);
      expect(CSSValueAdapter.parseSpacing('0px')).toBe(0);
    });

    test('rem単位をピクセルに変換する', () => {
      expect(CSSValueAdapter.parseSpacing('1rem')).toBe(16);
      expect(CSSValueAdapter.parseSpacing('2.5rem')).toBe(40);
    });

    test('calc()式を評価する', () => {
      expect(CSSValueAdapter.parseSpacing('calc(1rem + 5px)')).toBe(21);
    });

    test('デフォルト値を返す', () => {
      expect(CSSValueAdapter.parseSpacing(undefined)).toBe(0);
      expect(CSSValueAdapter.parseSpacing(undefined, 10)).toBe(10);
      expect(CSSValueAdapter.parseSpacing('invalid', 5)).toBe(5);
    });
  });

  describe('parsePadding', () => {
    test('1つの値（全方向同じ）', () => {
      const result = CSSValueAdapter.parsePadding('10px');
      expect(result).toEqual({
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
      });
    });

    test('2つの値（上下、左右）', () => {
      const result = CSSValueAdapter.parsePadding('10px 20px');
      expect(result).toEqual({
        top: 10,
        right: 20,
        bottom: 10,
        left: 20
      });
    });

    test('3つの値（上、左右、下）', () => {
      const result = CSSValueAdapter.parsePadding('10px 20px 30px');
      expect(result).toEqual({
        top: 10,
        right: 20,
        bottom: 30,
        left: 20
      });
    });

    test('4つの値（上、右、下、左）', () => {
      const result = CSSValueAdapter.parsePadding('10px 20px 30px 40px');
      expect(result).toEqual({
        top: 10,
        right: 20,
        bottom: 30,
        left: 40
      });
    });

    test('calc()を含むパディングをパースする', () => {
      const result = CSSValueAdapter.parsePadding('calc(1rem + 5px)');
      expect(result).toEqual({
        top: 21,
        right: 21,
        bottom: 21,
        left: 21
      });
    });

    test('様々な単位の混在をパースする', () => {
      const result = CSSValueAdapter.parsePadding('10px 1rem 20px 2rem');
      expect(result).toEqual({
        top: 10,
        right: 16,
        bottom: 20,
        left: 32
      });
    });

    test('無効な値はnullを返す', () => {
      expect(CSSValueAdapter.parsePadding('')).toBeNull();
      expect(CSSValueAdapter.parsePadding(undefined)).toBeNull();
      expect(CSSValueAdapter.parsePadding('auto')).toBeNull();
    });
  });

  describe('parseColor', () => {
    test('名前付き色をパースできる', () => {
      expect(CSSValueAdapter.parseColor('red')).toEqual({ r: 255, g: 0, b: 0 });
      expect(CSSValueAdapter.parseColor('green')).toEqual({ r: 0, g: 128, b: 0 });
      expect(CSSValueAdapter.parseColor('blue')).toEqual({ r: 0, g: 0, b: 255 });
    });

    test('HEX値をパースできる', () => {
      expect(CSSValueAdapter.parseColor('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(CSSValueAdapter.parseColor('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(CSSValueAdapter.parseColor('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
    });

    test('rgb()関数をパースできる', () => {
      expect(CSSValueAdapter.parseColor('rgb(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0 });
      expect(CSSValueAdapter.parseColor('rgb(128, 128, 128)')).toEqual({ r: 128, g: 128, b: 128 });
    });

    test('無効な値はnullを返す', () => {
      expect(CSSValueAdapter.parseColor('')).toBeNull();
      expect(CSSValueAdapter.parseColor(undefined)).toBeNull();
      expect(CSSValueAdapter.parseColor('invalid')).toBeNull();
    });
  });

  describe('isCalc', () => {
    test('calc()式を判定できる', () => {
      expect(CSSValueAdapter.isCalc('calc(100% - 20px)')).toBe(true);
      expect(CSSValueAdapter.isCalc('calc(1rem + 5px)')).toBe(true);
      expect(CSSValueAdapter.isCalc('100px')).toBe(false);
      expect(CSSValueAdapter.isCalc('50%')).toBe(false);
    });
  });

  describe('parseCalc', () => {
    test('calc()式を評価する', () => {
      expect(CSSValueAdapter.parseCalc('calc(2rem + 10px)')).toBe(42);
      expect(CSSValueAdapter.parseCalc('calc(100px - 20px)')).toBe(80);
    });

    test('無効なcalc()式はnullを返す', () => {
      expect(CSSValueAdapter.parseCalc('100px')).toBeNull();
      expect(CSSValueAdapter.parseCalc('calc(invalid)')).toBeNull();
    });
  });

  describe('setContext/resetContext', () => {
    test('コンテキストを設定できる', () => {
      CSSValueAdapter.setContext({
        viewportWidth: 1000,
        viewportHeight: 800,
        fontSize: 20
      });

      // 新しいコンテキストで計算
      expect(CSSValueAdapter.parseSize('50vw')).toBe(500); // 50% of 1000
      expect(CSSValueAdapter.parseSize('50vh')).toBe(400); // 50% of 800
      expect(CSSValueAdapter.parseSize('2rem')).toBe(40); // 2 * 20
    });

    test('部分的にコンテキストを更新できる', () => {
      CSSValueAdapter.setContext({ fontSize: 24 });
      
      // fontSizeのみ更新、他はデフォルト値
      expect(CSSValueAdapter.parseSize('1rem')).toBe(24);
      expect(CSSValueAdapter.parseSize('100vw')).toBe(1920); // デフォルト
    });

    test('リセットでデフォルト値に戻る', () => {
      CSSValueAdapter.setContext({
        viewportWidth: 1000,
        viewportHeight: 800,
        fontSize: 20
      });

      CSSValueAdapter.resetContext();

      // デフォルト値で計算
      expect(CSSValueAdapter.parseSize('100vw')).toBe(1920);
      expect(CSSValueAdapter.parseSize('100vh')).toBe(1080);
      expect(CSSValueAdapter.parseSize('1rem')).toBe(16);
    });
  });
});