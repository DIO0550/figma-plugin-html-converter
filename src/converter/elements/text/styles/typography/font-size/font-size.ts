import type { Brand } from "../../../../../../types";
import { Styles } from "../../../../../models/styles";
import type { TextNodeConfig } from "../../../../../models/figma-node";

/**
 * フォントサイズのブランド型
 */
export type FontSize = Brand<number, "FontSize">;

/**
 * デフォルトのフォントサイズ
 */
const DEFAULT_FONT_SIZE = 16 as const;

/**
 * 要素タグごとのデフォルトフォントサイズ
 * ブラウザのデフォルトスタイルに準拠
 */
const ELEMENT_FONT_SIZES = {
  h1: 32, // 2em
  h2: 24, // 1.5em
  h3: 19, // 1.17em (約18.72px)
  h4: 16, // 1em
  h5: 13, // 0.83em (約13.28px)
  h6: 11, // 0.67em (約10.72px)
  p: 16, // 1em
  span: 16, // 継承（デフォルト）
  div: 16, // 継承（デフォルト）
  a: 16, // 継承（デフォルト）
  strong: 16, // 継承（デフォルト）
  em: 16, // 継承（デフォルト）
} as const;

/**
 * FontSizeのコンパニオンオブジェクト
 * フォントサイズの作成とパースを担当
 */
export const FontSize = {
  /**
   * 要素タグからデフォルトフォントサイズを取得
   */
  getDefault(elementTag?: string): number {
    if (!elementTag) {
      return DEFAULT_FONT_SIZE;
    }
    return (
      ELEMENT_FONT_SIZES[elementTag as keyof typeof ELEMENT_FONT_SIZES] ??
      DEFAULT_FONT_SIZE
    );
  },

  /**
   * FontSizeを作成
   */
  create(value: number): FontSize {
    return value as FontSize;
  },

  /**
   * font-sizeをパース（Styles.parseSizeを活用）
   * px, em, rem等に対応
   */
  parse(fontSize: string): FontSize | null {
    if (!fontSize) {
      return null;
    }

    const size = Styles.parseSize(fontSize);

    // Styles.parseSizeはSizeValue | numberを返すので、数値のみ返す
    if (typeof size === "number") {
      return FontSize.create(size);
    }

    // パーセント等の非数値はテキストサイズとしては非対応
    return null;
  },

  /**
   * スタイルから値を抽出（不変性を保つ）
   * @returns 適用が必要なフォントサイズ値。変更不要の場合はundefined。
   */
  extractStyle(
    styles: Record<string, string>,
    defaultSize: number = DEFAULT_FONT_SIZE,
  ): number | undefined {
    const value = styles["font-size"];

    if (value) {
      const fontSize = this.parse(value);
      if (fontSize !== null) {
        return fontSize as unknown as number;
      }

      // パースできない場合はフォールバックを適用
      return defaultSize;
    }

    // デフォルト値が標準と異なる場合のみ適用
    if (defaultSize !== DEFAULT_FONT_SIZE) {
      return defaultSize;
    }

    return undefined;
  },

  /**
   * TextNodeConfigにフォントサイズを適用して新しいconfigを返す（イミュータブル）
   */
  applyToConfig(
    config: TextNodeConfig,
    styles: Record<string, string>,
    defaultSize: number = DEFAULT_FONT_SIZE,
  ): TextNodeConfig {
    const sizeValue = this.extractStyle(styles, defaultSize);
    if (sizeValue === undefined) {
      return config;
    }

    return {
      ...config,
      style: {
        ...config.style,
        fontSize: sizeValue,
      },
    };
  },

  /**
   * TextNodeConfigにフォントサイズを適用（互換性のため残す）
   * @deprecated applyToConfigを使用してください
   */
  applyTo(
    config: TextNodeConfig,
    styles: Record<string, string>,
    defaultSize: number = DEFAULT_FONT_SIZE,
  ): number | undefined {
    const sizeValue = this.extractStyle(styles, defaultSize);
    if (sizeValue === undefined) {
      return undefined;
    }

    config.style.fontSize = sizeValue;
    return sizeValue;
  },
} as const;
