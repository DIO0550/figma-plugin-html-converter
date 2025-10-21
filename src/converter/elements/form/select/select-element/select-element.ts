/**
 * @fileoverview select要素の定義とコンパニオンオブジェクト
 */

import type { BaseElement } from "../../../base";
import type { SelectAttributes } from "../select-attributes";
import type { HTMLNode } from "../../../../models/html-node/html-node";

/**
 * select要素
 */
export interface SelectElement extends BaseElement<"select", SelectAttributes> {
  attributes: SelectAttributes;
  children?: HTMLNode[];
}

/**
 * select要素のコンパニオンオブジェクト
 */
export const SelectElement = {
  /**
   * 型ガード
   */
  isSelectElement(node: unknown): node is SelectElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "select"
    );
  },

  /**
   * ファクトリー
   */
  create(
    attributes: SelectAttributes = {},
    children: HTMLNode[] = [],
  ): SelectElement {
    return {
      type: "element" as const,
      tagName: "select" as const,
      attributes,
      children,
    };
  },
};
