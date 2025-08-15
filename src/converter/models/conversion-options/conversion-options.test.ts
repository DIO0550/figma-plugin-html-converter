import { describe, test, expect } from 'vitest';
import { ConversionOptions } from './conversion-options';
import type { ConversionOptions as ConversionOptionsType } from './conversion-options';

describe('ConversionOptions', () => {
  describe('getDefault', () => {
    test('デフォルトオプションを取得できる', () => {
      const options = ConversionOptions.getDefault();
      
      expect(options).toEqual({
        defaultFont: { family: 'Inter', style: 'Regular' },
        containerWidth: 800,
        containerHeight: 600,
        spacing: 8,
        colorMode: 'rgb'
      });
    });
  });

  describe('merge', () => {
    test('ベースオプションとオーバーライドをマージできる', () => {
      const base = ConversionOptions.getDefault();
      const override = {
        containerWidth: 1200,
        colorMode: 'hex' as const
      };
      
      const merged = ConversionOptions.merge(base, override);
      
      expect(merged.containerWidth).toBe(1200);
      expect(merged.colorMode).toBe('hex');
      expect(merged.containerHeight).toBe(600); // ベースの値が保持される
      expect(merged.spacing).toBe(8); // ベースの値が保持される
    });

    test('空のオーバーライドでベースオプションが保持される', () => {
      const base = ConversionOptions.getDefault();
      const merged = ConversionOptions.merge(base, {});
      
      expect(merged).toEqual(base);
    });
  });

  describe('mergeAll', () => {
    test('複数のオプションをマージできる', () => {
      const options1 = { containerWidth: 1000 };
      const options2 = { containerHeight: 800 };
      const options3 = { colorMode: 'hex' as const };
      
      const merged = ConversionOptions.mergeAll(options1, options2, options3);
      
      expect(merged.containerWidth).toBe(1000);
      expect(merged.containerHeight).toBe(800);
      expect(merged.colorMode).toBe('hex');
      expect(merged.spacing).toBe(8); // デフォルト値
    });

    test('後のオプションが前のオプションを上書きする', () => {
      const options1 = { containerWidth: 1000 };
      const options2 = { containerWidth: 1200 };
      
      const merged = ConversionOptions.mergeAll(options1, options2);
      
      expect(merged.containerWidth).toBe(1200);
    });
  });

  describe('validate', () => {
    test('有効なオプションがtrueを返す', () => {
      const options = ConversionOptions.getDefault();
      expect(ConversionOptions.validate(options)).toBe(true);
    });

    test('負のcontainerWidthがfalseを返す', () => {
      const options: ConversionOptionsType = {
        containerWidth: -100
      };
      expect(ConversionOptions.validate(options)).toBe(false);
    });

    test('負のcontainerHeightがfalseを返す', () => {
      const options: ConversionOptionsType = {
        containerHeight: -100
      };
      expect(ConversionOptions.validate(options)).toBe(false);
    });

    test('負のspacingがfalseを返す', () => {
      const options: ConversionOptionsType = {
        spacing: -5
      };
      expect(ConversionOptions.validate(options)).toBe(false);
    });

    test('無効なcolorModeがfalseを返す', () => {
      const options: ConversionOptionsType = {
        colorMode: 'invalid' as ConversionOptionsType['colorMode']
      };
      expect(ConversionOptions.validate(options)).toBe(false);
    });

    test('ゼロのcontainerWidthがfalseを返す', () => {
      const options: ConversionOptionsType = {
        containerWidth: 0
      };
      expect(ConversionOptions.validate(options)).toBe(false);
    });
  });

  describe('normalize', () => {
    test('負の値を正の値に正規化する', () => {
      const options = {
        containerWidth: -800,
        containerHeight: -600,
        spacing: -8
      };
      
      const normalized = ConversionOptions.normalize(options);
      
      expect(normalized.containerWidth).toBe(800);
      expect(normalized.containerHeight).toBe(600);
      expect(normalized.spacing).toBe(8);
    });

    test('未定義の値にデフォルト値が設定される', () => {
      const options = {
        containerWidth: 1000
      };
      
      const normalized = ConversionOptions.normalize(options);
      
      expect(normalized.containerWidth).toBe(1000);
      expect(normalized.containerHeight).toBe(600); // デフォルト値
      expect(normalized.defaultFont).toEqual({ family: 'Inter', style: 'Regular' });
    });
  });

  describe('型ガード', () => {
    test('hasDefaultFontが正しく動作する', () => {
      const withFont: ConversionOptionsType = {
        defaultFont: { family: 'Arial', style: 'Bold' }
      };
      const withoutFont: ConversionOptionsType = {};
      
      expect(ConversionOptions.hasDefaultFont(withFont)).toBe(true);
      expect(ConversionOptions.hasDefaultFont(withoutFont)).toBe(false);
    });

    test('hasContainerSizeが正しく動作する', () => {
      const withSize: ConversionOptionsType = {
        containerWidth: 800,
        containerHeight: 600
      };
      const withoutSize: ConversionOptionsType = {
        containerWidth: 800
      };
      
      expect(ConversionOptions.hasContainerSize(withSize)).toBe(true);
      expect(ConversionOptions.hasContainerSize(withoutSize)).toBe(false);
    });
  });

  describe('カラーモードチェック', () => {
    test('isRGBModeが正しく動作する', () => {
      const rgbOptions: ConversionOptionsType = { colorMode: 'rgb' };
      const hexOptions: ConversionOptionsType = { colorMode: 'hex' };
      const noMode: ConversionOptionsType = {};
      
      expect(ConversionOptions.isRGBMode(rgbOptions)).toBe(true);
      expect(ConversionOptions.isRGBMode(hexOptions)).toBe(false);
      expect(ConversionOptions.isRGBMode(noMode)).toBe(false);
    });

    test('isHexModeが正しく動作する', () => {
      const hexOptions: ConversionOptionsType = { colorMode: 'hex' };
      const rgbOptions: ConversionOptionsType = { colorMode: 'rgb' };
      const noMode: ConversionOptionsType = {};
      
      expect(ConversionOptions.isHexMode(hexOptions)).toBe(true);
      expect(ConversionOptions.isHexMode(rgbOptions)).toBe(false);
      expect(ConversionOptions.isHexMode(noMode)).toBe(false);
    });
  });

  describe('from', () => {
    test('部分的なオプションから完全なオプションを作成する', () => {
      const partial = {
        containerWidth: 1200
      };
      
      const options = ConversionOptions.from(partial);
      
      expect(options.containerWidth).toBe(1200);
      expect(options.containerHeight).toBe(600); // デフォルト値
      expect(options.spacing).toBe(8); // デフォルト値
      expect(options.colorMode).toBe('rgb'); // デフォルト値
    });

    test('空のオブジェクトからデフォルトオプションを作成する', () => {
      const options = ConversionOptions.from();
      
      expect(options).toEqual(ConversionOptions.getDefault());
    });

    test('負の値が正規化される', () => {
      const partial = {
        containerWidth: -1000,
        spacing: -10
      };
      
      const options = ConversionOptions.from(partial);
      
      expect(options.containerWidth).toBe(1000);
      expect(options.spacing).toBe(10);
    });
  });
});