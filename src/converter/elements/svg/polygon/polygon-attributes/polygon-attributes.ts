import type { SvgBaseAttributes } from "../../svg-attributes";

/**
 * SVG polygon要素の属性
 */
export interface PolygonAttributes extends SvgBaseAttributes {
  /** 多角形の頂点座標リスト（例: "100,10 40,198 190,78"） */
  points?: string;
}
