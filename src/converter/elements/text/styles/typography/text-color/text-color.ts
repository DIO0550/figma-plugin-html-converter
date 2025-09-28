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
   * colorをパース（rgba形式のalpha値もサポート）
   * hex, rgb, rgba, 名前付きカラー等に対応
   */
  parse(color: string): TextColor | null {
    if (!color) {
      return null;
    }

    // transparentの特別処理
    if (color.toLowerCase() === "transparent") {
      return TextColor.create({
        r: 0,
        g: 0,
        b: 0,
        a: 0,
      });
    }

    // rgba形式の処理
    const rgbaMatch = color.match(
      /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/i,
    );
    if (rgbaMatch) {
      return TextColor.create({
        r: Math.min(255, Math.max(0, parseInt(rgbaMatch[1], 10))) / 255,
        g: Math.min(255, Math.max(0, parseInt(rgbaMatch[2], 10))) / 255,
        b: Math.min(255, Math.max(0, parseInt(rgbaMatch[3], 10))) / 255,
        a: Math.min(1, Math.max(0, parseFloat(rgbaMatch[4]))),
      });
    }

    // その他の形式はStyles.parseColorに委譲
    const parsedColor = Styles.parseColor(color);
    if (!parsedColor) {
      return null;
    }

    return TextColor.create({
      r: parsedColor.r,
      g: parsedColor.g,
      b: parsedColor.b,
      a: 1, // rgb, hex, 名前付きカラーはデフォルトでalpha=1
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

    // 明示的な値があれば解析
    if (value) {
      const parsed = this.parse(value);
      return parsed ? this.toFills(parsed) : null;
    }

    // デフォルト色が与えられていれば使用
    if (defaultColor) {
      return this.toFills(this.create(defaultColor));
    }

    // いずれも無ければ適用なし
    return null;
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
