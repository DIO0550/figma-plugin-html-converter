import type { SvgBaseAttributes } from "../../svg-attributes";

/**
 * SVG polyline要素の属性
 */
export interface PolylineAttributes extends SvgBaseAttributes {
  /** 折れ線の頂点座標リスト（例: "0,40 40,40 40,80 80,80"） */
  points?: string;
}
