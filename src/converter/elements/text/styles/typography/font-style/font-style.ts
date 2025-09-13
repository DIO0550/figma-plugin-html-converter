import type { Brand } from "../../../../../../types";
import type { TextNodeConfig } from "../../../../../models/figma-node";

/**
 * フォントスタイルのブランド型
 */
export type FontStyle = Brand<"normal" | "italic", "FontStyle">;

/**
 * FontStyleのコンパニオンオブジェクト
 * フォントスタイルの作成とパースを担当
 */
export const FontStyle = {
  /**
   * FontStyleを作成
   */
  create(value: "normal" | "italic"): FontStyle {
    return value as FontStyle;
  },

  /**
   * font-styleをパース
   */
  parse(fontStyle: string): FontStyle | null {
    if (!fontStyle) {
      return null;
    }

    const style = fontStyle.toLowerCase().trim();

    // obliqueの角度指定パターンをチェック
    const obliqueAnglePattern =
      /^oblique\s+(-?\d+(\.\d+)?(deg|rad|grad|turn)?)?$/;

    if (style === "italic") {
      return FontStyle.create("italic");
    }
    if (style === "oblique" || obliqueAnglePattern.test(style)) {
      return FontStyle.create("italic");
    }
    if (style === "normal") {
      return FontStyle.create("normal");
    }

    return null;
  },

  /**
   * イタリック体かどうかを判定
   */
  isItalic(style: FontStyle): boolean {
    return style === "italic";
  },

  /**
   * TextNodeConfigにフォントスタイルを適用して新しいconfigを返す（イミュータブル）
   */
  applyToConfig(
    config: TextNodeConfig,
    styles: Record<string, string>,
  ): TextNodeConfig {
    const value = styles["font-style"];
    if (!value) {
      return config;
    }

    const fontStyle = this.parse(value);
    if (!fontStyle || fontStyle === "normal") {
      return config;
    }

    return {
      ...config,
      style: {
        ...config.style,
        fontStyle: fontStyle === "italic" ? "ITALIC" : undefined,
      },
    };
  },
} as const;
