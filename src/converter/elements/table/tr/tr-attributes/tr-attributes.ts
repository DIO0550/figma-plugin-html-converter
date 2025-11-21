/**
 * @fileoverview tr要素の属性定義
 */

import type { GlobalAttributes } from "../../../base";

/**
 * tr要素の属性インターフェース
 *
 * tr要素はテーブルの行を表します。
 * GlobalAttributesを拡張し、width/height属性を追加しています。
 *
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/tr
 */
export interface TrAttributes extends GlobalAttributes {
  /**
   * 行の幅
   *
   * ピクセル値または相対値を指定できます。
   * 例: "100px", "50%"
   */
  width?: string;

  /**
   * 行の高さ
   *
   * ピクセル値または相対値を指定できます。
   * 例: "50px", "auto"
   */
  height?: string;
}
