import type { HTMLNode } from "../../../../../models/html-node/html-node";
import type { HeadingAttributes } from "../../heading-attributes";
import type { BaseElement } from "../../../../base/base-element";

/**
 * h2要素の型定義
 * HTMLのh2（第2レベル見出し）要素を表現します
 * BaseElementを継承した専用の型
 */
export interface H2Element extends BaseElement<"h2", HeadingAttributes> {
  attributes: HeadingAttributes;
  children?: HTMLNode[];
}

/**
 * h2要素のコンパニオンオブジェクト
 */
export const H2Element = {
  /**
   * 型ガード: 与えられたノードがH2Elementかどうかを判定
   */
  isH2Element(node: unknown): node is H2Element {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "h2"
    );
  },

  /**
   * ファクトリー: H2Elementを作成
   */
  create(
    attributes: Partial<HeadingAttributes> = {},
    children: HTMLNode[] = [],
  ): H2Element {
    // デフォルト値と提供された属性をマージ
    const fullAttributes: HeadingAttributes = {
      ...attributes,
    };

    return {
      type: "element",
      tagName: "h2",
      attributes: fullAttributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: H2Element): string | undefined {
    return element.attributes.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: H2Element): string | undefined {
    return element.attributes.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: H2Element): string | undefined {
    return element.attributes.style;
  },
};
