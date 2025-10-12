import type { GlobalAttributes } from "../../../base/global-attributes";

/**
 * ins要素の属性定義
 * HTMLのins（挿入済みテキスト）要素で使用可能な属性を定義します
 */
export interface InsAttributes extends GlobalAttributes {
  /**
   * 挿入の理由を示すURL
   */
  cite?: string;
  /**
   * 挿入された日時
   */
  datetime?: string;
}
