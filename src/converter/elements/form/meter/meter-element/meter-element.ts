/**
 * @fileoverview meter要素の定義とコンパニオンオブジェクト
 */

import type { HTMLNode } from "../../../../models/html-node";
import type { BaseElement } from "../../../base/base-element";
import type { MeterAttributes } from "../meter-attributes";

/**
 * meter要素
 *
 * メーター表示を行うHTMLのmeter要素を表す。
 */
export interface MeterElement extends BaseElement<"meter", MeterAttributes> {
  children?: HTMLNode[];
}

/**
 * meter要素のコンパニオンオブジェクト
 */
export const MeterElement = {
  /**
   * 型ガード: 与えられたノードがMeterElementかどうかを判定
   */
  isMeterElement(node: unknown): node is MeterElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "meter"
    );
  },

  /**
   * ファクトリー: MeterElementを作成
   */
  create(
    attributes: Partial<MeterAttributes> = {},
    children: HTMLNode[] = [],
  ): MeterElement {
    return {
      type: "element",
      tagName: "meter",
      attributes: attributes as MeterAttributes,
      children,
    };
  },
};
