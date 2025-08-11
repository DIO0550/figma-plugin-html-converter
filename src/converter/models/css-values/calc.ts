/**
 * CSS calc()式のモデルとパーサー
 */

import type { Brand } from '../../../types';
import { CSSLength } from './length';
import { CSSPercentage } from './percentage';

// calc()式のブランド型
export type CalcExpression = Brand<string, 'CalcExpression'>;

// calc()式の演算子
export type CalcOperator = '+' | '-' | '*' | '/';

// calc()式の項
export interface CalcTerm {
  value: number;
  unit: 'px' | 'rem' | 'em' | 'vh' | 'vw' | '%';
}

// calc()式の演算
export interface CalcOperation {
  left: CalcTerm;
  operator: CalcOperator;
  right: CalcTerm;
}

/**
 * calc()式のコンパニオンオブジェクト
 */
export const Calc = {
  /**
   * 文字列からCalcExpression型を作成
   */
  from(value: string): CalcExpression | null {
    if (!Calc.isValid(value)) return null;
    return value as CalcExpression;
  },

  /**
   * calc()式かどうかを判定
   */
  isValid(value: string): boolean {
    const trimmed = value.trim();
    return trimmed.startsWith('calc(') && trimmed.endsWith(')');
  },

  /**
   * calc()式をパースして演算を抽出
   */
  parse(calc: CalcExpression): CalcOperation | null {
    const content = Calc.extractContent(calc);
    if (!content) return null;

    // 加算のパターン - より柔軟な正規表現で、数値と単位の間にスペースがない場合も対応
    const addMatch = content.match(/^(\d+(?:\.\d+)?)(px|rem|em|vh|vw|%)?\s*\+\s*(\d+(?:\.\d+)?)(px|rem|em|vh|vw|%)?$/);
    if (addMatch) {
      return {
        left: {
          value: parseFloat(addMatch[1]),
          unit: (addMatch[2] || 'px') as CalcTerm['unit']
        },
        operator: '+',
        right: {
          value: parseFloat(addMatch[3]),
          unit: (addMatch[4] || 'px') as CalcTerm['unit']
        }
      };
    }

    // 減算のパターン - より柔軟な正規表現で、数値と単位の間にスペースがない場合も対応
    const subMatch = content.match(/^(\d+(?:\.\d+)?)(px|rem|em|vh|vw|%)?\s*-\s*(\d+(?:\.\d+)?)(px|rem|em|vh|vw|%)?$/);
    if (subMatch) {
      return {
        left: {
          value: parseFloat(subMatch[1]),
          unit: (subMatch[2] || 'px') as CalcTerm['unit']
        },
        operator: '-',
        right: {
          value: parseFloat(subMatch[3]),
          unit: (subMatch[4] || 'px') as CalcTerm['unit']
        }
      };
    }

    return null;
  },

  /**
   * calc()式の中身を抽出
   */
  extractContent(calc: CalcExpression): string | null {
    const match = (calc as string).match(/^calc\(([^)]+)\)$/);
    return match ? match[1].trim() : null;
  },

  /**
   * calc()式を評価してピクセル値に変換
   */
  evaluate(calc: CalcExpression, context?: { viewportWidth?: number; viewportHeight?: number; fontSize?: number }): number | null {
    const operation = Calc.parse(calc);
    if (!operation) return null;

    const ctx = {
      viewportWidth: context?.viewportWidth ?? 1920,
      viewportHeight: context?.viewportHeight ?? 1080,
      fontSize: context?.fontSize ?? 16
    };

    const leftPixels = Calc.termToPixels(operation.left, ctx);
    const rightPixels = Calc.termToPixels(operation.right, ctx);

    switch (operation.operator) {
      case '+':
        return leftPixels + rightPixels;
      case '-':
        return leftPixels - rightPixels;
      case '*':
        return leftPixels * rightPixels;
      case '/':
        return rightPixels !== 0 ? leftPixels / rightPixels : null;
      default:
        return null;
    }
  },

  /**
   * calc項をピクセルに変換
   */
  termToPixels(term: CalcTerm, context: { viewportWidth: number; viewportHeight: number; fontSize: number }): number {
    switch (term.unit) {
      case 'px':
        return term.value;
      case 'rem':
      case 'em':
        return term.value * context.fontSize;
      case 'vh':
        return term.value * (context.viewportHeight / 100);
      case 'vw':
        return term.value * (context.viewportWidth / 100);
      case '%':
        // パーセンテージは文脈依存なので0を返す
        return 0;
      default:
        return term.value;
    }
  },

  /**
   * CSSLengthまたはCSSPercentageに変換
   */
  toLength(calc: CalcExpression, context?: { viewportWidth?: number; viewportHeight?: number; fontSize?: number }): CSSLength | null {
    const pixels = Calc.evaluate(calc, context);
    return pixels !== null ? CSSLength.fromPixels(pixels) : null;
  },

  /**
   * calc(100% - Xpx)のような特殊なケースを検出
   */
  isPercentageMinusPixels(calc: CalcExpression): boolean {
    const content = Calc.extractContent(calc);
    if (!content) return false;
    return /^\d+%\s*-\s*\d+(?:\.\d+)?px$/.test(content);
  },

  /**
   * 文字列表現を取得
   */
  toString(calc: CalcExpression): string {
    return calc as string;
  }
};