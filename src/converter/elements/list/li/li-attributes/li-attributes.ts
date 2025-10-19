/**
 * @fileoverview LI要素の属性定義
 */

import { GlobalAttributes } from "../../../base";

/**
 * LI要素の属性インターフェース
 * リストアイテムの属性を定義
 */
export interface LiAttributes extends GlobalAttributes {
  /**
   * リストアイテムの値（ol要素内で使用）
   * この値は、順序付きリスト内でアイテムの番号を明示的に設定する
   */
  value?: string;
}
