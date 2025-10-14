import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { SubAttributes } from "../sub-attributes";
import type { BaseElement } from "../../../base/base-element";

/**
 * sub要素の型定義
 * HTMLのsub（下付き文字）要素を表現します
 * BaseElementを継承した専用の型
 */
export interface SubElement extends BaseElement<"sub", SubAttributes> {
  children?: HTMLNode[];
}

/**
 * sub要素のコンパニオンオブジェクト
 */
export const SubElement = {
  /**
   * 型ガード: 与えられたノードがSubElementかどうかを判定
   */
  isSubElement(node: unknown): node is SubElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "sub"
    );
  },

  /**
   * ファクトリー: SubElementを作成
   */
  create(
    attributes: SubAttributes = {},
    children: HTMLNode[] = [],
  ): SubElement {
    return {
      type: "element",
      tagName: "sub",
      attributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: SubElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: SubElement): string | undefined {
    return element.attributes?.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: SubElement): string | undefined {
    return element.attributes?.style;
  },
};
