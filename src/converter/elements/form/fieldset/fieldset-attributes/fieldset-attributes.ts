/**
 * @fileoverview fieldset要素の属性定義
 */

import type { GlobalAttributes } from "../../../base";

/**
 * fieldset要素の属性インターフェース
 */
export interface FieldsetAttributes extends GlobalAttributes {
  /**
   * fieldset内のフォームコントロールを無効化
   */
  disabled?: boolean;

  /**
   * 関連付けるform要素のID
   */
  form?: string;

  /**
   * フィールドセットの名前
   */
  name?: string;
}
