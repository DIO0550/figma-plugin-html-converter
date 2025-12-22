/**
 * @fileoverview progress要素の型定義、型ガード、ファクトリー関数を提供
 */

import type { HTMLNode } from "../../../../models/html-node";
import type { BaseElement } from "../../../base/base-element";
import type { ProgressAttributes } from "../progress-attributes";

/**
 * progress要素
 *
 * 進捗を表現するHTMLのprogress要素を表す。
 */
export interface ProgressElement extends BaseElement<
  "progress",
  ProgressAttributes
> {
  children?: HTMLNode[];
}

/**
 * progress要素のコンパニオンオブジェクト
 */
export const ProgressElement = {
  /**
   * 型ガード: 与えられたノードがProgressElementかどうかを判定
   */
  isProgressElement(node: unknown): node is ProgressElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "progress"
    );
  },

  /**
   * ファクトリー: ProgressElementを作成
   */
  create(
    attributes: Partial<ProgressAttributes> = {},
    children: HTMLNode[] = [],
  ): ProgressElement {
    return {
      type: "element",
      tagName: "progress",
      attributes: attributes as ProgressAttributes,
      children,
    };
  },
};
