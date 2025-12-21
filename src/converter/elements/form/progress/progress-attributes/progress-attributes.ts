/**
 * @fileoverview progress要素の属性定義
 */

import type { GlobalAttributes } from "../../../base";

/**
 * progress要素が持つ属性
 *
 * value/maxで進捗率を表現する。
 */
export interface ProgressAttributes extends GlobalAttributes {
  /**
   * 現在の進捗値
   */
  value?: string | number;

  /**
   * 進捗の最大値
   */
  max?: string | number;
}
