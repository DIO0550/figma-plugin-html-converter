import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { BaseElement } from "../../../base/base-element/base-element";
import type { BAttributes } from "../b-attributes";

/**
 * b要素の型定義
 * HTMLのb（太字）要素を表現します
 * BaseElementを継承した専用の型
 */
export interface BElement extends BaseElement<"b", BAttributes> {
  children?: HTMLNode[];
}

/**
 * b要素のコンパニオンオブジェクト
 */
export const BElement = {
  /**
   * 型ガード: 与えられたノードがBElementかどうかを判定
   */
  isBElement(node: unknown): node is BElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "b"
    );
  },

  /**
   * ファクトリー: BElementを作成
   */
  create(
    attributes: Partial<BAttributes> = {},
    children: HTMLNode[] = [],
  ): BElement {
    // デフォルト値と提供された属性をマージ
    const fullAttributes: BAttributes = {
      ...attributes,
    };

    return {
      type: "element",
      tagName: "b",
      attributes: fullAttributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: BElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: BElement): string | undefined {
    return element.attributes?.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: BElement): string | undefined {
    return element.attributes?.style;
  },
};
