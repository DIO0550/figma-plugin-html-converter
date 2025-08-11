import { describe, test, expect } from 'vitest';
import { CSSSize } from './size';

describe('CSSSize', () => {
  describe('from', () => {
    test('ピクセル値のCSSSize型を作成できる', () => {
      const size = CSSSize.from({ type: 'pixels', value: 100 });
      expect(size).toBeDefined();
      expect(CSSSize.getType(size)).toBe('pixels');
      expect(CSSSize.getValue(size)).toBe(100);
    });

    test('パーセンテージのCSSSize型を作成できる', () => {
      const size = CSSSize.from({ type: 'percentage', value: 50 });
      expect(size).toBeDefined();
      expect(CSSSize.getType(size)).toBe('percentage');
      expect(CSSSize.getValue(size)).toBe(50);
    });

    test('autoのCSSSize型を作成できる', () => {
      const size = CSSSize.from({ type: 'auto', value: 0 });
      expect(size).toBeDefined();
      expect(CSSSize.getType(size)).toBe('auto');
      expect(CSSSize.isAuto(size)).toBe(true);
    });
  });

  describe('fromPixels', () => {
    test('ピクセル値からCSSSize型を作成できる', () => {
      const size = CSSSize.fromPixels(200);
      expect(CSSSize.getType(size)).toBe('pixels');
      expect(CSSSize.getValue(size)).toBe(200);
    });

    test('負の値も受け入れる', () => {
      const size = CSSSize.fromPixels(-10);
      expect(CSSSize.getValue(size)).toBe(-10);
    });
  });

  describe('fromPercentage', () => {
    test('パーセンテージ値からCSSSize型を作成できる', () => {
      const size = CSSSize.fromPercentage(75);
      expect(CSSSize.getType(size)).toBe('percentage');
      expect(CSSSize.getValue(size)).toBe(75);
    });

    test('100%を超える値も受け入れる', () => {
      const size = CSSSize.fromPercentage(150);
      expect(CSSSize.getValue(size)).toBe(150);
    });
  });

  describe('auto', () => {
    test('auto値を作成できる', () => {
      const size = CSSSize.auto();
      expect(CSSSize.getType(size)).toBe('auto');
      expect(CSSSize.isAuto(size)).toBe(true);
      expect(CSSSize.getValue(size)).toBe(0);
    });
  });

  describe('parse', () => {
    test('ピクセル値をパースできる', () => {
      const size = CSSSize.parse('100px');
      expect(size).toBeDefined();
      if (size) {
        expect(CSSSize.getType(size)).toBe('pixels');
        expect(CSSSize.getValue(size)).toBe(100);
      }
    });

    test('パーセンテージ値をパースできる', () => {
      const size = CSSSize.parse('50%');
      expect(size).toBeDefined();
      if (size) {
        expect(CSSSize.getType(size)).toBe('percentage');
        expect(CSSSize.getValue(size)).toBe(50);
      }
    });

    test('rem単位をピクセルに変換してパースする', () => {
      const size = CSSSize.parse('2rem');
      expect(size).toBeDefined();
      if (size) {
        expect(CSSSize.getType(size)).toBe('pixels');
        expect(CSSSize.getValue(size)).toBe(32); // 2 * 16
      }
    });

    test('em単位をピクセルに変換してパースする', () => {
      const size = CSSSize.parse('1.5em', { fontSize: 20 });
      expect(size).toBeDefined();
      if (size) {
        expect(CSSSize.getType(size)).toBe('pixels');
        expect(CSSSize.getValue(size)).toBe(30); // 1.5 * 20
      }
    });

    test('vw単位をピクセルに変換してパースする', () => {
      const size = CSSSize.parse('50vw', { viewportWidth: 1000 });
      expect(size).toBeDefined();
      if (size) {
        expect(CSSSize.getType(size)).toBe('pixels');
        expect(CSSSize.getValue(size)).toBe(500); // 50% of 1000
      }
    });

    test('vh単位をピクセルに変換してパースする', () => {
      const size = CSSSize.parse('25vh', { viewportHeight: 800 });
      expect(size).toBeDefined();
      if (size) {
        expect(CSSSize.getType(size)).toBe('pixels');
        expect(CSSSize.getValue(size)).toBe(200); // 25% of 800
      }
    });

    test('calc()式をパースできる', () => {
      const size = CSSSize.parse('calc(100% - 20px)');
      expect(size).toBeDefined();
      if (size) {
        // calc(100% - Xpx)はパーセンテージとして扱われる
        expect(CSSSize.getType(size)).toBe('percentage');
        expect(CSSSize.getValue(size)).toBe(100);
      }
    });

    test('calc()式（ピクセル計算）をパースできる', () => {
      const size = CSSSize.parse('calc(2rem + 10px)');
      expect(size).toBeDefined();
      if (size) {
        expect(CSSSize.getType(size)).toBe('pixels');
        expect(CSSSize.getValue(size)).toBe(42); // 32 + 10
      }
    });

    test('autoをパースできる', () => {
      const size = CSSSize.parse('auto');
      expect(size).toBeDefined();
      if (size) {
        expect(CSSSize.isAuto(size)).toBe(true);
      }
    });

    test('単位なしの数値をピクセルとしてパースする', () => {
      const size = CSSSize.parse('200');
      expect(size).toBeDefined();
      if (size) {
        expect(CSSSize.getType(size)).toBe('pixels');
        expect(CSSSize.getValue(size)).toBe(200);
      }
    });

    test('無効な値はnullを返す', () => {
      expect(CSSSize.parse('inherit')).toBeNull();
      expect(CSSSize.parse('initial')).toBeNull();
      expect(CSSSize.parse('invalid')).toBeNull();
    });
  });

  describe('toPixels', () => {
    test('ピクセル値をそのまま返す', () => {
      const size = CSSSize.fromPixels(100);
      expect(CSSSize.toPixels(size)).toBe(100);
    });

    test('パーセンテージ値を基準値に対して計算する', () => {
      const size = CSSSize.fromPercentage(50);
      expect(CSSSize.toPixels(size, 200)).toBe(100);
      expect(CSSSize.toPixels(size, 1000)).toBe(500);
    });

    test('auto値はnullを返す', () => {
      const size = CSSSize.auto();
      expect(CSSSize.toPixels(size)).toBeNull();
    });

    test('基準値なしのパーセンテージはnullを返す', () => {
      const size = CSSSize.fromPercentage(50);
      expect(CSSSize.toPixels(size)).toBeNull();
    });
  });

  describe('isAuto', () => {
    test('auto値を判定できる', () => {
      expect(CSSSize.isAuto(CSSSize.auto())).toBe(true);
      expect(CSSSize.isAuto(CSSSize.fromPixels(100))).toBe(false);
      expect(CSSSize.isAuto(CSSSize.fromPercentage(50))).toBe(false);
    });
  });

  describe('isPixels', () => {
    test('ピクセル値を判定できる', () => {
      expect(CSSSize.isPixels(CSSSize.fromPixels(100))).toBe(true);
      expect(CSSSize.isPixels(CSSSize.fromPercentage(50))).toBe(false);
      expect(CSSSize.isPixels(CSSSize.auto())).toBe(false);
    });
  });

  describe('isPercentage', () => {
    test('パーセンテージ値を判定できる', () => {
      expect(CSSSize.isPercentage(CSSSize.fromPercentage(50))).toBe(true);
      expect(CSSSize.isPercentage(CSSSize.fromPixels(100))).toBe(false);
      expect(CSSSize.isPercentage(CSSSize.auto())).toBe(false);
    });
  });

  describe('equals', () => {
    test('同じ型と値の場合trueを返す', () => {
      const size1 = CSSSize.fromPixels(100);
      const size2 = CSSSize.fromPixels(100);
      expect(CSSSize.equals(size1, size2)).toBe(true);
    });

    test('異なる値の場合falseを返す', () => {
      const size1 = CSSSize.fromPixels(100);
      const size2 = CSSSize.fromPixels(200);
      expect(CSSSize.equals(size1, size2)).toBe(false);
    });

    test('異なる型の場合falseを返す', () => {
      const size1 = CSSSize.fromPixels(100);
      const size2 = CSSSize.fromPercentage(100);
      expect(CSSSize.equals(size1, size2)).toBe(false);
    });

    test('両方autoの場合trueを返す', () => {
      const size1 = CSSSize.auto();
      const size2 = CSSSize.auto();
      expect(CSSSize.equals(size1, size2)).toBe(true);
    });
  });

  describe('toString', () => {
    test('ピクセル値の文字列表現を返す', () => {
      expect(CSSSize.toString(CSSSize.fromPixels(100))).toBe('100px');
      expect(CSSSize.toString(CSSSize.fromPixels(42.5))).toBe('42.5px');
    });

    test('パーセンテージ値の文字列表現を返す', () => {
      expect(CSSSize.toString(CSSSize.fromPercentage(50))).toBe('50%');
      expect(CSSSize.toString(CSSSize.fromPercentage(33.33))).toBe('33.33%');
    });

    test('auto値の文字列表現を返す', () => {
      expect(CSSSize.toString(CSSSize.auto())).toBe('auto');
    });
  });
});