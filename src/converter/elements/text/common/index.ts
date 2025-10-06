/**
 * テキストスタイル関連の共通エクスポート
 *
 * このモジュールは、テキスト要素のスタイリングに関連する全てのコンパニオンオブジェクトを
 * 一元的にエクスポートします。Typography、Spacing、Decoration、Layoutの各カテゴリに
 * 分類されたコンポーネントを提供します。
 *
 * @example
 * ```typescript
 * import { FontSize, TextColor, Typography } from './common';
 *
 * // 個別のコンポーネントを使用
 * const fontSize = FontSize.parse("16px");
 * const textColor = TextColor.parse("#FF0000");
 *
 * // Typography統合オブジェクトを使用
 * const config = Typography.applyToTextNode(baseConfig, styles, "p");
 * ```
 *
 * @module common
 * @category Text Styles
 */

/**
 * Typography関連コンポーネント
 *
 * フォントファミリー、サイズ、ウェイト、スタイル、行の高さ、配置、色などの
 * テキストのタイポグラフィに関する全てのコンポーネント。
 */
export {
  /** フォントファミリーの処理 */
  FontFamily,
  /** フォントサイズの処理 */
  FontSize,
  /** フォントウェイトの処理 */
  FontWeight,
  /** フォントスタイル（italic等）の処理 */
  FontStyle,
  /** 行の高さの処理 */
  LineHeight,
  /** テキスト配置の処理 */
  TextAlign,
  /** テキスト色の処理 */
  TextColor,
  /** Typography統合オブジェクト - 全てのテキストスタイルを適用 */
  Typography,
} from "../styles/typography";

/**
 * Spacing関連コンポーネント
 *
 * 文字間隔などのスペーシングに関するコンポーネント。
 */
export {
  /** 文字間隔の処理 */
  LetterSpacing,
} from "../styles/spacing";

/**
 * Decoration関連コンポーネント
 *
 * テキストの装飾（下線、大文字小文字変換等）に関するコンポーネント。
 */
export {
  /** テキスト装飾（underline等）の処理 */
  TextDecoration,
} from "../styles/decoration/text-decoration/text-decoration";
export {
  /** テキスト変換（uppercase等）の処理 */
  TextTransform,
} from "../styles/decoration/text-transform/text-transform";

/**
 * Layout関連コンポーネント
 *
 * テキストのレイアウト（垂直配置、テキスト方向等）に関するコンポーネント。
 */
export {
  /** 垂直方向の配置の処理 */
  VerticalAlign,
} from "../layout/vertical-align/vertical-align";
export {
  /** テキスト方向（ltr/rtl）の処理 */
  TextDirection,
} from "../layout/text-direction/text-direction";
