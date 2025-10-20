/**
 * @fileoverview button要素の定義とコンパニオンオブジェクト
 */

import type { BaseElement } from "../../../base";
import type { ButtonAttributes } from "../button-attributes";
import type { HTMLNode } from "../../../../models/html-node/html-node";

/**
 * button要素
 */
export interface ButtonElement extends BaseElement<"button", ButtonAttributes> {
  attributes: ButtonAttributes;
  children?: HTMLNode[];
}

/**
 * button要素のコンパニオンオブジェクト
 */
export const ButtonElement = {
  /**
   * 型ガード
   */
  isButtonElement(node: unknown): node is ButtonElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "button"
    );
  },

  /**
   * ファクトリー
   */
  create(
    attributes: ButtonAttributes = {},
    children: HTMLNode[] = [],
  ): ButtonElement {
    return {
      type: "element" as const,
      tagName: "button" as const,
      attributes,
      children,
    };
  },
};
