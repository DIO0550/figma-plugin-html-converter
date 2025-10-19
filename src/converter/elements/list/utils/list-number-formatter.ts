/**
 * @fileoverview リスト番号フォーマットのユーティリティ関数
 */

// アルファベット変換用の定数
const UPPERCASE_A_CHARCODE = 65; // 大文字Aの開始位置
const ALPHABET_SIZE = 26; // アルファベットの文字数

/**
 * 数字をアルファベットに変換
 * @param num - 変換する数字（1以上）
 * @param lowercase - 小文字で返すかどうか（デフォルト: false）
 * @returns アルファベット表記（例: 1→A, 2→B, 27→AA）
 */
export function toAlpha(num: number, lowercase = false): string {
  let result = "";
  let n = num - 1;
  while (n >= 0) {
    result =
      String.fromCharCode(UPPERCASE_A_CHARCODE + (n % ALPHABET_SIZE)) + result;
    n = Math.floor(n / ALPHABET_SIZE) - 1;
  }
  return lowercase ? result.toLowerCase() : result;
}

/**
 * ローマ数字変換用の定数
 */
const ROMAN_NUMERAL_VALUES = [
  1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1,
];
const ROMAN_NUMERAL_SYMBOLS = [
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

/**
 * 数字をローマ数字に変換
 * @param num - 変換する数字（1以上）
 * @param lowercase - 小文字で返すかどうか（デフォルト: false）
 * @returns ローマ数字表記（例: 1→I, 5→V, 10→X）
 */
export function toRoman(num: number, lowercase = false): string {
  let result = "";
  let n = num;

  for (let i = 0; i < ROMAN_NUMERAL_VALUES.length; i++) {
    while (n >= ROMAN_NUMERAL_VALUES[i]) {
      result += ROMAN_NUMERAL_SYMBOLS[i];
      n -= ROMAN_NUMERAL_VALUES[i];
    }
  }

  return lowercase ? result.toLowerCase() : result;
}
