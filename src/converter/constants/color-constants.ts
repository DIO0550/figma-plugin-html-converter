/**
 * RGB色空間の定数
 */
export const RGB_CONSTANTS = {
  /** RGB各チャンネルの最大値 */
  MAX_VALUE: 255,
  /** RGB各チャンネルの最小値 */
  MIN_VALUE: 0
} as const;

/**
 * HSL色空間の定数
 */
export const HSL_CONSTANTS = {
  /** 色相の最大値（度） */
  HUE_MAX_DEGREES: 360,
  /** 彩度の最大値（パーセント） */
  SATURATION_MAX: 100,
  /** 明度の最大値（パーセント） */
  LIGHTNESS_MAX: 100
} as const;

/**
 * 16進数カラーコードの定数
 */
export const HEX_COLOR_CONSTANTS = {
  /** 短縮形の長さ（例：#FFF） */
  SHORT_LENGTH: 3,
  /** 標準形の長さ（例：#FFFFFF） */
  FULL_LENGTH: 6,
  /** 16進数の基数 */
  RADIX: 16
} as const;

/**
 * 輝度計算の係数（ITU-R BT.709標準）
 */
export const LUMINANCE_COEFFICIENTS = {
  /** 赤成分の係数 */
  RED: 0.299,
  /** 緑成分の係数 */
  GREEN: 0.587,
  /** 青成分の係数 */
  BLUE: 0.114
} as const;

// 後方互換性のため、COLOR_CONVERSIONもエクスポート（非推奨）
/** @deprecated 個別の定数（RGB_CONSTANTS, HSL_CONSTANTS等）を使用してください */
export const COLOR_CONVERSION = {
  RGB_MAX: RGB_CONSTANTS.MAX_VALUE,
  HUE_MAX_DEGREES: HSL_CONSTANTS.HUE_MAX_DEGREES,
  SATURATION_MAX_PERCENT: HSL_CONSTANTS.SATURATION_MAX,
  LIGHTNESS_MAX_PERCENT: HSL_CONSTANTS.LIGHTNESS_MAX,
  HEX_SHORT_LENGTH: HEX_COLOR_CONSTANTS.SHORT_LENGTH,
  HEX_FULL_LENGTH: HEX_COLOR_CONSTANTS.FULL_LENGTH,
  HEX_RADIX: HEX_COLOR_CONSTANTS.RADIX,
  LUMINANCE_RED: LUMINANCE_COEFFICIENTS.RED,
  LUMINANCE_GREEN: LUMINANCE_COEFFICIENTS.GREEN,
  LUMINANCE_BLUE: LUMINANCE_COEFFICIENTS.BLUE
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