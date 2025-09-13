import type { Brand } from "../../../../../../types";
import { Styles } from "../../../../../models/styles";
import type { TextNodeConfig } from "../../../../../models/figma-node";

/**
 * テキストカラーのRGBA型
 */
export interface TextColorValue {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * テキストカラーのブランド型
 */
export type TextColor = Brand<TextColorValue, "TextColor">;

/**
 * TextColorのコンパニオンオブジェクト
 * テキストカラーの作成とパースを担当
 */
export const TextColor = {
  /**
   * TextColorを作成
   */
  create(value: TextColorValue): TextColor {
    return value as TextColor;
  },

  /**
   * colorをパース（Styles.parseColorを活用）
   * hex, rgb, rgba, 名前付きカラー等に対応
   */
  parse(color: string): TextColor | null {
    if (!color) {
      return null;
    }

    const parsedColor = Styles.parseColor(color);
    if (!parsedColor) {
      return null;
    }

    return TextColor.create({
      r: parsedColor.r,
      g: parsedColor.g,
      b: parsedColor.b,
      a: 1, // Styles.parseColorはalphaを返さないので、デフォルト1
    });
  },

  /**
   * デフォルトのテキストカラー（黒）
   */
  default(): TextColor {
    return TextColor.create({
      r: 0,
      g: 0,
      b: 0,
      a: 1,
    });
  },

  /**
   * Figmaのfills形式に変換
   */
  toFills(color: TextColor): Array<{ type: "SOLID"; color: TextColorValue }> {
    return [
      {
        type: "SOLID",
        color: color as TextColorValue,
      },
    ];
  },

  /**
   * 透明度を適用
   */
  withAlpha(color: TextColor, alpha: number): TextColor {
    const value = color as unknown as TextColorValue;
    return TextColor.create({
      ...value,
      a: Math.max(0, Math.min(1, alpha)),
    });
  },

  /**
   * スタイルから値を抽出（不変性を保つ）
   * @returns 適用されるfills配列（nullの場合は適用しない）
   */
  extractStyle(
    styles: Record<string, string>,
    defaultColor?: TextColorValue,
  ): Array<{ type: "SOLID"; color: TextColorValue }> | null {
    const value = styles["color"];
    const textColor = value
      ? this.parse(value)
      : defaultColor
        ? this.create(defaultColor)
        : null;

    return textColor ? this.toFills(textColor) : null;
  },

  /**
   * TextNodeConfigにテキストカラーを適用して新しいconfigを返す（イミュータブル）
   */
  applyToConfig(
    config: TextNodeConfig,
    styles: Record<string, string>,
    defaultColor?: TextColorValue,
  ): TextNodeConfig {
    const fills = this.extractStyle(styles, defaultColor);
    if (!fills) {
      return config;
    }
    return {
      ...config,
      style: {
        ...config.style,
        fills: fills,
      },
    };
  },

  /**
   * TextNodeConfigにテキストカラーを適用（互換性のため残す）
   * @deprecated applyToConfigを使用してください
   */
  applyTo(
    config: TextNodeConfig,
    styles: Record<string, string>,
    defaultColor?: TextColorValue,
  ): void {
    const fills = this.extractStyle(styles, defaultColor);
    if (fills) {
      config.style.fills = fills;
    }
  },
} as const;
