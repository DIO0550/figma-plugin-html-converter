/**
 * @fileoverview input要素の定義とコンパニオンオブジェクト
 */

import type { BaseElement } from "../../../base";
import type { InputAttributes } from "../input-attributes";

/**
 * input要素
 * HTMLのinput要素を表現します
 * BaseElementを継承した専用の型
 */
export interface InputElement extends BaseElement<"input", InputAttributes> {
  attributes: InputAttributes;
  // inputは自己完結要素なので、childrenは持たない
  children?: never;
}

/**
 * input要素のコンパニオンオブジェクト
 */
export const InputElement = {
  /**
   * 型ガード: 与えられたノードがInputElementかどうかを判定
   */
  isInputElement(node: unknown): node is InputElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "input"
    );
  },

  /**
   * ファクトリー: InputElementを作成
   */
  create(attributes: InputAttributes = {}): InputElement {
    return {
      type: "element" as const,
      tagName: "input" as const,
      attributes,
    };
  },
};
