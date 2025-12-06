import type { SvgBaseAttributes } from "../../svg-attributes";

/**
 * SVG path要素の属性
 */
export interface PathAttributes extends SvgBaseAttributes {
  /** パスデータ */
  d?: string;
}
