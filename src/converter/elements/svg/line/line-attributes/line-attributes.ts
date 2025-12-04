import type { SvgBaseAttributes } from "../../svg-attributes";

/**
 * SVG line要素の属性
 */
export interface LineAttributes extends SvgBaseAttributes {
  /** 始点のX座標 */
  x1?: string | number;
  /** 始点のY座標 */
  y1?: string | number;
  /** 終点のX座標 */
  x2?: string | number;
  /** 終点のY座標 */
  y2?: string | number;
}
