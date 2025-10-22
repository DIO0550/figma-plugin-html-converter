/**
 * @fileoverview select要素の属性定義
 */

import type { GlobalAttributes } from "../../../base";

/**
 * select要素の属性インターフェース
 */
export interface SelectAttributes extends GlobalAttributes {
  /**
   * フォーム送信時のパラメータ名
   */
  name?: string;

  /**
   * 複数選択を許可するかどうか
   */
  multiple?: string;

  /**
   * 表示する選択肢の数
   */
  size?: string;

  /**
   * 無効化されているかどうか
   */
  disabled?: string;

  /**
   * 必須入力かどうか
   */
  required?: string;

  /**
   * オートコンプリート設定
   */
  autocomplete?: string;

  /**
   * 自動フォーカス
   */
  autofocus?: string;

  /**
   * 関連付けるform要素のID
   */
  form?: string;
}
