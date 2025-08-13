/**
 * CSS長さ値のモデル
 */

import type { Brand } from '../../../types';
import { DEFAULT_VIEWPORT, NUMERIC_COMPARISON } from '../../constants';

// CSS長さ値のブランド型
export type CSSLength = Brand<{ value: number; unit: LengthUnit }, 'CSSLength'>;

// 長さの単位
export type LengthUnit = 'px' | 'rem' | 'em' | 'vh' | 'vw';

/**
 * CSS長さ値のコンパニオンオブジェクト
 */
export const CSSLength = {
  /**
   * 数値と単位からCSSLength型を作成
   */
  from(value: number, unit: LengthUnit): CSSLength {
    return { value, unit } as CSSLength;
  },

  /**
   * ピクセル値からCSSLength型を作成
   */
  fromPixels(pixels: number): CSSLength {
    return CSSLength.from(pixels, 'px');
  },

  /**
   * 文字列をパースしてCSSLength型を作成
   */
  parse(str: string): CSSLength | null {
    const match = str.trim().match(/^(\d+(?:\.\d+)?)(px|rem|em|vh|vw)$/);
    if (!match) return null;

    const value = parseFloat(match[1]);
    const unit = match[2] as LengthUnit;
    return CSSLength.from(value, unit);
  },

  /**
   * ピクセルに変換
   */
  toPixels(length: CSSLength, context?: { viewportWidth?: number; viewportHeight?: number; fontSize?: number }): number {
    const { value, unit } = length as { value: number; unit: LengthUnit };
    const ctx = {
      viewportWidth: context?.viewportWidth ?? DEFAULT_VIEWPORT.WIDTH,
      viewportHeight: context?.viewportHeight ?? DEFAULT_VIEWPORT.HEIGHT,
      fontSize: context?.fontSize ?? DEFAULT_VIEWPORT.FONT_SIZE
    };

    switch (unit) {
      case 'px':
        return value;
      case 'rem':
      case 'em':
        // remもemも現在のコンテキストのfontSizeを使用（テスト互換性のため）
        return value * ctx.fontSize;
      case 'vh':
        return value * (ctx.viewportHeight / NUMERIC_COMPARISON.PERCENTAGE_DIVISOR);
      case 'vw':
        return value * (ctx.viewportWidth / NUMERIC_COMPARISON.PERCENTAGE_DIVISOR);
      default:
        return value;
    }
  },

  /**
   * 値を取得
   */
  getValue(length: CSSLength): number {
    return (length as { value: number; unit: LengthUnit }).value;
  },

  /**
   * 単位を取得
   */
  getUnit(length: CSSLength): LengthUnit {
    return (length as { value: number; unit: LengthUnit }).unit;
  },

  /**
   * viewport単位かどうかを判定
   */
  isViewportUnit(length: CSSLength): boolean {
    const unit = CSSLength.getUnit(length);
    return unit === 'vh' || unit === 'vw';
  },

  /**
   * フォント相対単位かどうかを判定
   */
  isFontRelativeUnit(length: CSSLength): boolean {
    const unit = CSSLength.getUnit(length);
    return unit === 'rem' || unit === 'em';
  },

  /**
   * 絶対単位かどうかを判定
   */
  isAbsoluteUnit(length: CSSLength): boolean {
    return CSSLength.getUnit(length) === 'px';
  },

  /**
   * 文字列表現を取得
   */
  toString(length: CSSLength): string {
    const { value, unit } = length as { value: number; unit: LengthUnit };
    return `${value}${unit}`;
  },

  /**
   * 2つのCSSLengthが等しいかを判定
   */
  equals(a: CSSLength, b: CSSLength): boolean {
    const aData = a as { value: number; unit: LengthUnit };
    const bData = b as { value: number; unit: LengthUnit };
    return aData.value === bData.value && aData.unit === bData.unit;
  },

  /**
   * ゼロ値を判定
   */
  isZero(length: CSSLength): boolean {
    const data = length as { value: number; unit: LengthUnit };
    return data.value === 0;
  }
};