import { describe, test, expect } from 'vitest';
import { CSSLength } from './length';

describe('CSSLength', () => {
  describe('from', () => {
    test('数値と単位からCSSLength型を作成できる', () => {
      const length = CSSLength.from(10, 'px');
      expect(length).toBeDefined();
      expect(CSSLength.getValue(length)).toBe(10);
      expect(CSSLength.getUnit(length)).toBe('px');
    });

    test('様々な単位をサポートする', () => {
      const px = CSSLength.from(20, 'px');
      const rem = CSSLength.from(1.5, 'rem');
      const em = CSSLength.from(2, 'em');
      const vh = CSSLength.from(50, 'vh');
      const vw = CSSLength.from(100, 'vw');

      expect(CSSLength.getUnit(px)).toBe('px');
      expect(CSSLength.getUnit(rem)).toBe('rem');
      expect(CSSLength.getUnit(em)).toBe('em');
      expect(CSSLength.getUnit(vh)).toBe('vh');
      expect(CSSLength.getUnit(vw)).toBe('vw');
    });
  });

  describe('fromPixels', () => {
    test('ピクセル値からCSSLength型を作成できる', () => {
      const length = CSSLength.fromPixels(100);
      expect(CSSLength.getValue(length)).toBe(100);
      expect(CSSLength.getUnit(length)).toBe('px');
    });
  });

  describe('parse', () => {
    test('文字列からCSSLength型をパースできる', () => {
      const length = CSSLength.parse('16px');
      expect(length).toBeDefined();
      if (length) {
        expect(CSSLength.getValue(length)).toBe(16);
        expect(CSSLength.getUnit(length)).toBe('px');
      }
    });

    test('様々な単位をパースできる', () => {
      const tests = [
        { input: '10px', value: 10, unit: 'px' },
        { input: '1.5rem', value: 1.5, unit: 'rem' },
        { input: '2em', value: 2, unit: 'em' },
        { input: '50vh', value: 50, unit: 'vh' },
        { input: '100vw', value: 100, unit: 'vw' },
      ];

      tests.forEach(({ input, value, unit }) => {
        const length = CSSLength.parse(input);
        expect(length).toBeDefined();
        if (length) {
          expect(CSSLength.getValue(length)).toBe(value);
          expect(CSSLength.getUnit(length)).toBe(unit);
        }
      });
    });

    test('無効な値はnullを返す', () => {
      expect(CSSLength.parse('auto')).toBeNull();
      expect(CSSLength.parse('inherit')).toBeNull();
      expect(CSSLength.parse('100%')).toBeNull(); // パーセンテージはCSSPercentageで扱う
      expect(CSSLength.parse('invalid')).toBeNull();
    });

    test('単位なしの数値をpxとして扱う', () => {
      const length = CSSLength.parse('42');
      expect(length).toBeDefined();
      if (length) {
        expect(CSSLength.getValue(length)).toBe(42);
        expect(CSSLength.getUnit(length)).toBe('px');
      }
    });
  });

  describe('toPixels', () => {
    test('px値をそのまま返す', () => {
      const length = CSSLength.from(100, 'px');
      expect(CSSLength.toPixels(length)).toBe(100);
    });

    test('rem値を変換する', () => {
      const length = CSSLength.from(2, 'rem');
      expect(CSSLength.toPixels(length)).toBe(32); // 2 * 16
      expect(CSSLength.toPixels(length, { fontSize: 20 })).toBe(40); // 2 * 20
    });

    test('em値を変換する', () => {
      const length = CSSLength.from(1.5, 'em');
      expect(CSSLength.toPixels(length)).toBe(24); // 1.5 * 16
      expect(CSSLength.toPixels(length, { fontSize: 14 })).toBe(21); // 1.5 * 14
    });

    test('vw値を変換する', () => {
      const length = CSSLength.from(50, 'vw');
      expect(CSSLength.toPixels(length)).toBe(960); // 50% of 1920
      expect(CSSLength.toPixels(length, { viewportWidth: 1440 })).toBe(720); // 50% of 1440
    });

    test('vh値を変換する', () => {
      const length = CSSLength.from(25, 'vh');
      expect(CSSLength.toPixels(length)).toBe(270); // 25% of 1080
      expect(CSSLength.toPixels(length, { viewportHeight: 800 })).toBe(200); // 25% of 800
    });
  });

  describe('isZero', () => {
    test('ゼロ値を判定できる', () => {
      expect(CSSLength.isZero(CSSLength.from(0, 'px'))).toBe(true);
      expect(CSSLength.isZero(CSSLength.from(0, 'rem'))).toBe(true);
      expect(CSSLength.isZero(CSSLength.from(1, 'px'))).toBe(false);
      expect(CSSLength.isZero(CSSLength.from(0.1, 'rem'))).toBe(false);
    });
  });

  describe('equals', () => {
    test('同じ値と単位の場合trueを返す', () => {
      const length1 = CSSLength.from(10, 'px');
      const length2 = CSSLength.from(10, 'px');
      expect(CSSLength.equals(length1, length2)).toBe(true);
    });

    test('異なる値の場合falseを返す', () => {
      const length1 = CSSLength.from(10, 'px');
      const length2 = CSSLength.from(20, 'px');
      expect(CSSLength.equals(length1, length2)).toBe(false);
    });

    test('異なる単位の場合falseを返す', () => {
      const length1 = CSSLength.from(10, 'px');
      const length2 = CSSLength.from(10, 'rem');
      expect(CSSLength.equals(length1, length2)).toBe(false);
    });
  });

  describe('toString', () => {
    test('文字列表現を返す', () => {
      expect(CSSLength.toString(CSSLength.from(10, 'px'))).toBe('10px');
      expect(CSSLength.toString(CSSLength.from(1.5, 'rem'))).toBe('1.5rem');
      expect(CSSLength.toString(CSSLength.from(100, 'vw'))).toBe('100vw');
    });
  });
});