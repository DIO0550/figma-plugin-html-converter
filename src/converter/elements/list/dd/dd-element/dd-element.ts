/**
 * @fileoverview DD要素のモデル
 */

import type { HTMLNode } from "../../../models/html-node";
import type { DdAttributes } from "../dd-attributes";

/**
 * DD要素
 * 定義リストの説明（Definition Description）を表現
 */
export interface DdElement {
  type: "element";
  tagName: "dd";
  attributes?: DdAttributes;
  children?: HTMLNode[];
}

/**
 * DD要素のコンパニオンオブジェクト
 */
export const DdElement = {
  /**
   * DD要素を作成
   */
  create(attributes: DdAttributes = {}, children: HTMLNode[] = []): DdElement {
    return {
      type: "element",
      tagName: "dd",
      attributes,
      children,
    };
  },

  /**
   * DD要素の型ガード
   */
  isDdElement(node: unknown): node is DdElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      (node as { type: unknown }).type === "element" &&
      (node as { tagName: unknown }).tagName === "dd"
    );
  },
};
