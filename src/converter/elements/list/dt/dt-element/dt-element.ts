/**
 * @fileoverview DT要素のモデル
 */

import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { DtAttributes } from "../dt-attributes";

/**
 * DT要素
 * 定義リストの用語（Definition Term）を表現
 */
export interface DtElement {
  type: "element";
  tagName: "dt";
  attributes?: DtAttributes;
  children?: HTMLNode[];
}

/**
 * DT要素のコンパニオンオブジェクト
 */
export const DtElement = {
  /**
   * DT要素を作成
   */
  create(attributes: DtAttributes = {}, children: HTMLNode[] = []): DtElement {
    return {
      type: "element",
      tagName: "dt",
      attributes,
      children,
    };
  },

  /**
   * DT要素の型ガード
   */
  isDtElement(node: unknown): node is DtElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      (node as { type: unknown }).type === "element" &&
      (node as { tagName: unknown }).tagName === "dt"
    );
  },
};
