/**
 * @fileoverview option要素の定義とコンパニオンオブジェクト
 */

import type { BaseElement } from "../../../base";
import type { OptionAttributes } from "../option-attributes";
import type { HTMLNode } from "../../../../models/html-node/html-node";

/**
 * option要素
 */
export interface OptionElement extends BaseElement<"option", OptionAttributes> {
  attributes: OptionAttributes;
  children?: HTMLNode[];
}

/**
 * option要素のコンパニオンオブジェクト
 */
export const OptionElement = {
  /**
   * 型ガード
   */
  isOptionElement(node: unknown): node is OptionElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "option"
    );
  },

  /**
   * ファクトリー
   */
  create(
    attributes: OptionAttributes = {},
    children: HTMLNode[] = [],
  ): OptionElement {
    return {
      type: "element" as const,
      tagName: "option" as const,
      attributes,
      children,
    };
  },
};
