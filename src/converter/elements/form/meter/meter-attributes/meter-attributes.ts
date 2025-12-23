/**
 * @fileoverview meter要素の属性定義
 */

import type { GlobalAttributes } from "../../../base";

/**
 * meter要素が持つ属性
 *
 * value/min/max/low/high/optimumでメーターの状態を表現する。
 */
export interface MeterAttributes extends GlobalAttributes {
  /**
   * 現在値
   */
  value?: string | number;

  /**
   * 最小値（デフォルトは0）
   */
  min?: string | number;

  /**
   * 最大値（デフォルトは1）
   */
  max?: string | number;

  /**
   * 低値のしきい値
   */
  low?: string | number;

  /**
   * 高値のしきい値
   */
  high?: string | number;

  /**
   * 望ましい値
   */
  optimum?: string | number;
}
