/**
 * @fileoverview progress/meter要素で共有するカラー定数
 *
 * HTML `<progress>` と `<meter>` 要素のFigma変換で使用する共通の色定義。
 * ブラウザのデフォルトスタイルに近い色を採用しています。
 */

/**
 * Figma RGB カラー型
 */
export interface FigmaRGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * トラック（背景）の色 - ライトグレー（#EBEBEB相当）
 *
 * progress/meter要素の共通背景色。
 */
export const PROGRESS_METER_TRACK_COLOR: FigmaRGBColor = {
  r: 0.92,
  g: 0.92,
  b: 0.92,
};

/**
 * progress要素のフィル（進捗部分）の色 - ブルー（#3399FF相当）
 */
export const PROGRESS_FILL_COLOR: FigmaRGBColor = {
  r: 0.2,
  g: 0.6,
  b: 1,
};

/**
 * meter要素の状態に応じた色定義
 *
 * ブラウザのデフォルトスタイルに近い色を採用:
 * - good: グリーン（#33B333相当）- 最適値に近い状態
 * - caution: イエロー/オレンジ（#F2C233相当）- 注意が必要な状態
 * - danger: レッド（#E64D4D相当）- 警告が必要な状態
 */
export const METER_STATUS_COLORS = {
  good: { r: 0.2, g: 0.7, b: 0.2 },
  caution: { r: 0.95, g: 0.76, b: 0.2 },
  danger: { r: 0.9, g: 0.3, b: 0.3 },
} as const;
