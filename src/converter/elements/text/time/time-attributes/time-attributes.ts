import type { GlobalAttributes } from "../../../base/global-attributes";

/**
 * time要素の属性定義
 * HTMLのtime要素固有の属性とグローバル属性を含みます
 */
export interface TimeAttributes extends GlobalAttributes {
  /**
   * 機械可読な日時形式
   * ISO 8601形式の日時文字列（例: "2024-12-25", "2024-12-25T10:00:00"）
   */
  datetime?: string;
}
