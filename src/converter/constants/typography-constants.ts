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
