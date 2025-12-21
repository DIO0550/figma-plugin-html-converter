/**
 * @fileoverview 数値処理の共通ヘルパー関数
 */

/**
 * 値を指定範囲にクランプする
 *
 * @param value - クランプする値
 * @param min - 最小値
 * @param max - 最大値
 * @returns min以上max以下にクランプされた値
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * 数値属性をパースするヘルパー（フォールバック付き）
 *
 * @param value - パースする値
 * @param fallback - パース失敗時のフォールバック値
 * @returns パースされた数値またはフォールバック値
 */
export function parseNumericWithFallback(
  value: unknown,
  fallback: number,
): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

/**
 * 数値属性をパースするヘルパー（null許容）
 *
 * @param value - パースする値
 * @returns パースされた数値またはnull
 */
export function parseNumericOrNull(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}
