import type { SvgBaseAttributes } from "../../svg-attributes";

/**
 * SVG ellipse要素の属性
 */
export interface EllipseAttributes extends SvgBaseAttributes {
  /** 中心のX座標 */
  cx?: string | number;
  /** 中心のY座標 */
  cy?: string | number;
  /** X方向の半径 */
  rx?: string | number;
  /** Y方向の半径 */
  ry?: string | number;
}
