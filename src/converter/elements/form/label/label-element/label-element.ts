/**
 * @fileoverview label要素の定義とコンパニオンオブジェクト
 */

import type { BaseElement } from "../../../base";
import type { LabelAttributes } from "../label-attributes";
import type { HTMLNode } from "../../../../models/html-node/html-node";

/**
 * label要素
 */
export interface LabelElement extends BaseElement<"label", LabelAttributes> {
  attributes: LabelAttributes;
  children?: HTMLNode[];
}

/**
 * label要素のコンパニオンオブジェクト
 */
export const LabelElement = {
  /**
   * 型ガード
   */
  isLabelElement(node: unknown): node is LabelElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "label"
    );
  },

  /**
   * ファクトリー
   */
  create(
    attributes: LabelAttributes = {},
    children: HTMLNode[] = [],
  ): LabelElement {
    return {
      type: "element" as const,
      tagName: "label" as const,
      attributes,
      children,
    };
  },
};
