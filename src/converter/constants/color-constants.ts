/**
 * RGB色空間の範囲
 */
export const RGB_RANGE = {
  /** RGB各チャンネルの最大値 */
  MAX_VALUE: 255,
  /** RGB各チャンネルの最小値 */
  MIN_VALUE: 0
} as const;

/**
 * HSL色空間の制限値
 */
export const HSL_LIMITS = {
  /** 色相の最大値（度） */
  HUE_MAX_DEGREES: 360,
  /** 彩度の最大値（パーセント） */
  SATURATION_MAX: 100,
  /** 明度の最大値（パーセント） */
  LIGHTNESS_MAX: 100
} as const;

/**
 * 16進数カラーコードのフォーマット
 */
export const HEX_FORMAT = {
  /** 短縮形の長さ（例：#FFF） */
  SHORT_LENGTH: 3,
  /** 標準形の長さ（例：#FFFFFF） */
  FULL_LENGTH: 6,
  /** 16進数の基数 */
  RADIX: 16
} as const;

/**
 * 輝度計算の重み（ITU-R BT.709標準）
 */
export const LUMINANCE_WEIGHTS = {
  /** 赤成分の重み */
  RED: 0.299,
  /** 緑成分の重み */
  GREEN: 0.587,
  /** 青成分の重み */
  BLUE: 0.114
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