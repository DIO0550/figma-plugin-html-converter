/**
 * @fileoverview textarea要素の定義とコンパニオンオブジェクト
 */

import type { BaseElement } from "../../../base";
import type { TextareaAttributes } from "../textarea-attributes";
import type { HTMLNode } from "../../../../models/html-node/html-node";

/**
 * textarea要素
 */
export interface TextareaElement
  extends BaseElement<"textarea", TextareaAttributes> {
  attributes: TextareaAttributes;
  children?: HTMLNode[];
}

/**
 * textarea要素のコンパニオンオブジェクト
 */
export const TextareaElement = {
  /**
   * 型ガード
   */
  isTextareaElement(node: unknown): node is TextareaElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "textarea"
    );
  },

  /**
   * ファクトリー
   */
  create(
    attributes: TextareaAttributes = {},
    children: HTMLNode[] = [],
  ): TextareaElement {
    return {
      type: "element" as const,
      tagName: "textarea" as const,
      attributes,
      children,
    };
  },
};
