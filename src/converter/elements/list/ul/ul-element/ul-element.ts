import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { BaseElement } from "../../../base/base-element";
import { UlAttributes } from "../ul-attributes";

/**
 * ul要素の型定義
 * HTMLのul（順序なしリスト）要素を表現します
 * BaseElementを継承した専用の型
 */
export interface UlElement extends BaseElement<"ul", UlAttributes> {
  children?: HTMLNode[];
}

/**
 * ul要素のコンパニオンオブジェクト
 */
export const UlElement = {
  /**
   * 型ガード: 与えられたノードがUlElementかどうかを判定
   */
  isUlElement(node: unknown): node is UlElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "ul"
    );
  },

  /**
   * ファクトリー: UlElementを作成
   */
  create(
    attributes: Partial<UlAttributes> | Record<string, string> = {},
    children: HTMLNode[] = [],
  ): UlElement {
    // UlAttributesインスタンスを作成
    const ulAttributes =
      attributes instanceof UlAttributes
        ? attributes
        : new UlAttributes(attributes as Record<string, unknown>);

    return {
      type: "element" as const,
      tagName: "ul" as const,
      attributes: ulAttributes,
      children,
    };
  },
};
