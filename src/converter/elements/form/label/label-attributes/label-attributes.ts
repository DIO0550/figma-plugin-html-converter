/**
 * @fileoverview label要素の属性定義
 */

import type { GlobalAttributes } from "../../../base";

/**
 * label要素の属性インターフェース
 */
export interface LabelAttributes extends GlobalAttributes {
  /**
   * 関連付けるフォーム要素のID
   */
  for?: string;

  /**
   * 関連付けるform要素のID
   */
  form?: string;
}
