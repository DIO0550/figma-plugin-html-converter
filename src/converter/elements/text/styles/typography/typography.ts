import type { TextNodeConfig } from "../../../../models/figma-node";
import { FontSize } from "./font-size/font-size";
import { FontWeight } from "./font-weight/font-weight";
import { FontStyle } from "./font-style/font-style";
import { LineHeight } from "./line-height/line-height";
import { TextAlign } from "./text-align/text-align";
import { TextColor } from "./text-color/text-color";
import { FontFamily } from "./font-family/font-family";

/**
 * Typographyのコンパニオンオブジェクト
 * テキストノードへのスタイル適用を統合的に管理
 */
export const Typography = {
  /**
   * テキストノードにタイポグラフィスタイルを適用
   * 各モジュールが要素タグに応じたデフォルト値を提供
   */
  applyToTextNode(
    textConfig: TextNodeConfig,
    styles: Record<string, string>,
    elementTag?: string,
  ): TextNodeConfig {
    // 関数合成的なアプローチ: 各スタイルを順番に適用
    let config = textConfig;

    // フォントサイズを適用（各モジュールが要素タグからデフォルトを取得）
    config = FontSize.applyToConfig(
      config,
      styles,
      FontSize.getDefault(elementTag),
    );

    // 適用されたフォントサイズを取得（LineHeightで使用）
    const appliedFontSize = config.style.fontSize;

    // フォントウェイトを適用
    config = FontWeight.applyToConfig(
      config,
      styles,
      FontWeight.getDefault(elementTag),
    );

    // 行の高さを適用
    config = LineHeight.applyToConfig(
      config,
      styles,
      appliedFontSize,
      LineHeight.getDefaultMultiplier(elementTag),
    );

    // テキスト配置を適用（要素タグに関わらずデフォルトはLEFT）
    config = TextAlign.applyToConfig(config, styles, TextAlign.DEFAULT);

    // フォントスタイルを適用（italic等）
    config = FontStyle.applyToConfig(config, styles);

    // フォントファミリーを適用（存在時のみ）
    {
      const ffRaw = styles["font-family"];
      const ff = ffRaw ? FontFamily.parse(ffRaw) : null;
      if (ff) {
        config = {
          ...config,
          style: {
            ...config.style,
            fontFamily: (ff as unknown as string) || config.style.fontFamily,
          },
        };
      }
    }

    // テキストカラーを適用（要素タグに関わらずデフォルトなし）
    config = TextColor.applyToConfig(config, styles);

    return config;
  },
} as const;
