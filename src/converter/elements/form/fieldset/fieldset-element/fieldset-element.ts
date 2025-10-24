/**
 * @fileoverview fieldset要素の定義とコンパニオンオブジェクト
 */

import type { BaseElement } from "../../../base";
import type { FieldsetAttributes } from "../fieldset-attributes";
import type { HTMLNode } from "../../../../models/html-node/html-node";

/**
 * fieldset要素
 */
export interface FieldsetElement
  extends BaseElement<"fieldset", FieldsetAttributes> {
  attributes: FieldsetAttributes;
  children?: HTMLNode[];
}

/**
 * fieldset要素のコンパニオンオブジェクト
 */
export const FieldsetElement = {
  /**
   * 型ガード
   */
  isFieldsetElement(node: unknown): node is FieldsetElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "fieldset"
    );
  },

  /**
   * ファクトリー
   */
  create(
    attributes: FieldsetAttributes = {},
    children: HTMLNode[] = [],
  ): FieldsetElement {
    return {
      type: "element" as const,
      tagName: "fieldset" as const,
      attributes,
      children,
    };
  },
};
