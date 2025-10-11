import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { SmallAttributes } from "../small-attributes";
import type { BaseElement } from "../../../base/base-element";

/**
 * small要素の型定義
 * HTMLのsmall（小さいテキスト）要素を表現します
 * BaseElementを継承した専用の型
 */
export interface SmallElement extends BaseElement<"small", SmallAttributes> {
  children?: HTMLNode[];
}

/**
 * small要素のコンパニオンオブジェクト
 */
export const SmallElement = {
  /**
   * 型ガード: 与えられたノードがSmallElementかどうかを判定
   */
  isSmallElement(node: unknown): node is SmallElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "small"
    );
  },

  /**
   * ファクトリー: SmallElementを作成
   */
  create(
    attributes: SmallAttributes = {},
    children: HTMLNode[] = [],
  ): SmallElement {
    return {
      type: "element",
      tagName: "small",
      attributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: SmallElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: SmallElement): string | undefined {
    return element.attributes?.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: SmallElement): string | undefined {
    return element.attributes?.style;
  },
};
