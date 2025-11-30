/**
 * @fileoverview colgroup要素の属性定義
 */

import type { GlobalAttributes } from "../../../base";

/**
 * colgroup要素の属性インターフェース
 *
 * colgroup要素はテーブルの列グループを定義します。
 * col要素を子として持つか、span属性で列数を指定できます。
 *
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/colgroup
 */
export interface ColgroupAttributes extends GlobalAttributes {
  /**
   * グループ化する列数
   * col要素が子にない場合のみ有効
   * @default 1
   */
  span?: number | string;
}
