/**
 * テキスト要素で共通で使用される型定義
 */

/**
 * テキストノードの型定義
 * HTMLのテキストノードを表現
 */
export type TextNode = {
  type: "text";
  content: string;
};
