/**
 * CSSスペーシング値（margin, padding, gap）のモデル
 */

import type { Brand } from '../../../types';
import { CSSLength } from './length';
import { CalcExpression, Calc } from './calc';

// スペーシング値のブランド型（常にピクセルで保持）
export type CSSSpacing = Brand<number, 'CSSSpacing'>;

// スペーシングのボックスモデル
export interface SpacingBox {
  top: CSSSpacing;
  right: CSSSpacing;
  bottom: CSSSpacing;
  left: CSSSpacing;
}

/**
 * CSSスペーシング値のコンパニオンオブジェクト
 */
export const CSSSpacing = {
  /**
   * calc()を含む値を安全に分割
   */
  splitValues(value: string): string[] {
    const result: string[] = [];
    let current = '';
    let depth = 0;
    
    for (let i = 0; i < value.length; i++) {
      const char = value[i];
      
      if (char === '(') {
        depth++;
        current += char;
      } else if (char === ')') {
        depth--;
        current += char;
      } else if (char === ' ' && depth === 0) {
        if (current.trim()) {
          result.push(current.trim());
          current = '';
        }
      } else {
        current += char;
      }
    }
    
    if (current.trim()) {
      result.push(current.trim());
    }
    
    return result;
  },
  /**
   * 数値（ピクセル）からCSSSpacing型を作成
   */
  from(pixels: number): CSSSpacing {
    return Math.max(0, pixels) as CSSSpacing; // 負の値は0にクランプ
  },

  /**
   * 文字列をパースしてCSSSpacing型を作成
   */
  parse(str: string, context?: { viewportWidth?: number; viewportHeight?: number; fontSize?: number }): CSSSpacing | null {
    const trimmed = str.trim();
    
    // calc()式の場合
    if (Calc.isValid(trimmed)) {
      const calc = Calc.from(trimmed);
      if (calc) {
        const pixels = Calc.evaluate(calc, context);
        return pixels !== null ? CSSSpacing.from(pixels) : null;
      }
    }
    
    // 通常の長さ値の場合
    const length = CSSLength.parse(trimmed);
    if (length) {
      const pixels = CSSLength.toPixels(length, context);
      return CSSSpacing.from(pixels);
    }
    
    // 単位なしの数値の場合
    const num = parseFloat(trimmed);
    if (!isNaN(num)) {
      return CSSSpacing.from(num);
    }
    
    return null;
  },

  /**
   * ショートハンド記法をパース（padding/margin用）
   */
  parseShorthand(str: string, context?: { viewportWidth?: number; viewportHeight?: number; fontSize?: number }): SpacingBox | null {
    // calc()を含む値を安全に分割
    const parts = CSSSpacing.splitValues(str);
    const values = parts.map(p => {
      const trimmed = p.trim();
      // 無効な値の場合はnullを返す
      if (trimmed === 'auto' || trimmed === 'inherit' || trimmed === 'initial') {
        return null;
      }
      return CSSSpacing.parse(p, context);
    });
    
    // nullが含まれる場合はnullを返す
    if (values.some(v => v === null)) return null;
    
    const validValues = values as CSSSpacing[];
    if (validValues.length === 0) return null;
    
    // CSS shorthand規則
    switch (validValues.length) {
      case 1:
        // すべて同じ値
        return {
          top: validValues[0],
          right: validValues[0],
          bottom: validValues[0],
          left: validValues[0]
        };
      case 2:
        // 上下、左右
        return {
          top: validValues[0],
          right: validValues[1],
          bottom: validValues[0],
          left: validValues[1]
        };
      case 3:
        // 上、左右、下
        return {
          top: validValues[0],
          right: validValues[1],
          bottom: validValues[2],
          left: validValues[1]
        };
      case 4:
        // 上、右、下、左
        return {
          top: validValues[0],
          right: validValues[1],
          bottom: validValues[2],
          left: validValues[3]
        };
      default:
        // 4つ以上の値がある場合は最初の4つを使用
        return {
          top: validValues[0],
          right: validValues[1],
          bottom: validValues[2],
          left: validValues[3]
        };
    }
  },

  /**
   * 値を取得（ピクセル）
   */
  getValue(spacing: CSSSpacing): number {
    return spacing as number;
  },

  /**
   * デフォルト値
   */
  zero(): CSSSpacing {
    return CSSSpacing.from(0);
  },

  /**
   * デフォルトのボックス
   */
  zeroBox(): SpacingBox {
    const zero = CSSSpacing.zero();
    return {
      top: zero,
      right: zero,
      bottom: zero,
      left: zero
    };
  },

  /**
   * 文字列表現を取得
   */
  toString(spacing: CSSSpacing): string {
    return `${spacing as number}px`;
  },

  /**
   * 2つのCSSSpacingが等しいかを判定
   */
  equals(a: CSSSpacing, b: CSSSpacing): boolean {
    return (a as number) === (b as number);
  },

  /**
   * スペーシングボックスが等しいかを判定
   */
  boxEquals(a: SpacingBox, b: SpacingBox): boolean {
    return CSSSpacing.equals(a.top, b.top) &&
           CSSSpacing.equals(a.right, b.right) &&
           CSSSpacing.equals(a.bottom, b.bottom) &&
           CSSSpacing.equals(a.left, b.left);
  },

  /**
   * ゼロ値かどうかを判定
   */
  isZero(spacing: CSSSpacing): boolean {
    return (spacing as number) === 0;
  }
};