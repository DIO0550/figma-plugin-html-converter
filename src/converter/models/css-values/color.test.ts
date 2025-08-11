import { describe, test, expect } from 'vitest';
import { CSSColor } from './color';

describe('CSSColor', () => {
  describe('fromRGB', () => {
    test('RGB値からCSSColor型を作成できる', () => {
      const color = CSSColor.fromRGB({ r: 255, g: 0, b: 0 });
      expect(color).toBeDefined();
      const rgb = CSSColor.toRGB(color);
      expect(rgb).toEqual({ r: 255, g: 0, b: 0 });
    });

    test('RGB値を0-255の範囲にクランプする', () => {
      const color = CSSColor.fromRGB({ r: 300, g: -50, b: 128 });
      const rgb = CSSColor.toRGB(color);
      expect(rgb).toEqual({ r: 255, g: 0, b: 128 });
    });
  });

  describe('fromHex', () => {
    test('6文字のHEX値からCSSColor型を作成できる', () => {
      const color = CSSColor.fromHex('#FF0000');
      expect(color).toBeDefined();
      if (color) {
        const rgb = CSSColor.toRGB(color);
        expect(rgb).toEqual({ r: 255, g: 0, b: 0 });
      }
    });

    test('3文字のHEX値からCSSColor型を作成できる', () => {
      const color = CSSColor.fromHex('#F00');
      expect(color).toBeDefined();
      if (color) {
        const rgb = CSSColor.toRGB(color);
        expect(rgb).toEqual({ r: 255, g: 0, b: 0 });
      }
    });

    test('小文字のHEX値も処理できる', () => {
      const color = CSSColor.fromHex('#ff0000');
      expect(color).toBeDefined();
      if (color) {
        const rgb = CSSColor.toRGB(color);
        expect(rgb).toEqual({ r: 255, g: 0, b: 0 });
      }
    });

    test('#記号なしのHEX値も処理できる', () => {
      const color = CSSColor.fromHex('00FF00');
      expect(color).toBeDefined();
      if (color) {
        const rgb = CSSColor.toRGB(color);
        expect(rgb).toEqual({ r: 0, g: 255, b: 0 });
      }
    });

    test('無効なHEX値はnullを返す', () => {
      expect(CSSColor.fromHex('#GGGGGG')).toBeNull();
      expect(CSSColor.fromHex('#12')).toBeNull();
      expect(CSSColor.fromHex('invalid')).toBeNull();
    });
  });

  describe('parse', () => {
    test('名前付き色をパースできる', () => {
      const tests = [
        { input: 'red', expected: { r: 255, g: 0, b: 0 } },
        { input: 'green', expected: { r: 0, g: 128, b: 0 } },
        { input: 'blue', expected: { r: 0, g: 0, b: 255 } },
        { input: 'white', expected: { r: 255, g: 255, b: 255 } },
        { input: 'black', expected: { r: 0, g: 0, b: 0 } },
      ];

      tests.forEach(({ input, expected }) => {
        const color = CSSColor.parse(input);
        expect(color).toBeDefined();
        if (color) {
          expect(CSSColor.toRGB(color)).toEqual(expected);
        }
      });
    });

    test('HEX値をパースできる', () => {
      const color = CSSColor.parse('#FF00FF');
      expect(color).toBeDefined();
      if (color) {
        expect(CSSColor.toRGB(color)).toEqual({ r: 255, g: 0, b: 255 });
      }
    });

    test('rgb()関数をパースできる', () => {
      const tests = [
        { input: 'rgb(255, 0, 0)', expected: { r: 255, g: 0, b: 0 } },
        { input: 'rgb(0, 255, 0)', expected: { r: 0, g: 255, b: 0 } },
        { input: 'rgb(128, 128, 128)', expected: { r: 128, g: 128, b: 128 } },
      ];

      tests.forEach(({ input, expected }) => {
        const color = CSSColor.parse(input);
        expect(color).toBeDefined();
        if (color) {
          expect(CSSColor.toRGB(color)).toEqual(expected);
        }
      });
    });

    test('rgba()関数をパースできる（アルファ値は無視）', () => {
      const color = CSSColor.parse('rgba(255, 0, 0, 0.5)');
      expect(color).toBeDefined();
      if (color) {
        expect(CSSColor.toRGB(color)).toEqual({ r: 255, g: 0, b: 0 });
      }
    });

    test('transparentを透明色として処理する', () => {
      const color = CSSColor.parse('transparent');
      expect(color).toBeDefined();
      if (color) {
        expect(CSSColor.toRGB(color)).toEqual({ r: 0, g: 0, b: 0 });
      }
    });

    test('無効な値はnullを返す', () => {
      expect(CSSColor.parse('invalid')).toBeNull();
      expect(CSSColor.parse('rgb(300, 0, 0)')).toBeNull(); // 範囲外
      expect(CSSColor.parse('notacolor')).toBeNull();
    });
  });

  describe('toHex', () => {
    test('HEX文字列に変換できる', () => {
      expect(CSSColor.toHex(CSSColor.fromRGB({ r: 255, g: 0, b: 0 }))).toBe('#ff0000');
      expect(CSSColor.toHex(CSSColor.fromRGB({ r: 0, g: 255, b: 0 }))).toBe('#00ff00');
      expect(CSSColor.toHex(CSSColor.fromRGB({ r: 0, g: 0, b: 255 }))).toBe('#0000ff');
      expect(CSSColor.toHex(CSSColor.fromRGB({ r: 128, g: 128, b: 128 }))).toBe('#808080');
    });
  });

  describe('toRGBString', () => {
    test('rgb()関数形式の文字列に変換できる', () => {
      expect(CSSColor.toRGBString(CSSColor.fromRGB({ r: 255, g: 0, b: 0 }))).toBe('rgb(255, 0, 0)');
      expect(CSSColor.toRGBString(CSSColor.fromRGB({ r: 0, g: 255, b: 0 }))).toBe('rgb(0, 255, 0)');
      expect(CSSColor.toRGBString(CSSColor.fromRGB({ r: 128, g: 64, b: 192 }))).toBe('rgb(128, 64, 192)');
    });
  });

  describe('toFigmaRGB', () => {
    test('Figmaの0-1形式に変換できる', () => {
      const color = CSSColor.fromRGB({ r: 255, g: 128, b: 0 });
      const figmaRGB = CSSColor.toFigmaRGB(color);
      expect(figmaRGB.r).toBeCloseTo(1);
      expect(figmaRGB.g).toBeCloseTo(0.5, 1);
      expect(figmaRGB.b).toBe(0);
    });

    test('黒を正しく変換する', () => {
      const color = CSSColor.fromRGB({ r: 0, g: 0, b: 0 });
      const figmaRGB = CSSColor.toFigmaRGB(color);
      expect(figmaRGB).toEqual({ r: 0, g: 0, b: 0 });
    });

    test('白を正しく変換する', () => {
      const color = CSSColor.fromRGB({ r: 255, g: 255, b: 255 });
      const figmaRGB = CSSColor.toFigmaRGB(color);
      expect(figmaRGB).toEqual({ r: 1, g: 1, b: 1 });
    });
  });

  describe('equals', () => {
    test('同じRGB値の場合trueを返す', () => {
      const color1 = CSSColor.fromRGB({ r: 128, g: 64, b: 192 });
      const color2 = CSSColor.fromRGB({ r: 128, g: 64, b: 192 });
      expect(CSSColor.equals(color1, color2)).toBe(true);
    });

    test('異なるRGB値の場合falseを返す', () => {
      const color1 = CSSColor.fromRGB({ r: 128, g: 64, b: 192 });
      const color2 = CSSColor.fromRGB({ r: 128, g: 64, b: 191 });
      expect(CSSColor.equals(color1, color2)).toBe(false);
    });
  });

  describe('toString', () => {
    test('デフォルトでHEX形式を返す', () => {
      const color = CSSColor.fromRGB({ r: 255, g: 0, b: 128 });
      expect(CSSColor.toString(color)).toBe('#ff0080');
    });
  });
});