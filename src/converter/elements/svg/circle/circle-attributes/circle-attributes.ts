import type { SvgBaseAttributes } from "../../svg-attributes";

/**
 * SVG circle要素の属性
 */
export interface CircleAttributes extends SvgBaseAttributes {
  /** 中心のX座標 */
  cx?: string | number;
  /** 中心のY座標 */
  cy?: string | number;
  /** 半径 */
  r?: string | number;
}
