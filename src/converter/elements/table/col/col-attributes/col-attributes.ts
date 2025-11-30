/**
 * @fileoverview col要素の属性定義
 */

import type { GlobalAttributes } from "../../../base";

/**
 * col要素の属性インターフェース
 *
 * col要素はテーブルの列を定義します。
 * colgroup要素の子として配置され、列のスタイルや幅を指定できます。
 *
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/col
 */
export interface ColAttributes extends GlobalAttributes {
  /**
   * この要素が適用される列数
   * @default 1
   */
  span?: number | string;

  /**
   * 列の幅（非推奨、CSSを推奨）
   * ただし後方互換性のためサポート
   */
  width?: string | number;
}
