import type { TextNodeConfig } from "../../../../models/figma-node";
import { FontSize } from "./font-size/font-size";
import { FontWeight } from "./font-weight/font-weight";
import { FontStyle } from "./font-style/font-style";
import { LineHeight } from "./line-height/line-height";
import { TextAlign } from "./text-align/text-align";
import { TextColor } from "./text-color/text-color";
import { FontFamily } from "./font-family/font-family";
import { TextDecoration } from "../decoration/text-decoration/text-decoration";

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
    // 段階的に不変データで適用していく
    const withFontSize = FontSize.applyToConfig(
      textConfig,
      styles,
      FontSize.getDefault(elementTag),
    );

    // LineHeightのために適用後のfontSizeを参照
    const appliedFontSize = withFontSize.style.fontSize;

    const withFontWeight = FontWeight.applyToConfig(
      withFontSize,
      styles,
      FontWeight.getDefault(elementTag),
    );

    const withLineHeight = LineHeight.applyToConfig(
      withFontWeight,
      styles,
      appliedFontSize,
      LineHeight.getDefaultMultiplier(elementTag),
    );

    const withTextAlign = TextAlign.applyToConfig(
      withLineHeight,
      styles,
      TextAlign.DEFAULT,
    );

    const withFontStyle = FontStyle.applyToConfig(withTextAlign, styles);

    // フォントファミリーを適用（存在時のみ）
    const ffRaw = styles["font-family"];
    const ff = ffRaw ? FontFamily.parse(ffRaw) : null;
    const withFontFamily = ff
      ? {
          ...withFontStyle,
          style: {
            ...withFontStyle.style,
            fontFamily: FontFamily.unwrap(ff),
          },
        }
      : withFontStyle;

    // テキストカラーを適用（要素タグに関わらずデフォルトなし）
    const withTextColor = TextColor.applyToConfig(withFontFamily, styles);

    // テキスト装飾を適用（存在時のみ）
    const decoration = TextDecoration.extractStyle(styles);
    const finalConfig = TextDecoration.applyToConfig(withTextColor, decoration);

    return finalConfig;
  },
} as const;
