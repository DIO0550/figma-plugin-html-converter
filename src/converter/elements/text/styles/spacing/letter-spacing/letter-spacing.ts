import type { Brand } from "../../../../../../types";
import type { TextNodeConfig } from "../../../../../models/figma-node";

/**
 * 文字間隔のブランド型
 */
export type LetterSpacing = Brand<number, "LetterSpacing">;

/**
 * デフォルトのベースフォントサイズ（rem計算用）
 */
const DEFAULT_BASE_FONT_SIZE = 16 as const;

/**
 * Figmaの文字間隔フォーマット
 */
export interface FigmaLetterSpacing {
  value: number;
  unit: "PIXELS" | "PERCENT";
}

/**
 * LetterSpacingのコンパニオンオブジェクト
 * 文字間隔の作成とパースを担当
 */
export const LetterSpacing = {
  /**
   * LetterSpacingを作成
   */
  create(value: number): LetterSpacing {
    return value as LetterSpacing;
  },

  /**
   * letter-spacingをパース
   * @param letterSpacing - パース対象の文字列
   * @param fontSize - em/percentage計算用のフォントサイズ
   * @param baseFontSize - rem計算用のベースフォントサイズ
   */
  parse(
    letterSpacing: string,
    fontSize?: number,
    baseFontSize: number = DEFAULT_BASE_FONT_SIZE,
  ): LetterSpacing | null {
    if (!letterSpacing || !letterSpacing.trim()) {
      return null;
    }

    const trimmed = letterSpacing.trim().toLowerCase();

    // "normal"の場合は0を返す
    if (trimmed === "normal") {
      return LetterSpacing.create(0);
    }

    // CSS変数やキーワードの場合はnullを返す
    if (
      trimmed === "inherit" ||
      trimmed === "initial" ||
      trimmed === "unset" ||
      trimmed.startsWith("var(")
    ) {
      return null;
    }

    // px値の処理
    if (trimmed.endsWith("px")) {
      const pxValue = parseFloat(trimmed);
      if (!isNaN(pxValue)) {
        return LetterSpacing.create(pxValue);
      }
    }

    // rem値の処理（emより先にチェック）
    if (trimmed.endsWith("rem")) {
      const remValue = parseFloat(trimmed);
      if (!isNaN(remValue)) {
        return LetterSpacing.create(remValue * baseFontSize);
      }
    }

    // em値の処理（fontSizeが必要）
    if (trimmed.endsWith("em") && fontSize !== undefined) {
      const emValue = parseFloat(trimmed);
      if (!isNaN(emValue)) {
        return LetterSpacing.create(emValue * fontSize);
      }
    } else if (trimmed.endsWith("em")) {
      // fontSizeがない場合はnullを返す
      return null;
    }

    // パーセンテージの処理（fontSizeが必要）
    if (trimmed.endsWith("%") && fontSize !== undefined) {
      const percentValue = parseFloat(trimmed);
      if (!isNaN(percentValue)) {
        return LetterSpacing.create((percentValue / 100) * fontSize);
      }
    } else if (trimmed.endsWith("%")) {
      // fontSizeがない場合はnullを返す
      return null;
    }

    // その他の無効な値
    return null;
  },

  /**
   * スタイルから文字間隔を抽出
   * @param styles - CSSスタイルオブジェクト
   * @param fontSize - em/percentage計算用のフォントサイズ
   * @param baseFontSize - rem計算用のベースフォントサイズ
   * @returns 文字間隔値（デフォルト: 0）
   */
  extractStyle(
    styles: Record<string, string>,
    fontSize?: number,
    baseFontSize: number = DEFAULT_BASE_FONT_SIZE,
  ): number {
    const value = styles["letter-spacing"];
    if (!value) {
      return 0;
    }

    const letterSpacing = this.parse(value, fontSize, baseFontSize);
    return letterSpacing !== null ? (letterSpacing as unknown as number) : 0;
  },

  /**
   * TextNodeConfigに文字間隔を適用して新しいconfigを返す（イミュータブル）
   * @param config - 元のconfig
   * @param styles - CSSスタイルオブジェクト
   * @returns 新しいconfig
   */
  applyToConfig(
    config: TextNodeConfig,
    styles: Record<string, string>,
  ): TextNodeConfig {
    const fontSize = config.style.fontSize;
    const letterSpacingValue = this.extractStyle(styles, fontSize);

    return {
      ...config,
      style: {
        ...config.style,
        letterSpacing: letterSpacingValue,
      },
    };
  },

  /**
   * FigmaのletterSpacing形式に変換
   * @param letterSpacing - 文字間隔値
   * @returns Figma形式の文字間隔オブジェクト
   */
  toFigmaLetterSpacing(letterSpacing: LetterSpacing): FigmaLetterSpacing {
    return {
      value: letterSpacing as unknown as number,
      unit: "PIXELS",
    };
  },
} as const;
