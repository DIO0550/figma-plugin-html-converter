import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { InsAttributes } from "../ins-attributes";
import type { BaseElement } from "../../../base/base-element";

/**
 * ins要素の型定義
 * HTMLのins（挿入済みテキスト）要素を表現します
 * BaseElementを継承した専用の型
 */
export interface InsElement extends BaseElement<"ins", InsAttributes> {
  children?: HTMLNode[];
}

/**
 * ins要素のコンパニオンオブジェクト
 */
export const InsElement = {
  /**
   * 型ガード: 与えられたノードがInsElementかどうかを判定
   */
  isInsElement(node: unknown): node is InsElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "ins"
    );
  },

  /**
   * ファクトリー: InsElementを作成
   */
  create(
    attributes: InsAttributes = {},
    children: HTMLNode[] = [],
  ): InsElement {
    return {
      type: "element",
      tagName: "ins",
      attributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: InsElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: InsElement): string | undefined {
    return element.attributes?.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: InsElement): string | undefined {
    return element.attributes?.style;
  },

  /**
   * cite属性の取得
   */
  getCite(element: InsElement): string | undefined {
    return element.attributes?.cite;
  },

  /**
   * datetime属性の取得
   */
  getDatetime(element: InsElement): string | undefined {
    return element.attributes?.datetime;
  },
};
