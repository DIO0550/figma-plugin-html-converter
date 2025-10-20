/**
 * @fileoverview button要素の属性定義
 */

import type { GlobalAttributes } from "../../../base";

/**
 * button要素のtype属性の値
 */
export type ButtonType = "button" | "submit" | "reset";

/**
 * button要素の属性インターフェース
 */
export interface ButtonAttributes extends GlobalAttributes {
  /**
   * ボタンのタイプ
   */
  type?: ButtonType;

  /**
   * フォーム送信時のパラメータ名
   */
  name?: string;

  /**
   * ボタンの値
   */
  value?: string;

  /**
   * 無効化されているかどうか
   */
  disabled?: string;
}
