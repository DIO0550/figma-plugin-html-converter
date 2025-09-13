import type { Brand } from "../../../../../../types";
import type { TextNodeConfig } from "../../../../../models/figma-node";

/**
 * 行の高さのブランド型
 */
export type LineHeight = Brand<number, "LineHeight">;

/**
 * デフォルトの行高倍率
 */
const DEFAULT_LINE_HEIGHT_MULTIPLIER = 1.5 as const;

/**
 * 要素タグごとのデフォルト行高倍率
 * 一般的なデザイン慣習に準拠
 */
const ELEMENT_LINE_HEIGHT_MULTIPLIERS = {
  h1: 1.2, // heading用のタイトな行高
  h2: 1.2, // heading用のタイトな行高
  h3: 1.2, // heading用のタイトな行高
  h4: 1.2, // heading用のタイトな行高
  h5: 1.2, // heading用のタイトな行高
  h6: 1.2, // heading用のタイトな行高
  p: 1.5, // 読みやすい本文用の行高
  span: 1.5, // 継承（デフォルト）
  div: 1.5, // 継承（デフォルト）
  a: 1.5, // 継承（デフォルト）
  strong: 1.5, // 継承（デフォルト）
  b: 1.5, // 継承（デフォルト）
  em: 1.5, // 継承（デフォルト）
  i: 1.5, // 継承（デフォルト）
} as const;

/**
 * LineHeightのコンパニオンオブジェクト
 * 行の高さの作成とパースを担当
 */
export const LineHeight = {
  /**
   * 要素タグからデフォルト行高倍率を取得
   */
  getDefaultMultiplier(elementTag?: string): number {
    if (!elementTag) {
      return DEFAULT_LINE_HEIGHT_MULTIPLIER;
    }
    return (
      ELEMENT_LINE_HEIGHT_MULTIPLIERS[
        elementTag as keyof typeof ELEMENT_LINE_HEIGHT_MULTIPLIERS
      ] ?? DEFAULT_LINE_HEIGHT_MULTIPLIER
    );
  },

  /**
   * LineHeightを作成
   */
  create(value: number): LineHeight {
    return value as LineHeight;
  },

  /**
   * line-heightをパース
   * 数値のみ（倍率）、px単位、normal等に対応
   */
  parse(lineHeight: string, fontSize: number): LineHeight | null {
    if (!lineHeight) {
      return null;
    }

    const trimmed = lineHeight.trim();

    // "normal"の場合は1.2倍
    if (trimmed === "normal") {
      return LineHeight.create(fontSize * 1.2);
    }

    // 数値のみの場合は倍率として扱う
    const numericValue = parseFloat(trimmed);
    if (!isNaN(numericValue) && /^\d+(\.\d+)?$/.test(trimmed)) {
      return LineHeight.create(fontSize * numericValue);
    }

    // px単位の場合
    if (trimmed.endsWith("px")) {
      const pxValue = parseFloat(trimmed.slice(0, -2));
      if (!isNaN(pxValue) && pxValue > 0) {
        return LineHeight.create(pxValue);
      }
    }

    // em単位の場合
    if (trimmed.endsWith("em")) {
      const emValue = parseFloat(trimmed.slice(0, -2));
      if (!isNaN(emValue) && emValue > 0) {
        return LineHeight.create(fontSize * emValue);
      }
    }

    // %単位の場合
    if (trimmed.endsWith("%")) {
      const percentValue = parseFloat(trimmed.slice(0, -1));
      if (!isNaN(percentValue) && percentValue > 0) {
        return LineHeight.create(fontSize * (percentValue / 100));
      }
    }

    return null;
  },

  /**
   * デフォルトの行の高さを計算
   */
  calculateDefault(fontSize: number, multiplier: number = 1.5): LineHeight {
    return LineHeight.create(fontSize * multiplier);
  },

  /**
   * スタイルから値を抽出（不変性を保つ）
   * @returns 適用される行の高さ値
   */
  extractStyle(
    styles: Record<string, string>,
    fontSize: number,
    defaultMultiplier: number = 1.5,
  ): number {
    const value = styles["line-height"];
    const lineHeight = value
      ? this.parse(value, fontSize)
      : this.calculateDefault(fontSize, defaultMultiplier);

    return lineHeight !== null
      ? (lineHeight as unknown as number)
      : fontSize * defaultMultiplier;
  },

  /**
   * TextNodeConfigに行の高さを適用して新しいconfigを返す（イミュータブル）
   */
  applyToConfig(
    config: TextNodeConfig,
    styles: Record<string, string>,
    fontSize: number,
    defaultMultiplier: number = 1.5,
  ): TextNodeConfig {
    const lineHeightValue = this.extractStyle(
      styles,
      fontSize,
      defaultMultiplier,
    );
    return {
      ...config,
      style: {
        ...config.style,
        lineHeight: {
          unit: "PIXELS" as const,
          value: lineHeightValue,
        },
      },
    };
  },

  /**
   * TextNodeConfigに行の高さを適用（互換性のため残す）
   * @deprecated applyToConfigを使用してください
   */
  applyTo(
    config: TextNodeConfig,
    styles: Record<string, string>,
    fontSize: number,
    defaultMultiplier: number = 1.5,
  ): void {
    const lineHeightValue = this.extractStyle(
      styles,
      fontSize,
      defaultMultiplier,
    );
    config.style.lineHeight.value = lineHeightValue;
  },
} as const;
