import { describe, test, expect } from 'vitest';
import { Calc } from './calc';

describe('Calc（calc()式のブランド型）', () => {
  describe('from', () => {
    test('有効なcalc()式からCalcExpression型を作成できる', () => {
      const calc = Calc.from('calc(100px + 20px)');
      expect(calc).not.toBeNull();
      expect(Calc.toString(calc!)).toBe('calc(100px + 20px)');
    });

    test('無効な文字列でnullを返す', () => {
      expect(Calc.from('100px')).toBeNull();
      expect(Calc.from('not-calc')).toBeNull();
      expect(Calc.from('calc(')).toBeNull();
    });
  });

  describe('isValid', () => {
    test('calc()式を正しく判定できる', () => {
      expect(Calc.isValid('calc(100px + 20px)')).toBe(true);
      expect(Calc.isValid('calc(50vh - 10px)')).toBe(true);
      expect(Calc.isValid('  calc(1rem + 5px)  ')).toBe(true);
    });

    test('calc()式でないものを正しく判定できる', () => {
      expect(Calc.isValid('100px')).toBe(false);
      expect(Calc.isValid('calc(')).toBe(false);
      expect(Calc.isValid('not-calc')).toBe(false);
    });
  });

  describe('parse', () => {
    test('加算式をパースできる', () => {
      const calc = Calc.from('calc(100px + 20px)');
      const operation = Calc.parse(calc!);
      
      expect(operation).not.toBeNull();
      expect(operation!.operator).toBe('+');
      expect(operation!.left).toEqual({ value: 100, unit: 'px' });
      expect(operation!.right).toEqual({ value: 20, unit: 'px' });
    });

    test('減算式をパースできる', () => {
      const calc = Calc.from('calc(50vh - 10px)');
      const operation = Calc.parse(calc!);
      
      expect(operation).not.toBeNull();
      expect(operation!.operator).toBe('-');
      expect(operation!.left).toEqual({ value: 50, unit: 'vh' });
      expect(operation!.right).toEqual({ value: 10, unit: 'px' });
    });

    test('単位なしの値をpxとして扱う', () => {
      const calc = Calc.from('calc(100 + 20)');
      const operation = Calc.parse(calc!);
      
      expect(operation).not.toBeNull();
      expect(operation!.left.unit).toBe('px');
      expect(operation!.right.unit).toBe('px');
    });
  });

  describe('evaluate', () => {
    test('加算を計算できる', () => {
      const calc = Calc.from('calc(100px + 20px)');
      const result = Calc.evaluate(calc!);
      expect(result).toBe(120);
    });

    test('減算を計算できる', () => {
      const calc = Calc.from('calc(100px - 30px)');
      const result = Calc.evaluate(calc!);
      expect(result).toBe(70);
    });

    test('異なる単位の計算ができる', () => {
      const calc = Calc.from('calc(1rem + 4px)');
      const result = Calc.evaluate(calc!);
      expect(result).toBe(20); // 16 + 4
    });

    test('viewport単位を計算できる', () => {
      const calc = Calc.from('calc(50vh + 100px)');
      const result = Calc.evaluate(calc!);
      expect(result).toBe(640); // (1080 * 0.5) + 100
    });

    test('カスタムコンテキストで計算できる', () => {
      const calc = Calc.from('calc(100vw - 20px)');
      const result = Calc.evaluate(calc!, { viewportWidth: 1280 });
      expect(result).toBe(1260); // 1280 - 20
    });
  });

  describe('termToPixels', () => {
    const context = {
      viewportWidth: 1920,
      viewportHeight: 1080,
      fontSize: 16
    };

    test('px単位をそのまま返す', () => {
      expect(Calc.termToPixels({ value: 100, unit: 'px' }, context)).toBe(100);
    });

    test('rem/em単位を変換できる', () => {
      expect(Calc.termToPixels({ value: 2, unit: 'rem' }, context)).toBe(32);
      expect(Calc.termToPixels({ value: 1.5, unit: 'em' }, context)).toBe(24);
    });

    test('viewport単位を変換できる', () => {
      expect(Calc.termToPixels({ value: 50, unit: 'vw' }, context)).toBe(960);
      expect(Calc.termToPixels({ value: 100, unit: 'vh' }, context)).toBe(1080);
    });

    test('パーセンテージは0を返す（文脈依存）', () => {
      expect(Calc.termToPixels({ value: 50, unit: '%' }, context)).toBe(0);
    });
  });

  describe('isPercentageMinusPixels', () => {
    test('100% - Xpxパターンを検出できる', () => {
      const calc1 = Calc.from('calc(100% - 40px)');
      expect(Calc.isPercentageMinusPixels(calc1!)).toBe(true);
      
      const calc2 = Calc.from('calc(50% - 20px)');
      expect(Calc.isPercentageMinusPixels(calc2!)).toBe(true);
    });

    test('他のパターンではfalseを返す', () => {
      const calc1 = Calc.from('calc(100px - 40px)');
      expect(Calc.isPercentageMinusPixels(calc1!)).toBe(false);
      
      const calc2 = Calc.from('calc(100% + 40px)');
      expect(Calc.isPercentageMinusPixels(calc2!)).toBe(false);
    });
  });
});