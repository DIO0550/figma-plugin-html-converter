/**
 * Typography関連の定数
 * テキストスタイルに使用される定数値を定義
 */

/**
 * 等幅フォント（monospace）の設定
 * kbd, samp, code要素などで使用
 */
export const MONOSPACE_FONT_CONFIG = {
  /** 等幅フォントのフォントサイズ（ピクセル） */
  fontSize: 14,
  /** 等幅フォントの行の高さ（ピクセル） - fontSize * 1.5 */
  lineHeight: 21,
  /** 等幅フォントのフォントファミリー */
  fontFamily: "monospace",
} as const;

/**
 * 標準テキストの設定
 * 一般的なテキスト要素で使用
 */
export const DEFAULT_TEXT_CONFIG = {
  /** 標準フォントサイズ（ピクセル） */
  fontSize: 16,
  /** 標準行の高さ（ピクセル） - fontSize * 1.5 */
  lineHeight: 24,
  /** 標準フォントファミリー */
  fontFamily: "Inter",
} as const;
