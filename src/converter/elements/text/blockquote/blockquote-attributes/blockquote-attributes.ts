import type { GlobalAttributes } from "../../../base/global-attributes";

/**
 * blockquote要素の属性定義
 * HTMLのblockquote要素で使用可能な属性を定義します
 * cite属性を追加でサポートします
 */
export interface BlockquoteAttributes extends GlobalAttributes {
  /**
   * 引用元のURLを指定
   */
  cite?: string;
}
