import type { SvgBaseAttributes } from "../../svg-attributes";

/**
 * SVG rect要素の属性
 */
export interface RectAttributes extends SvgBaseAttributes {
  /** 矩形の左上角のX座標 */
  x?: string | number;
  /** 矩形の左上角のY座標 */
  y?: string | number;
  /** 矩形の幅 */
  width?: string | number;
  /** 矩形の高さ */
  height?: string | number;
  /** 角丸のX方向の半径 */
  rx?: string | number;
  /** 角丸のY方向の半径 */
  ry?: string | number;
}
