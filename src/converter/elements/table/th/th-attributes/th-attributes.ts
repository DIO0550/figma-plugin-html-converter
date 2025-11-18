/**
 * @fileoverview th要素の属性定義
 */

import type { GlobalAttributes } from "../../../base";

/**
 * th要素の属性インターフェース
 *
 * th要素はテーブルのヘッダーセルを表します。
 * GlobalAttributesを拡張し、th要素固有の属性を追加しています。
 *
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/th
 */
export interface ThAttributes extends GlobalAttributes {
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
   * ヘッダーセルの適用範囲
   *
   * - "col": 列のヘッダー
   * - "row": 行のヘッダー
   * - "colgroup": 列グループのヘッダー
   * - "rowgroup": 行グループのヘッダー
   *
   * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/th#scope
   */
  scope?: "col" | "row" | "colgroup" | "rowgroup";

  /**
   * ヘッダーセルの省略形テキスト
   *
   * スクリーンリーダーなどの支援技術で使用されます。
   *
   * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/th#abbr
   */
  abbr?: string;

  /**
   * セルが水平方向に結合する列数
   *
   * デフォルト: "1"
   * 例: "2", "3"
   *
   * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/th#colspan
   */
  colspan?: string;

  /**
   * セルが垂直方向に結合する行数
   *
   * デフォルト: "1"
   * 例: "2", "3"
   *
   * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/th#rowspan
   */
  rowspan?: string;
}
