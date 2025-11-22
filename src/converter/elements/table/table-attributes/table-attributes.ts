/**
 * @fileoverview table要素の属性定義
 */

import type { GlobalAttributes } from "../../base/global-attributes";

/**
 * table要素の属性インターフェース
 *
 * table要素はテーブル全体のコンテナを表します。
 * GlobalAttributesを拡張し、border属性を追加しています。
 *
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/table
 */
export interface TableAttributes extends GlobalAttributes {
  /**
   * テーブルのボーダー幅
   *
   * 廃止予定の属性ですが、互換性のためサポートします。
   * ピクセル値を文字列で指定します。
   *
   * @deprecated CSSのborderプロパティを使用してください
   * @example "1" - 1pxのボーダー
   */
  border?: string;
}
