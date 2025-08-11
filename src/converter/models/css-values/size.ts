/**
 * CSSサイズ値（width, height）のモデル
 */

import type { Brand } from '../../../types';
import { CSSLength } from './length';
import { CSSPercentage } from './percentage';
import { CalcExpression, Calc } from './calc';

// サイズ値の種類（数値も含む - ピクセル値として扱う）
export type CSSSizeValue = CSSLength | CSSPercentage | number | 'auto' | 'inherit' | 'initial';

// CSSサイズのブランド型
export type CSSSize = Brand<CSSSizeValue, 'CSSSize'>;

/**
 * CSSサイズ値のコンパニオンオブジェクト
 */
// ユーティリティ関数
function isCSSLength(value: unknown): value is CSSLength {
  return typeof value === 'object' && 
         value !== null && 
         'value' in value && 
         'unit' in value &&
         typeof (value as any).value === 'number' &&
         typeof (value as any).unit === 'string';
}

function isCSSPercentage(value: unknown): value is CSSPercentage {
  return typeof value === 'number';
}

export const CSSSize = {
  /**
   * 値からCSSSize型を作成
   */
  from(value: CSSSizeValue): CSSSize {
    return value as CSSSize;
  },

  /**
   * autoサイズを作成
   */
  auto(): CSSSize {
    return 0 as CSSSize;  // Mapperとの互換性のため0を返す
  },

  /**
   * inheritサイズを作成
   */
  inherit(): CSSSize {
    return CSSSize.from('inherit');
  },

  /**
   * ピクセル値からCSSSize型を作成
   */
  fromPixels(pixels: number): CSSSize {
    // 直接ピクセル値を返す（Mapper.tsとの互換性のため）
    return pixels as CSSSize;
  },

  /**
   * パーセンテージ値からCSSSize型を作成
   */
  fromPercentage(percentage: number): CSSSize {
    return CSSSize.from(CSSPercentage.from(percentage));
  },

  /**
   * 文字列をパースしてCSSSize型を作成
   */
  parse(str: string): CSSSize | null {
    const trimmed = str.trim();
    
    // 特殊な値
    if (trimmed === 'auto' || trimmed === 'inherit' || trimmed === 'initial') {
      return CSSSize.from(trimmed as 'auto' | 'inherit' | 'initial');
    }
    
    // calc()式の場合
    if (Calc.isValid(trimmed)) {
      const calc = Calc.from(trimmed);
      if (calc) {
        // calc(100% - 40px)のような特殊ケース
        if (Calc.isPercentageMinusPixels(calc)) {
          return CSSSize.fromPercentage(100);
        }
        
        // 通常のcalc()は評価して数値（ピクセル）として扱う
        const pixels = Calc.evaluate(calc, {
          viewportWidth: 1920,
          viewportHeight: 1080,
          fontSize: 16
        });
        return pixels !== null ? (pixels as CSSSize) : null;
      }
    }
    
    // パーセンテージの場合
    const percentage = CSSPercentage.parse(trimmed);
    if (percentage) {
      return CSSSize.from(percentage);
    }
    
    // 長さ値の場合
    const length = CSSLength.parse(trimmed);
    if (length) {
      // rem、em、vw、vh単位はピクセルに変換
      const unit = CSSLength.getUnit(length);
      if (unit === 'rem' || unit === 'em' || unit === 'vw' || unit === 'vh') {
        const pixels = CSSLength.toPixels(length, {
          viewportWidth: 1920,
          viewportHeight: 1080,
          fontSize: 16
        });
        return pixels as CSSSize;
      }
      // px単位の場合は数値として返す
      if (unit === 'px') {
        return CSSLength.getValue(length) as CSSSize;
      }
      return CSSSize.from(length);
    }
    
    // 単位なしの数値の場合（ピクセルとして扱う）
    const num = parseFloat(trimmed);
    if (!isNaN(num)) {
      return num as CSSSize;
    }
    
    return null;
  },

  /**
   * 値を取得
   */
  getValue(size: CSSSize): CSSSizeValue {
    return size as CSSSizeValue;
  },

  /**
   * 型を取得
   */
  getType(size: CSSSize): 'pixels' | 'percentage' | 'auto' | 'inherit' | 'initial' {
    const value = size as CSSSizeValue;
    
    if (typeof value === 'string') {
      return value as 'auto' | 'inherit' | 'initial';
    }
    
    if (typeof value === 'number') {
      return 'pixels';
    }
    
    if (isCSSPercentage(value)) {
      return 'percentage';
    }
    
    if (isCSSLength(value)) {
      return 'pixels';
    }
    
    return 'auto';
  },

  /**
   * autoかどうかを判定
   */
  isAuto(size: CSSSize): boolean {
    const value = size as CSSSizeValue;
    return value === 'auto' || value === 0;  // Mapperとの互換性のため0もautoとして扱う
  },

  /**
   * パーセンテージかどうかを判定
   */
  isPercentage(size: CSSSize): boolean {
    const value = size as CSSSizeValue;
    return isCSSPercentage(value);
  },

  /**
   * ピクセル値かどうかを判定
   */
  isPixels(size: CSSSize): boolean {
    const value = size as CSSSizeValue;
    return typeof value === 'number' || isCSSLength(value);
  },

  /**
   * 長さ値かどうかを判定
   */
  isLength(size: CSSSize): boolean {
    const value = size as CSSSizeValue;
    return typeof value === 'number' || isCSSLength(value);
  },

  /**
   * ピクセルに変換（可能な場合）
   */
  toPixels(size: CSSSize, parentSize?: number): number | null {
    const value = CSSSize.getValue(size);
    
    if (typeof value === 'string') {
      // auto, inherit, initial は変換できない
      return null;
    }
    
    if (typeof value === 'number') {
      return value;
    }
    
    // CSSPercentageの場合
    if (isCSSPercentage(value)) {
      if (parentSize === undefined) return null;
      return CSSPercentage.toPixels(value as CSSPercentage, parentSize);
    }
    
    // CSSLengthの場合
    if (isCSSLength(value)) {
      return CSSLength.toPixels(value as CSSLength);
    }
    
    return null;
  },

  /**
   * 文字列表現を取得
   */
  toString(size: CSSSize): string {
    const value = CSSSize.getValue(size);
    
    if (typeof value === 'string') {
      return value;
    }
    
    if (typeof value === 'number') {
      return `${value}px`;
    }
    
    if (isCSSPercentage(value)) {
      return CSSPercentage.toString(value as CSSPercentage);
    }
    
    if (isCSSLength(value)) {
      return CSSLength.toString(value as CSSLength);
    }
    
    return '';
  },

  /**
   * 2つのCSSSizeが等しいかを判定
   */
  equals(a: CSSSize, b: CSSSize): boolean {
    const aType = CSSSize.getType(a);
    const bType = CSSSize.getType(b);
    
    if (aType !== bType) return false;
    
    const aValue = CSSSize.getValue(a);
    const bValue = CSSSize.getValue(b);
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue === bValue;
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return aValue === bValue;
    }
    
    // CSSPercentageの場合
    if (isCSSPercentage(aValue) && isCSSPercentage(bValue)) {
      return CSSPercentage.equals(aValue as CSSPercentage, bValue as CSSPercentage);
    }
    
    // CSSLengthの場合
    if (isCSSLength(aValue) && isCSSLength(bValue)) {
      return CSSLength.equals(aValue as CSSLength, bValue as CSSLength);
    }
    
    return false;
  }
};