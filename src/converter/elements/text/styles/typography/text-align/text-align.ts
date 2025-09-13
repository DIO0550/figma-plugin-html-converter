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
export const TextAlign = {
  /**
   * デフォルトのテキスト配置
   */
  DEFAULT: "LEFT" as const,

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
    return TextAlign.create("LEFT");
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
    defaultAlign: TextAlignValue = "LEFT",
  ): string | null {
    const value = styles["text-align"];
    const textAlign = value
      ? this.parse(value)
      : defaultAlign !== "LEFT"
        ? this.create(defaultAlign)
        : null;

    return textAlign ? (textAlign as unknown as string) : null;
  },

  /**
   * TextNodeConfigにテキスト配置を適用して新しいconfigを返す（イミュータブル）
   */
  applyToConfig(
    config: TextNodeConfig,
    styles: Record<string, string>,
    defaultAlign: TextAlignValue = "LEFT",
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
    defaultAlign: TextAlignValue = "LEFT",
  ): void {
    const textAlign = this.extractStyle(styles, defaultAlign);
    if (textAlign) {
      config.style.textAlign = textAlign;
    }
  },
} as const;
