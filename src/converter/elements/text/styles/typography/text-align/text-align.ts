import type { Brand } from "../../../../../../types";
import type { TextNodeConfig } from "../../../../../models/figma-node";

/**
 * テキスト配置の型
 */
export type TextAlignValue = "LEFT" | "CENTER" | "RIGHT" | "JUSTIFY";

/**
 * テキスト配置のブランド型
 */
export type TextAlign = Brand<TextAlignValue, "TextAlign">;

/**
 * TextAlignのコンパニオンオブジェクト
 * テキスト配置の作成とパースを担当
 */
const DEFAULT_ALIGN: TextAlignValue = "LEFT";

export const TextAlign = {
  /**
   * デフォルトのテキスト配置
   */
  DEFAULT: DEFAULT_ALIGN,

  /**
   * TextAlignを作成
   */
  create(value: TextAlignValue): TextAlign {
    return value as TextAlign;
  },

  /**
   * text-alignをパース
   * left, center, right, justify等に対応
   */
  parse(textAlign: string): TextAlign | null {
    if (!textAlign) {
      return null;
    }

    const trimmed = textAlign.trim().toUpperCase();

    // 有効な値のマッピング
    const validAlignments: Record<string, TextAlignValue> = {
      LEFT: "LEFT",
      CENTER: "CENTER",
      RIGHT: "RIGHT",
      JUSTIFY: "JUSTIFY",
      // CSSの追加値をマッピング
      START: "LEFT", // LTRの場合のデフォルト
      END: "RIGHT", // LTRの場合のデフォルト
    };

    const alignment = validAlignments[trimmed];
    if (alignment) {
      return TextAlign.create(alignment);
    }

    return null;
  },

  /**
   * デフォルトのテキスト配置
   */
  default(): TextAlign {
    return TextAlign.create(DEFAULT_ALIGN);
  },

  /**
   * 中央揃えかどうかを判定
   */
  isCenter(align: TextAlign): boolean {
    return align === "CENTER";
  },

  /**
   * 右揃えかどうかを判定
   */
  isRight(align: TextAlign): boolean {
    return align === "RIGHT";
  },

  /**
   * 両端揃えかどうかを判定
   */
  isJustify(align: TextAlign): boolean {
    return align === "JUSTIFY";
  },

  /**
   * スタイルから値を抽出（不変性を保つ）
   * @returns 適用されるテキスト配置値（nullの場合は適用しない）
   */
  extractStyle(
    styles: Record<string, string>,
    defaultAlign: TextAlignValue = DEFAULT_ALIGN,
  ): string | null {
    const value = styles["text-align"];

    // 明示的な値があれば解析
    if (value) {
      const parsed = this.parse(value);
      return parsed ? (parsed as unknown as string) : null;
    }

    // デフォルトがLEFT以外で指定されていれば適用
    if (defaultAlign !== DEFAULT_ALIGN) {
      return this.create(defaultAlign) as unknown as string;
    }

    return null;
  },

  /**
   * TextNodeConfigにテキスト配置を適用して新しいconfigを返す（イミュータブル）
   */
  applyToConfig(
    config: TextNodeConfig,
    styles: Record<string, string>,
    defaultAlign: TextAlignValue = DEFAULT_ALIGN,
  ): TextNodeConfig {
    const textAlign = this.extractStyle(styles, defaultAlign);
    if (!textAlign) {
      return config;
    }
    return {
      ...config,
      style: {
        ...config.style,
        textAlign: textAlign,
      },
    };
  },

  /**
   * TextNodeConfigにテキスト配置を適用（互換性のため残す）
   * @deprecated applyToConfigを使用してください
   */
  applyTo(
    config: TextNodeConfig,
    styles: Record<string, string>,
    defaultAlign: TextAlignValue = DEFAULT_ALIGN,
  ): void {
    const textAlign = this.extractStyle(styles, defaultAlign);
    if (textAlign) {
      config.style.textAlign = textAlign;
    }
  },
} as const;
