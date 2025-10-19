/**
 * @fileoverview textarea要素の属性定義
 */

import type { GlobalAttributes } from "../../../base";

/**
 * textarea要素の属性インターフェース
 */
export interface TextareaAttributes extends GlobalAttributes {
  /**
   * フォーム送信時のパラメータ名
   */
  name?: string;

  /**
   * 表示行数
   */
  rows?: string;

  /**
   * 表示列数
   */
  cols?: string;

  /**
   * プレースホルダーテキスト
   */
  placeholder?: string;

  /**
   * 最大文字数
   */
  maxlength?: string;

  /**
   * 必須入力フィールドかどうか
   */
  required?: string;

  /**
   * 無効化されているかどうか
   */
  disabled?: string;

  /**
   * 読み取り専用かどうか
   */
  readonly?: string;
}
