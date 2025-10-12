import type { GlobalAttributes } from "../../../base/global-attributes";

/**
 * del要素の属性定義
 * HTMLのdel（削除済みテキスト）要素で使用可能な属性を定義します
 */
export interface DelAttributes extends GlobalAttributes {
  /**
   * 削除の理由を示すURL
   */
  cite?: string;
  /**
   * 削除された日時
   */
  datetime?: string;
}
