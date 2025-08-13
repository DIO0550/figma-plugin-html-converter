/**
 * 色変換で使用される共通定数
 */
export const COLOR_CONVERSION = {
  /** RGB値の最大値 */
  RGB_MAX: 255,
  /** 色相の最大値（度） */
  HUE_MAX_DEGREES: 360,
  /** 彩度の最大値（パーセント） */
  SATURATION_MAX_PERCENT: 100,
  /** 明度の最大値（パーセント） */
  LIGHTNESS_MAX_PERCENT: 100,
  /** 16進数カラーコードの短縮形の長さ */
  HEX_SHORT_LENGTH: 3,
  /** 16進数カラーコードの標準形の長さ */
  HEX_FULL_LENGTH: 6,
  /** 16進数の基数 */
  HEX_RADIX: 16,
  /** 輝度計算の赤成分係数（ITU-R BT.709標準） */
  LUMINANCE_RED: 0.299,
  /** 輝度計算の緑成分係数（ITU-R BT.709標準） */
  LUMINANCE_GREEN: 0.587,
  /** 輝度計算の青成分係数（ITU-R BT.709標準） */
  LUMINANCE_BLUE: 0.114
} as const;

/**
 * 数値比較の定数
 */
export const NUMERIC_COMPARISON = {
  /** 浮動小数点比較の許容誤差 */
  EPSILON: 0.001,
  /** パーセンテージ計算の除数 */
  PERCENTAGE_DIVISOR: 100,
  /** 100パーセント */
  FULL_PERCENTAGE: 100,
  /** 50パーセント */
  HALF_PERCENTAGE: 50
} as const;