/**
 * 見出し要素の属性インターフェース
 * h1-h6要素で共通して使用される属性を定義
 */
export interface HeadingAttributes {
  id?: string;
  class?: string;
  style?: string;
  [key: string]: string | undefined;
}
