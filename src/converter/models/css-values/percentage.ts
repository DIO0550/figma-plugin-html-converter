/**
 * CSSパーセンテージ値のモデル
 */

import type { Brand } from '../../../types';
import { NUMERIC_COMPARISON } from '../../constants';

// CSSパーセンテージ値のブランド型
export type CSSPercentage = Brand<number, 'CSSPercentage'>;

/**
 * CSSパーセンテージ値のコンパニオンオブジェクト
 */
export const CSSPercentage = {
  /**
   * 数値からCSSPercentage型を作成（負の値は0にクランプ）
   */
  from(value: number): CSSPercentage {
    return Math.max(0, value) as CSSPercentage;
  },

  /**
   * 文字列をパースしてCSSPercentage型を作成
   */
  parse(str: string): CSSPercentage | null {
    const match = str.trim().match(/^(\d+(?:\.\d+)?)%$/);
    if (!match) return null;
    
    const value = parseFloat(match[1]);
    return CSSPercentage.from(value);
  },

  /**
   * 値を取得
   */
  getValue(percentage: CSSPercentage): number {
    return percentage as number;
  },

  /**
   * ピクセルに変換（親要素のサイズが必要）
   */
  toPixels(percentage: CSSPercentage, parentSize: number): number {
    return (percentage as number) * parentSize / NUMERIC_COMPARISON.PERCENTAGE_DIVISOR;
  },

  /**
   * 0-1の範囲の比率に変換
   */
  toRatio(percentage: CSSPercentage): number {
    return (percentage as number) / NUMERIC_COMPARISON.PERCENTAGE_DIVISOR;
  },

  /**
   * 文字列表現を取得
   */
  toString(percentage: CSSPercentage): string {
    return `${percentage as number}%`;
  },

  /**
   * 100%かどうかを判定
   */
  isFull(percentage: CSSPercentage): boolean {
    return (percentage as number) === NUMERIC_COMPARISON.FULL_PERCENTAGE;
  },

  /**
   * 50%かどうかを判定
   */
  isHalf(percentage: CSSPercentage): boolean {
    return (percentage as number) === NUMERIC_COMPARISON.HALF_PERCENTAGE;
  },

  /**
   * 2つのCSSPercentageが等しいかを判定
   */
  equals(a: CSSPercentage, b: CSSPercentage): boolean {
    return (a as number) === (b as number);
  },

  /**
   * パーセンテージを小数に変換（0-1）
   */
  toDecimal(percentage: CSSPercentage): number {
    return (percentage as number) / NUMERIC_COMPARISON.PERCENTAGE_DIVISOR;
  },

  /**
   * ゼロ値を判定
   */
  isZero(percentage: CSSPercentage): boolean {
    return (percentage as number) === 0;
  }
};