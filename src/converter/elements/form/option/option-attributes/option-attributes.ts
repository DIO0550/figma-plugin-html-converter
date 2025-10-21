/**
 * @fileoverview option要素の属性定義
 */

import type { GlobalAttributes } from "../../../base";

/**
 * option要素の属性インターフェース
 */
export interface OptionAttributes extends GlobalAttributes {
  /**
   * フォーム送信時の値
   */
  value?: string;

  /**
   * 選択されているかどうか
   */
  selected?: string;

  /**
   * 無効化されているかどうか
   */
  disabled?: string;

  /**
   * 表示用ラベル
   */
  label?: string;
}
