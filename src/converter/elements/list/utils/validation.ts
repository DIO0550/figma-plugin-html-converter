/**
 * @fileoverview バリデーションユーティリティ関数
 */

/**
 * パディング値が有効かどうかを判定
 * @param value - 検証する値
 * @returns 有効なパディング値（0以上の有限数）の場合true
 */
export function isValidPadding(value: unknown): value is number {
  return typeof value === "number" && isFinite(value) && value >= 0;
}
