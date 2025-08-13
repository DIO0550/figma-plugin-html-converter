/**
 * CSS色値のモデル
 */

import type { Brand } from '../../../types';
import type { RGB } from '../colors';
import { Colors } from '../colors';
import { RGB_CONSTANTS, HEX_COLOR_CONSTANTS } from '../../constants/color-constants';
import { NUMERIC_COMPARISON } from '../../constants';

// CSS色値のブランド型
export type CSSColor = Brand<RGB, 'CSSColor'>;

/**
 * CSS色値のコンパニオンオブジェクト
 */
export const CSSColor = {
  /**
   * RGBからCSSColor型を作成（0-1の範囲）
   */
  from(rgb: RGB): CSSColor {
    return rgb as CSSColor;
  },

  /**
   * RGB値からCSSColor型を作成（0-255の範囲から0-1へ変換）
   */
  fromRGB(rgb: { r: number; g: number; b: number }): CSSColor {
    // RGB値を0-255の範囲から0-1に変換
    const normalized = {
      r: Math.max(0, Math.min(RGB_CONSTANTS.MAX_VALUE, rgb.r)) / RGB_CONSTANTS.MAX_VALUE,
      g: Math.max(0, Math.min(RGB_CONSTANTS.MAX_VALUE, rgb.g)) / RGB_CONSTANTS.MAX_VALUE,
      b: Math.max(0, Math.min(RGB_CONSTANTS.MAX_VALUE, rgb.b)) / RGB_CONSTANTS.MAX_VALUE
    };
    return CSSColor.from(normalized);
  },

  /**
   * 文字列をパースしてCSSColor型を作成
   */
  parse(str: string): CSSColor | null {
    const trimmed = str.trim();
    
    // rgb()またはrgba()関数の場合、値の範囲をチェック
    if (trimmed.startsWith('rgb(') || trimmed.startsWith('rgba(')) {
      const match = trimmed.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+)?\s*\)/);
      if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        // 範囲外の値はnullを返す
        if (r < 0 || r > RGB_CONSTANTS.MAX_VALUE || g < 0 || g > RGB_CONSTANTS.MAX_VALUE || b < 0 || b > RGB_CONSTANTS.MAX_VALUE) {
          return null;
        }
      }
    }
    
    const rgb = Colors.parse(str);
    return rgb ? CSSColor.from(rgb) : null;
  },

  /**
   * 16進数文字列からCSSColor型を作成
   */
  fromHex(hex: string): CSSColor | null {
    // 有効な16進数カラーコードかチェック
    const cleanHex = hex.replace('#', '');
    if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
      return null;
    }
    const rgb = Colors.parse(hex);
    return rgb ? CSSColor.from(rgb) : null;
  },

  /**
   * RGB値を取得（0-255の範囲）
   */
  toRGB(color: CSSColor): { r: number; g: number; b: number } {
    const rgb = color as RGB;
    return {
      r: Math.round(rgb.r * RGB_CONSTANTS.MAX_VALUE),
      g: Math.round(rgb.g * RGB_CONSTANTS.MAX_VALUE),
      b: Math.round(rgb.b * RGB_CONSTANTS.MAX_VALUE)
    };
  },

  /**
   * Figma用のRGB値を取得（0-1の範囲）
   */
  toFigmaRGB(color: CSSColor): RGB {
    return color as RGB;
  },

  /**
   * 赤成分を取得（0-255）
   */
  getRed(color: CSSColor): number {
    return Math.round((color as RGB).r * RGB_CONSTANTS.MAX_VALUE);
  },

  /**
   * 緑成分を取得（0-255）
   */
  getGreen(color: CSSColor): number {
    return Math.round((color as RGB).g * RGB_CONSTANTS.MAX_VALUE);
  },

  /**
   * 青成分を取得（0-255）
   */
  getBlue(color: CSSColor): number {
    return Math.round((color as RGB).b * RGB_CONSTANTS.MAX_VALUE);
  },

  /**
   * 16進数文字列に変換
   */
  toHex(color: CSSColor): string {
    const rgb = color as RGB;
    const r = Math.round(rgb.r * RGB_CONSTANTS.MAX_VALUE).toString(HEX_COLOR_CONSTANTS.RADIX).padStart(2, '0');
    const g = Math.round(rgb.g * RGB_CONSTANTS.MAX_VALUE).toString(HEX_COLOR_CONSTANTS.RADIX).padStart(2, '0');
    const b = Math.round(rgb.b * RGB_CONSTANTS.MAX_VALUE).toString(HEX_COLOR_CONSTANTS.RADIX).padStart(2, '0');
    return `#${r}${g}${b}`;
  },

  /**
   * rgb()関数文字列に変換
   */
  toRGBString(color: CSSColor): string {
    const rgb = color as RGB;
    const r = Math.round(rgb.r * RGB_CONSTANTS.MAX_VALUE);
    const g = Math.round(rgb.g * RGB_CONSTANTS.MAX_VALUE);
    const b = Math.round(rgb.b * RGB_CONSTANTS.MAX_VALUE);
    return `rgb(${r}, ${g}, ${b})`;
  },

  /**
   * 2つのCSSColorが等しいかを判定
   */
  equals(a: CSSColor, b: CSSColor): boolean {
    const aRGB = a as RGB;
    const bRGB = b as RGB;
    // 浮動小数点の誤差を考慮
    return Math.abs(aRGB.r - bRGB.r) < NUMERIC_COMPARISON.EPSILON &&
           Math.abs(aRGB.g - bRGB.g) < NUMERIC_COMPARISON.EPSILON &&
           Math.abs(aRGB.b - bRGB.b) < NUMERIC_COMPARISON.EPSILON;
  },

  /**
   * 黒色かどうかを判定
   */
  isBlack(color: CSSColor): boolean {
    const rgb = color as RGB;
    return rgb.r < NUMERIC_COMPARISON.EPSILON && 
           rgb.g < NUMERIC_COMPARISON.EPSILON && 
           rgb.b < NUMERIC_COMPARISON.EPSILON;
  },

  /**
   * 白色かどうかを判定
   */
  isWhite(color: CSSColor): boolean {
    const rgb = color as RGB;
    return Math.abs(rgb.r - 1) < NUMERIC_COMPARISON.EPSILON && 
           Math.abs(rgb.g - 1) < NUMERIC_COMPARISON.EPSILON && 
           Math.abs(rgb.b - 1) < NUMERIC_COMPARISON.EPSILON;
  },

  /**
   * 文字列表現を取得（デフォルトはHEX形式）
   */
  toString(color: CSSColor): string {
    return CSSColor.toHex(color);
  }
};