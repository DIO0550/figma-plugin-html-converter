/**
 * HTML要素の基底インターフェース
 * 全てのHTML要素型はこのインターフェースを拡張する
 * 
 * @template T - HTML要素のタグ名
 */
export interface BaseElement<T extends string> {
  /**
   * ノードタイプ（常に'element'）
   */
  type: 'element';
  
  /**
   * HTML要素のタグ名
   */
  tagName: T;
  
  /**
   * 子要素の配列
   * 要素によっては子要素を持たない場合があるため、optional
   */
  children?: unknown[];
}