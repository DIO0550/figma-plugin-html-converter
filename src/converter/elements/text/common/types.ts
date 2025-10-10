/**
 * テキストノードの型定義
 */
export interface TextNode {
  /** ノードのタイプを示す識別子 */
  type: "text";
  /**
   * テキストコンテンツ（DOM互換プロパティ）
   * 主にDOMから取得したテキストノードで使用されます
   */
  textContent?: string;
  /**
   * テキストコンテンツ（簡易プロパティ）
   * HTMLパーサーから生成されたテキストノードで使用されます
   */
  content?: string;
}
