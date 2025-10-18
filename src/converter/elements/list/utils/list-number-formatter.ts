/**
 * @fileoverview リスト番号フォーマットのユーティリティ関数
 */

/**
 * 数字をアルファベットに変換
 * @param num - 変換する数字（1以上）
 * @returns アルファベット表記（例: 1→A, 2→B, 27→AA）
 */
export function toAlpha(num: number): string {
  let result = "";
  let n = num - 1;
  while (n >= 0) {
    result = String.fromCharCode(65 + (n % 26)) + result;
    n = Math.floor(n / 26) - 1;
  }
  return result;
}

/**
 * 数字をローマ数字に変換
 * @param num - 変換する数字（1以上）
 * @returns ローマ数字表記（例: 1→I, 5→V, 10→X）
 */
export function toRoman(num: number): string {
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const symbols = [
    "M",
    "CM",
    "D",
    "CD",
    "C",
    "XC",
    "L",
    "XL",
    "X",
    "IX",
    "V",
    "IV",
    "I",
  ];

  let result = "";
  let n = num;

  for (let i = 0; i < values.length; i++) {
    while (n >= values[i]) {
      result += symbols[i];
      n -= values[i];
    }
  }

  return result;
}
