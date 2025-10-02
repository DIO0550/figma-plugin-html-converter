import type { Brand } from "../../../../../../types";
import type { TextNodeConfig } from "../../../../../models/figma-node";

/**
 * フォントウェイトのブランド型
 */
export type FontWeight = Brand<number, "FontWeight">;

/**
 * デフォルトのフォントウェイト
 */
const DEFAULT_FONT_WEIGHT = 400 as const;

/**
 * 要素タグごとのデフォルトフォントウェイト
 * ブラウザのデフォルトスタイルに準拠
 */
const ELEMENT_FONT_WEIGHTS = {
  h1: 700, // bold
  h2: 700, // bold
  h3: 700, // bold
  h4: 700, // bold
  h5: 700, // bold
  h6: 700, // bold
  p: 400, // normal
  span: 400, // normal
  div: 400, // normal
  a: 400, // normal
  strong: 700, // bold
  b: 700, // bold
  em: 400, // normal (italic)
  i: 400, // normal (italic)
} as const;

/**
 * FontWeightのコンパニオンオブジェクト
 * フォントウェイトの作成とパースを担当
 */
export const FontWeight = {
  /**
   * 要素タグからデフォルトフォントウェイトを取得
   */
  getDefault(elementTag?: string): number {
    if (!elementTag) {
      return DEFAULT_FONT_WEIGHT;
    }
    return (
      ELEMENT_FONT_WEIGHTS[elementTag as keyof typeof ELEMENT_FONT_WEIGHTS] ??
      DEFAULT_FONT_WEIGHT
    );
  },

  /**
   * FontWeightを作成
   */
  create(value: number): FontWeight {
    return value as FontWeight;
  },

  /**
   * font-weightをパース
   * "normal" → 400, "bold" → 700, "600" → 600
   */
  parse(fontWeight: string): FontWeight | null {
    if (!fontWeight) {
      return null;
    }

    // 前後の空白を除去
    const trimmed = fontWeight.trim();

    // 名前付きウェイトのマッピング
    const namedWeights: Record<string, number> = {
      thin: 100,
      hairline: 100,
      "extra-light": 200,
      "ultra-light": 200,
      light: 300,
      normal: 400,
      regular: 400,
      medium: 500,
      "semi-bold": 600,
      "demi-bold": 600,
      bold: 700,
      "extra-bold": 800,
      "ultra-bold": 800,
      black: 900,
      heavy: 900,
      lighter: 300,
      bolder: 700,
    };

    // 小文字に変換して検索
    const weight = namedWeights[trimmed.toLowerCase()];
    if (weight !== undefined) {
      return FontWeight.create(weight);
    }

    // 数値のみの文字列かチェック（単位が付いている場合は無効）
    if (!/^\d+(\.\d+)?$/.test(trimmed)) {
      return null;
    }

    // 数値ウェイトとして解析（小数も許可）
    const numericWeight = parseFloat(trimmed);
    if (!isNaN(numericWeight) && numericWeight >= 100 && numericWeight <= 900) {
      return FontWeight.create(numericWeight);
    }

    return null;
  },

  /**
   * 太字かどうかを判定
   */
  isBold(weight: FontWeight): boolean {
    return weight >= 700;
  },

  /**
   * 通常の太さかどうかを判定
   */
  isNormal(weight: FontWeight): boolean {
    return weight === 400;
  },

  /**
   * スタイルから値を抽出（不変性を保つ）
   * @returns 適用が必要なフォントウェイト値。変更不要の場合はundefined。
   */
  extractStyle(
    styles: Record<string, string>,
    defaultWeight: number = DEFAULT_FONT_WEIGHT,
  ): number | undefined {
    const value = styles["font-weight"];

    // 明示的な値があれば解析
    if (value) {
      const parsed = this.parse(value);
      return parsed ? (parsed as unknown as number) : undefined;
    }

    // デフォルトが通常値以外で指定されていれば適用
    if (defaultWeight !== DEFAULT_FONT_WEIGHT) {
      return this.create(defaultWeight) as unknown as number;
    }

    return undefined;
  },

  /**
   * TextNodeConfigにフォントウェイトを適用して新しいconfigを返す（イミュータブル）
   */
  applyToConfig(
    config: TextNodeConfig,
    styles: Record<string, string>,
    defaultWeight: number = DEFAULT_FONT_WEIGHT,
  ): TextNodeConfig {
    const fontWeight = this.extractStyle(styles, defaultWeight);
    if (fontWeight === undefined) {
      return config;
    }
    return {
      ...config,
      style: {
        ...config.style,
        fontWeight: fontWeight,
      },
    };
  },

  /**
   * TextNodeConfigにフォントウェイトを適用（互換性のため残す）
   * @deprecated applyToConfigを使用してください
   */
  applyTo(
    config: TextNodeConfig,
    styles: Record<string, string>,
    defaultWeight: number = DEFAULT_FONT_WEIGHT,
  ): void {
    const fontWeight = this.extractStyle(styles, defaultWeight);
    if (fontWeight !== undefined) {
      config.style.fontWeight = fontWeight;
    }
  },
} as const;
