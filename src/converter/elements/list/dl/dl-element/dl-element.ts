/**
 * @fileoverview DL要素のモデル
 */

import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { DlAttributes } from "../dl-attributes";

/**
 * DL要素
 * 定義リスト（Description List）を表現
 */
export interface DlElement {
  type: "element";
  tagName: "dl";
  attributes?: DlAttributes;
  children?: HTMLNode[];
}

/**
 * DL要素のコンパニオンオブジェクト
 */
export const DlElement = {
  /**
   * DL要素を作成
   */
  create(attributes: DlAttributes = {}, children: HTMLNode[] = []): DlElement {
    return {
      type: "element",
      tagName: "dl",
      attributes,
      children,
    };
  },

  /**
   * DL要素の型ガード
   */
  isDlElement(node: unknown): node is DlElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      (node as { type: unknown }).type === "element" &&
      (node as { tagName: unknown }).tagName === "dl"
    );
  },
};
