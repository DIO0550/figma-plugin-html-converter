import type { TextStyle } from "../../../models/figma-node";
import { FontFamily } from "../styles/typography/font-family/font-family";
import { FontSize } from "../styles/typography/font-size/font-size";
import { FontWeight } from "../styles/typography/font-weight/font-weight";
import { FontStyle } from "../styles/typography/font-style/font-style";
import { TextColor } from "../styles/typography/text-color/text-color";
import { TextDecoration } from "../styles/decoration/text-decoration/text-decoration";

/**
 * テキストスタイルを適用する共通ユーティリティ関数
 *
 * CSSスタイルをFigmaのTextStyleプロパティにマッピングします。
 * 以下のスタイルプロパティをサポート：
 * - font-size: フォントサイズ
 * - font-weight: フォントの太さ
 * - font-style: イタリック体など
 * - font-family: フォントファミリー
 * - color: テキストカラー
 * - text-decoration: テキスト装飾（下線、取り消し線など）
 *
 * @param textStyle - ベースとなるTextStyle
 * @param styles - 適用するCSSスタイル（Record<string, string>形式）
 * @returns 更新されたTextStyle
 *
 * @example
 * ```typescript
 * const baseStyle: TextStyle = {
 *   fontFamily: "Inter",
 *   fontSize: 16,
 *   fontWeight: 400,
 *   // ... その他のプロパティ
 * };
 *
 * const styles = {
 *   "font-size": "18px",
 *   "color": "rgb(255, 0, 0)",
 *   "text-decoration": "underline"
 * };
 *
 * const updatedStyle = applyTextStyles(baseStyle, styles);
 * // updatedStyle.fontSize === 18
 * // updatedStyle.fills[0].color === { r: 1, g: 0, b: 0, a: 1 }
 * // updatedStyle.textDecoration === "UNDERLINE"
 * ```
 */
export function applyTextStyles(
  textStyle: TextStyle,
  styles: Record<string, string>,
): TextStyle {
  const updatedStyle = { ...textStyle };

  // フォントサイズの処理
  const fontSize = FontSize.extractStyle(styles);
  if (fontSize !== undefined) {
    updatedStyle.fontSize = fontSize;
  }

  // フォントウェイトの処理
  const fontWeight = FontWeight.extractStyle(styles);
  if (fontWeight !== undefined) {
    updatedStyle.fontWeight = fontWeight;
  }

  // フォントスタイルの処理
  const fontStyleValue = styles["font-style"];
  if (fontStyleValue) {
    const fontStyle = FontStyle.parse(fontStyleValue);
    if (fontStyle) {
      updatedStyle.fontStyle = FontStyle.toFigmaStyle(fontStyle);
    }
  }

  // フォントファミリーの処理
  const fontFamily = styles["font-family"];
  if (fontFamily) {
    const family = FontFamily.parse(fontFamily);
    if (family) {
      updatedStyle.fontFamily = family;
    }
  }

  // カラーの処理
  const color = styles["color"];
  if (color) {
    const textColor = TextColor.parse(color);
    if (textColor) {
      updatedStyle.fills = TextColor.toFills(textColor);
    }
  }

  // テキスト装飾の処理
  const textDecorationValue = styles["text-decoration"];
  if (textDecorationValue) {
    if (textDecorationValue === "none") {
      updatedStyle.textDecoration = undefined;
    } else {
      const textDecoration = TextDecoration.parse(textDecorationValue);
      if (textDecoration !== undefined) {
        updatedStyle.textDecoration = textDecoration;
      }
    }
  }

  return updatedStyle;
}
