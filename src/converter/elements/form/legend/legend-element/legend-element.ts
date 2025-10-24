/**
 * @fileoverview legend要素の定義とコンパニオンオブジェクト
 */

import type { BaseElement } from "../../../base";
import type { LegendAttributes } from "../legend-attributes";
import type { HTMLNode } from "../../../../models/html-node/html-node";

/**
 * legend要素
 */
export interface LegendElement extends BaseElement<"legend", LegendAttributes> {
  attributes: LegendAttributes;
  children?: HTMLNode[];
}

/**
 * legend要素のコンパニオンオブジェクト
 */
export const LegendElement = {
  /**
   * 型ガード
   */
  isLegendElement(node: unknown): node is LegendElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "legend"
    );
  },

  /**
   * ファクトリー
   */
  create(
    attributes: LegendAttributes = {},
    children: HTMLNode[] = [],
  ): LegendElement {
    return {
      type: "element" as const,
      tagName: "legend" as const,
      attributes,
      children,
    };
  },
};
