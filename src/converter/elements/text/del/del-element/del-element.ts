import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { DelAttributes } from "../del-attributes";
import type { BaseElement } from "../../../base/base-element";

/**
 * del要素の型定義
 * HTMLのdel（削除済みテキスト）要素を表現します
 * BaseElementを継承した専用の型
 */
export interface DelElement extends BaseElement<"del", DelAttributes> {
  children?: HTMLNode[];
}

/**
 * del要素のコンパニオンオブジェクト
 */
export const DelElement = {
  /**
   * 型ガード: 与えられたノードがDelElementかどうかを判定
   */
  isDelElement(node: unknown): node is DelElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "del"
    );
  },

  /**
   * ファクトリー: DelElementを作成
   */
  create(
    attributes: DelAttributes = {},
    children: HTMLNode[] = [],
  ): DelElement {
    return {
      type: "element",
      tagName: "del",
      attributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: DelElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: DelElement): string | undefined {
    return element.attributes?.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: DelElement): string | undefined {
    return element.attributes?.style;
  },

  /**
   * cite属性の取得
   */
  getCite(element: DelElement): string | undefined {
    return element.attributes?.cite;
  },

  /**
   * datetime属性の取得
   */
  getDatetime(element: DelElement): string | undefined {
    return element.attributes?.datetime;
  },
};
