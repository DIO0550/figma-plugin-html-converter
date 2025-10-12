import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { SupAttributes } from "../sup-attributes";
import type { BaseElement } from "../../../base/base-element";

/**
 * sup要素の型定義
 * HTMLのsup（上付き文字）要素を表現します
 * BaseElementを継承した専用の型
 */
export interface SupElement extends BaseElement<"sup", SupAttributes> {
  children?: HTMLNode[];
}

/**
 * sup要素のコンパニオンオブジェクト
 */
export const SupElement = {
  /**
   * 型ガード: 与えられたノードがSupElementかどうかを判定
   */
  isSupElement(node: unknown): node is SupElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "sup"
    );
  },

  /**
   * ファクトリー: SupElementを作成
   */
  create(
    attributes: SupAttributes = {},
    children: HTMLNode[] = [],
  ): SupElement {
    return {
      type: "element",
      tagName: "sup",
      attributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: SupElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: SupElement): string | undefined {
    return element.attributes?.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: SupElement): string | undefined {
    return element.attributes?.style;
  },
};
