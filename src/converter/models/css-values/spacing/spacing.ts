/**
 * CSSスペーシング値（margin, padding, gap）のモデル
 */

import type { Brand } from '../../../../types';
import { CSSLength } from '../length';
import { Calc } from '../calc';

// ピクセル単位で統一することで、異なる単位間の計算を簡略化し、
// Figmaへの変換時の精度を保証する
export type CSSSpacing = Brand<number, 'CSSSpacing'>;

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
   * calc()内のスペースを保持しつつ、トップレベルのスペースで分割
   * 例: "10px calc(100% - 20px)" → ["10px", "calc(100% - 20px)"]
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
    // CSS仕様では負のmargin以外のスペーシング値は無効となるため、
    // Figmaでの表現上も0以上の値に正規化する
    return Math.max(0, pixels) as CSSSpacing;
  },

  /**
   * 文字列をパースしてCSSSpacing型を作成
   */
  parse(str: string, context?: { viewportWidth?: number; viewportHeight?: number; fontSize?: number }): CSSSpacing | null {
    const trimmed = str.trim();
    
    if (Calc.isValid(trimmed)) {
      const calc = Calc.from(trimmed);
      if (calc) {
        const pixels = Calc.evaluate(calc, context);
        return pixels !== null ? CSSSpacing.from(pixels) : null;
      }
    }
    
    const length = CSSLength.parse(trimmed);
    if (length) {
      const pixels = CSSLength.toPixels(length, context);
      return CSSSpacing.from(pixels);
    }
    
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
    const parts = CSSSpacing.splitValues(str);
    const values = parts.map(p => {
      const trimmed = p.trim();
      if (trimmed === 'auto' || trimmed === 'inherit' || trimmed === 'initial') {
        return null;
      }
      return CSSSpacing.parse(p, context);
    });
    
    if (values.some(v => v === null)) return null;
    
    const validValues = values as CSSSpacing[];
    if (validValues.length === 0) return null;
    
    // CSS shorthand構文に従って値を展開
    // 1値: すべて同じ、2値: 上下/左右、3値: 上/左右/下、4値: 上/右/下/左
    switch (validValues.length) {
      case 1:
        return {
          top: validValues[0],
          right: validValues[0],
          bottom: validValues[0],
          left: validValues[0]
        };
      case 2:
        return {
          top: validValues[0],
          right: validValues[1],
          bottom: validValues[0],
          left: validValues[1]
        };
      case 3:
        return {
          top: validValues[0],
          right: validValues[1],
          bottom: validValues[2],
          left: validValues[1]
        };
      case 4:
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