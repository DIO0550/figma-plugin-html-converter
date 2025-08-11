import { describe, test, expect } from 'vitest';
import { CSSPercentage } from './percentage';

describe('CSSPercentage', () => {
  describe('from', () => {
    test('数値からCSSPercentage型を作成できる', () => {
      const percentage = CSSPercentage.from(50);
      expect(percentage).toBeDefined();
      expect(CSSPercentage.getValue(percentage)).toBe(50);
    });

    test('0から100の範囲の値を受け入れる', () => {
      expect(CSSPercentage.getValue(CSSPercentage.from(0))).toBe(0);
      expect(CSSPercentage.getValue(CSSPercentage.from(50))).toBe(50);
      expect(CSSPercentage.getValue(CSSPercentage.from(100))).toBe(100);
    });

    test('100を超える値も受け入れる', () => {
      const percentage = CSSPercentage.from(150);
      expect(CSSPercentage.getValue(percentage)).toBe(150);
    });

    test('負の値は0にクランプされる', () => {
      const percentage = CSSPercentage.from(-10);
      expect(CSSPercentage.getValue(percentage)).toBe(0);
    });
  });

  describe('parse', () => {
    test('パーセント記号付き文字列をパースできる', () => {
      const percentage = CSSPercentage.parse('75%');
      expect(percentage).toBeDefined();
      if (percentage) {
        expect(CSSPercentage.getValue(percentage)).toBe(75);
      }
    });

    test('小数点を含むパーセンテージをパースできる', () => {
      const percentage = CSSPercentage.parse('33.33%');
      expect(percentage).toBeDefined();
      if (percentage) {
        expect(CSSPercentage.getValue(percentage)).toBeCloseTo(33.33);
      }
    });

    test('0%をパースできる', () => {
      const percentage = CSSPercentage.parse('0%');
      expect(percentage).toBeDefined();
      if (percentage) {
        expect(CSSPercentage.getValue(percentage)).toBe(0);
      }
    });

    test('無効な値はnullを返す', () => {
      expect(CSSPercentage.parse('auto')).toBeNull();
      expect(CSSPercentage.parse('100px')).toBeNull();
      expect(CSSPercentage.parse('100')).toBeNull(); // %記号なし
      expect(CSSPercentage.parse('invalid')).toBeNull();
    });
  });

  describe('toDecimal', () => {
    test('パーセンテージを小数に変換する', () => {
      expect(CSSPercentage.toDecimal(CSSPercentage.from(0))).toBe(0);
      expect(CSSPercentage.toDecimal(CSSPercentage.from(50))).toBe(0.5);
      expect(CSSPercentage.toDecimal(CSSPercentage.from(100))).toBe(1);
      expect(CSSPercentage.toDecimal(CSSPercentage.from(75))).toBe(0.75);
      expect(CSSPercentage.toDecimal(CSSPercentage.from(33.33))).toBeCloseTo(0.3333);
    });
  });

  describe('toPixels', () => {
    test('基準値に対してピクセル値を計算する', () => {
      const percentage = CSSPercentage.from(50);
      expect(CSSPercentage.toPixels(percentage, 200)).toBe(100);
      expect(CSSPercentage.toPixels(percentage, 1000)).toBe(500);
    });

    test('様々なパーセンテージで正しく計算する', () => {
      expect(CSSPercentage.toPixels(CSSPercentage.from(0), 100)).toBe(0);
      expect(CSSPercentage.toPixels(CSSPercentage.from(25), 100)).toBe(25);
      expect(CSSPercentage.toPixels(CSSPercentage.from(100), 100)).toBe(100);
      expect(CSSPercentage.toPixels(CSSPercentage.from(150), 100)).toBe(150);
    });

    test('小数点を含むパーセンテージで計算する', () => {
      const percentage = CSSPercentage.from(33.33);
      expect(CSSPercentage.toPixels(percentage, 300)).toBeCloseTo(99.99);
    });
  });

  describe('isZero', () => {
    test('ゼロ値を判定できる', () => {
      expect(CSSPercentage.isZero(CSSPercentage.from(0))).toBe(true);
      expect(CSSPercentage.isZero(CSSPercentage.from(1))).toBe(false);
      expect(CSSPercentage.isZero(CSSPercentage.from(0.1))).toBe(false);
    });
  });

  describe('isFull', () => {
    test('100%を判定できる', () => {
      expect(CSSPercentage.isFull(CSSPercentage.from(100))).toBe(true);
      expect(CSSPercentage.isFull(CSSPercentage.from(99.9))).toBe(false);
      expect(CSSPercentage.isFull(CSSPercentage.from(100.1))).toBe(false);
      expect(CSSPercentage.isFull(CSSPercentage.from(50))).toBe(false);
    });
  });

  describe('equals', () => {
    test('同じ値の場合trueを返す', () => {
      const p1 = CSSPercentage.from(50);
      const p2 = CSSPercentage.from(50);
      expect(CSSPercentage.equals(p1, p2)).toBe(true);
    });

    test('異なる値の場合falseを返す', () => {
      const p1 = CSSPercentage.from(50);
      const p2 = CSSPercentage.from(75);
      expect(CSSPercentage.equals(p1, p2)).toBe(false);
    });
  });

  describe('toString', () => {
    test('文字列表現を返す', () => {
      expect(CSSPercentage.toString(CSSPercentage.from(0))).toBe('0%');
      expect(CSSPercentage.toString(CSSPercentage.from(50))).toBe('50%');
      expect(CSSPercentage.toString(CSSPercentage.from(100))).toBe('100%');
      expect(CSSPercentage.toString(CSSPercentage.from(33.33))).toBe('33.33%');
    });
  });
});