import { describe, test, expect } from 'vitest';
import { CSSSpacing } from './spacing';

describe('CSSSpacing', () => {
  describe('from', () => {
    test('ピクセル値からCSSSpacing型を作成できる', () => {
      const spacing = CSSSpacing.from(10);
      expect(spacing).toBeDefined();
      expect(CSSSpacing.getValue(spacing)).toBe(10);
    });

    test('負の値は0にクランプされる', () => {
      const spacing = CSSSpacing.from(-10);
      expect(CSSSpacing.getValue(spacing)).toBe(0);
    });

    test('ゼロ値を作成できる', () => {
      const spacing = CSSSpacing.from(0);
      expect(CSSSpacing.getValue(spacing)).toBe(0);
    });
  });

  describe('parse', () => {
    test('px単位の値をパースできる', () => {
      const spacing = CSSSpacing.parse('20px');
      expect(spacing).toBeDefined();
      if (spacing) {
        expect(CSSSpacing.getValue(spacing)).toBe(20);
      }
    });

    test('rem単位の値をパースできる', () => {
      const spacing = CSSSpacing.parse('2rem');
      expect(spacing).toBeDefined();
      if (spacing) {
        expect(CSSSpacing.getValue(spacing)).toBe(32); // 2 * 16
      }
    });

    test('em単位の値をパースできる', () => {
      const spacing = CSSSpacing.parse('1.5em', { fontSize: 20 });
      expect(spacing).toBeDefined();
      if (spacing) {
        expect(CSSSpacing.getValue(spacing)).toBe(30); // 1.5 * 20
      }
    });

    test('vw単位の値をパースできる', () => {
      const spacing = CSSSpacing.parse('5vw', { viewportWidth: 1000 });
      expect(spacing).toBeDefined();
      if (spacing) {
        expect(CSSSpacing.getValue(spacing)).toBe(50); // 5% of 1000
      }
    });

    test('vh単位の値をパースできる', () => {
      const spacing = CSSSpacing.parse('10vh', { viewportHeight: 800 });
      expect(spacing).toBeDefined();
      if (spacing) {
        expect(CSSSpacing.getValue(spacing)).toBe(80); // 10% of 800
      }
    });

    test('calc()式をパースできる', () => {
      const spacing = CSSSpacing.parse('calc(1rem + 10px)');
      expect(spacing).toBeDefined();
      if (spacing) {
        expect(CSSSpacing.getValue(spacing)).toBe(26); // 16 + 10
      }
    });

    test('単位なしの数値をパースできる', () => {
      const spacing = CSSSpacing.parse('42');
      expect(spacing).toBeDefined();
      if (spacing) {
        expect(CSSSpacing.getValue(spacing)).toBe(42);
      }
    });

    test('無効な値はnullを返す', () => {
      expect(CSSSpacing.parse('auto')).toBeNull();
      expect(CSSSpacing.parse('inherit')).toBeNull();
      expect(CSSSpacing.parse('invalid')).toBeNull();
    });
  });

  describe('splitValues', () => {
    test('スペース区切りの値を分割できる', () => {
      const result = CSSSpacing.splitValues('10px 20px 30px 40px');
      expect(result).toEqual(['10px', '20px', '30px', '40px']);
    });

    test('calc()内のスペースは分割しない', () => {
      const result = CSSSpacing.splitValues('calc(1rem + 5px) 20px');
      expect(result).toEqual(['calc(1rem + 5px)', '20px']);
    });

    test('複雑なcalc()式を含む値を正しく分割する', () => {
      const result = CSSSpacing.splitValues('10px calc(100% - 20px) calc(2rem + 10px) 5px');
      expect(result).toEqual(['10px', 'calc(100% - 20px)', 'calc(2rem + 10px)', '5px']);
    });

    test('単一の値を分割する', () => {
      const result = CSSSpacing.splitValues('20px');
      expect(result).toEqual(['20px']);
    });

    test('余分なスペースを処理する', () => {
      const result = CSSSpacing.splitValues('  10px   20px  ');
      expect(result).toEqual(['10px', '20px']);
    });
  });

  describe('parseShorthand', () => {
    test('1つの値（全方向同じ）', () => {
      const box = CSSSpacing.parseShorthand('10px');
      expect(box).toBeDefined();
      if (box) {
        expect(CSSSpacing.getValue(box.top)).toBe(10);
        expect(CSSSpacing.getValue(box.right)).toBe(10);
        expect(CSSSpacing.getValue(box.bottom)).toBe(10);
        expect(CSSSpacing.getValue(box.left)).toBe(10);
      }
    });

    test('2つの値（上下、左右）', () => {
      const box = CSSSpacing.parseShorthand('10px 20px');
      expect(box).toBeDefined();
      if (box) {
        expect(CSSSpacing.getValue(box.top)).toBe(10);
        expect(CSSSpacing.getValue(box.right)).toBe(20);
        expect(CSSSpacing.getValue(box.bottom)).toBe(10);
        expect(CSSSpacing.getValue(box.left)).toBe(20);
      }
    });

    test('3つの値（上、左右、下）', () => {
      const box = CSSSpacing.parseShorthand('10px 20px 30px');
      expect(box).toBeDefined();
      if (box) {
        expect(CSSSpacing.getValue(box.top)).toBe(10);
        expect(CSSSpacing.getValue(box.right)).toBe(20);
        expect(CSSSpacing.getValue(box.bottom)).toBe(30);
        expect(CSSSpacing.getValue(box.left)).toBe(20);
      }
    });

    test('4つの値（上、右、下、左）', () => {
      const box = CSSSpacing.parseShorthand('10px 20px 30px 40px');
      expect(box).toBeDefined();
      if (box) {
        expect(CSSSpacing.getValue(box.top)).toBe(10);
        expect(CSSSpacing.getValue(box.right)).toBe(20);
        expect(CSSSpacing.getValue(box.bottom)).toBe(30);
        expect(CSSSpacing.getValue(box.left)).toBe(40);
      }
    });

    test('calc()を含むショートハンドをパースできる', () => {
      const box = CSSSpacing.parseShorthand('calc(1rem + 5px)');
      expect(box).toBeDefined();
      if (box) {
        expect(CSSSpacing.getValue(box.top)).toBe(21); // 16 + 5
        expect(CSSSpacing.getValue(box.right)).toBe(21);
        expect(CSSSpacing.getValue(box.bottom)).toBe(21);
        expect(CSSSpacing.getValue(box.left)).toBe(21);
      }
    });

    test('様々な単位の混在をパースできる', () => {
      const box = CSSSpacing.parseShorthand('10px 1rem 2em 5vw', {
        fontSize: 20,
        viewportWidth: 1000
      });
      expect(box).toBeDefined();
      if (box) {
        expect(CSSSpacing.getValue(box.top)).toBe(10);
        expect(CSSSpacing.getValue(box.right)).toBe(16); // 1rem
        expect(CSSSpacing.getValue(box.bottom)).toBe(40); // 2em * 20
        expect(CSSSpacing.getValue(box.left)).toBe(50); // 5% of 1000
      }
    });

    test('無効な値が含まれる場合はnullを返す', () => {
      expect(CSSSpacing.parseShorthand('auto')).toBeNull();
      expect(CSSSpacing.parseShorthand('10px auto')).toBeNull();
    });
  });

  describe('zero', () => {
    test('ゼロ値を作成する', () => {
      const zero = CSSSpacing.zero();
      expect(CSSSpacing.getValue(zero)).toBe(0);
      expect(CSSSpacing.isZero(zero)).toBe(true);
    });
  });

  describe('zeroBox', () => {
    test('全方向ゼロのボックスを作成する', () => {
      const box = CSSSpacing.zeroBox();
      expect(CSSSpacing.getValue(box.top)).toBe(0);
      expect(CSSSpacing.getValue(box.right)).toBe(0);
      expect(CSSSpacing.getValue(box.bottom)).toBe(0);
      expect(CSSSpacing.getValue(box.left)).toBe(0);
    });
  });

  describe('isZero', () => {
    test('ゼロ値を判定できる', () => {
      expect(CSSSpacing.isZero(CSSSpacing.from(0))).toBe(true);
      expect(CSSSpacing.isZero(CSSSpacing.from(1))).toBe(false);
      expect(CSSSpacing.isZero(CSSSpacing.from(0.1))).toBe(false);
    });
  });

  describe('equals', () => {
    test('同じ値の場合trueを返す', () => {
      const s1 = CSSSpacing.from(10);
      const s2 = CSSSpacing.from(10);
      expect(CSSSpacing.equals(s1, s2)).toBe(true);
    });

    test('異なる値の場合falseを返す', () => {
      const s1 = CSSSpacing.from(10);
      const s2 = CSSSpacing.from(20);
      expect(CSSSpacing.equals(s1, s2)).toBe(false);
    });
  });

  describe('boxEquals', () => {
    test('同じボックス値の場合trueを返す', () => {
      const box1 = {
        top: CSSSpacing.from(10),
        right: CSSSpacing.from(20),
        bottom: CSSSpacing.from(30),
        left: CSSSpacing.from(40)
      };
      const box2 = {
        top: CSSSpacing.from(10),
        right: CSSSpacing.from(20),
        bottom: CSSSpacing.from(30),
        left: CSSSpacing.from(40)
      };
      expect(CSSSpacing.boxEquals(box1, box2)).toBe(true);
    });

    test('異なるボックス値の場合falseを返す', () => {
      const box1 = {
        top: CSSSpacing.from(10),
        right: CSSSpacing.from(20),
        bottom: CSSSpacing.from(30),
        left: CSSSpacing.from(40)
      };
      const box2 = {
        top: CSSSpacing.from(10),
        right: CSSSpacing.from(20),
        bottom: CSSSpacing.from(30),
        left: CSSSpacing.from(41)
      };
      expect(CSSSpacing.boxEquals(box1, box2)).toBe(false);
    });
  });

  describe('toString', () => {
    test('文字列表現を返す', () => {
      expect(CSSSpacing.toString(CSSSpacing.from(10))).toBe('10px');
      expect(CSSSpacing.toString(CSSSpacing.from(0))).toBe('0px');
      expect(CSSSpacing.toString(CSSSpacing.from(42.5))).toBe('42.5px');
    });
  });
});