import type { GlobalAttributes } from "../../../base/global-attributes";

/**
 * q要素の属性定義
 * HTMLのq要素固有の属性とグローバル属性を含みます
 */
export interface QAttributes extends GlobalAttributes {
  /**
   * 引用元のURL
   */
  cite?: string;
}
