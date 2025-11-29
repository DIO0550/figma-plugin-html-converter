/**
 * @fileoverview td要素の属性定義
 */

import type { GlobalAttributes } from "../../../base";

/**
 * td要素の属性インターフェース
 *
 * td要素はテーブルのデータセルを表します。
 * GlobalAttributesを拡張し、width/height属性を追加しています。
 *
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/td
 */
export interface TdAttributes extends GlobalAttributes {
  /**
   * セルの幅
   *
   * ピクセル値または相対値を指定できます。
   * 例: "100px", "50%"
   */
  width?: string;

  /**
   * セルの高さ
   *
   * ピクセル値または相対値を指定できます。
   * 例: "50px", "auto"
   */
  height?: string;

  /**
   * セルが水平方向に結合する列数
   *
   * デフォルト: "1"
   * 例: "2", "3"
   *
   * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/td#colspan
   */
  colspan?: string;

  /**
   * セルが垂直方向に結合する行数
   *
   * デフォルト: "1"
   * 例: "2", "3"
   *
   * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/td#rowspan
   */
  rowspan?: string;
}
