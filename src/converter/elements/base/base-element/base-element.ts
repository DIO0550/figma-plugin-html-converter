/**
 * HTML要素の基底インターフェース
 * 全てのHTML要素型はこのインターフェースを拡張する
 *
 * @template T - HTML要素のタグ名
 * @template A - 属性の型（デフォルトはRecord<string, unknown>）
 */
export interface BaseElement<T extends string, A = Record<string, unknown>> {
  /**
   * ノードタイプ（常に'element'）
   */
  type: "element";

  /**
   * HTML要素のタグ名
   */
  tagName: T;

  /**
   * 要素の属性
   * 各要素は独自の属性型を定義可能
   */
  attributes?: A;

  /**
   * 子要素の配列
   * 要素によっては子要素を持たない場合があるため、optional
   */
  children?: unknown[];
}
