/**
 * 既存のコードとの互換性のためのアダプター
 */

import { CSSSpacing } from './spacing';
import { CSSColor } from './color';
import { Calc } from './calc';
import type { SizeValue } from '../styles';
import type { RGB } from '../colors';

// デフォルトのコンテキスト
const DEFAULT_CONTEXT = {
  viewportWidth: 1920,
  viewportHeight: 1080,
  fontSize: 16
};

/**
 * CSS値の統合アダプター
 */
export const CSSValueAdapter = {
  /**
   * 文字列からサイズ値をパース（既存のStyles.parseSize互換）
   */
  parseSize(str: string | undefined): number | SizeValue | null {
    if (!str) return null;
    
    const trimmed = str.trim();
    
    // 特殊な値
    if (trimmed === 'auto' || trimmed === 'inherit' || trimmed === 'initial') {
      return null;
    }
    
    // calc()式の場合
    if (Calc.isValid(trimmed)) {
      const calc = Calc.from(trimmed);
      if (calc) {
        // calc(100% - 40px)のような特殊ケース
        if (Calc.isPercentageMinusPixels(calc)) {
          return { value: 100, unit: '%' };
        }
        const pixels = Calc.evaluate(calc, DEFAULT_CONTEXT);
        return pixels !== null ? pixels : null;
      }
    }
    
    // パーセンテージの場合
    const percentageMatch = trimmed.match(/^(\d+(?:\.\d+)?)%$/);
    if (percentageMatch) {
      return {
        value: parseFloat(percentageMatch[1]),
        unit: '%'
      };
    }
    
    // 単位付きの数値
    const lengthMatch = trimmed.match(/^(\d+(?:\.\d+)?)(px|rem|em|vh|vw)?$/);
    if (lengthMatch) {
      const value = parseFloat(lengthMatch[1]);
      const unit = lengthMatch[2];
      
      if (!unit || unit === 'px') {
        return value;
      }
      
      // viewport units
      if (unit === 'vw') {
        return value * (DEFAULT_CONTEXT.viewportWidth / 100);
      }
      if (unit === 'vh') {
        return value * (DEFAULT_CONTEXT.viewportHeight / 100);
      }
      
      // font relative units
      if (unit === 'rem' || unit === 'em') {
        return value * DEFAULT_CONTEXT.fontSize;
      }
    }
    
    return null;
  },

  /**
   * 文字列からスペーシング値をパース（既存のFlexbox.parseSpacing互換）
   */
  parseSpacing(str: string | undefined, defaultValue: number = 0): number {
    if (!str) return defaultValue;
    
    const spacing = CSSSpacing.parse(str, DEFAULT_CONTEXT);
    return spacing ? CSSSpacing.getValue(spacing) : defaultValue;
  },

  /**
   * パディングのショートハンドをパース（既存のStyles.parsePadding互換）
   */
  parsePadding(str: string | undefined): { top: number; right: number; bottom: number; left: number } | null {
    if (!str) return null;
    
    const box = CSSSpacing.parseShorthand(str, DEFAULT_CONTEXT);
    if (!box) return null;
    
    return {
      top: CSSSpacing.getValue(box.top),
      right: CSSSpacing.getValue(box.right),
      bottom: CSSSpacing.getValue(box.bottom),
      left: CSSSpacing.getValue(box.left)
    };
  },

  /**
   * 文字列から色をパース（既存のColors.parse互換）
   */
  parseColor(str: string | undefined): RGB | { r: number; g: number; b: number } | null {
    if (!str) return null;
    
    const color = CSSColor.parse(str);
    // テストはRGB値（0-255）を期待しているのでtoRGBを使う
    return color ? CSSColor.toRGB(color) : null;
  },

  /**
   * calc()式かどうかを判定（既存のCalcParser.isCalcExpression互換）
   */
  isCalc(str: string): boolean {
    return Calc.isValid(str);
  },

  /**
   * calc()式を評価（既存のCalcParser.parse互換）
   */
  parseCalc(str: string): number | null {
    const calc = Calc.from(str);
    return calc ? Calc.evaluate(calc, DEFAULT_CONTEXT) : null;
  },

  /**
   * コンテキストを設定
   */
  setContext(context: { viewportWidth?: number; viewportHeight?: number; fontSize?: number }): void {
    Object.assign(DEFAULT_CONTEXT, context);
  },

  /**
   * コンテキストをリセット
   */
  resetContext(): void {
    DEFAULT_CONTEXT.viewportWidth = 1920;
    DEFAULT_CONTEXT.viewportHeight = 1080;
    DEFAULT_CONTEXT.fontSize = 16;
  }
};