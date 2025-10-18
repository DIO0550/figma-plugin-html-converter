/**
 * @fileoverview OL要素の属性定義
 */

import { GlobalAttributes } from "../../../base";

/**
 * OL要素の属性インターフェース
 * 順序付きリストの属性を定義
 */
export interface OlAttributes extends GlobalAttributes {
  /**
   * リストの開始番号
   */
  start?: string;

  /**
   * リストの番号を逆順にするかどうか
   */
  reversed?: string;

  /**
   * リストマーカーのタイプ
   * - 1: 数字 (1, 2, 3, ...)
   * - a: 小文字英字 (a, b, c, ...)
   * - A: 大文字英字 (A, B, C, ...)
   * - i: 小文字ローマ数字 (i, ii, iii, ...)
   * - I: 大文字ローマ数字 (I, II, III, ...)
   */
  type?: "1" | "a" | "A" | "i" | "I";
}
