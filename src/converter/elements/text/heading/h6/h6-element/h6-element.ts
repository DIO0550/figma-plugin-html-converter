import type { HTMLNode } from "../../../../../models/html-node/html-node";
import type { HeadingAttributes } from "../../heading-attributes";

/**
 * h6要素の型定義
 * HTMLのh6（第6レベル見出し）要素を表現します
 */
export interface H6Element {
  type: "element";
  tagName: "h6";
  attributes: HeadingAttributes;
  children?: HTMLNode[];
}

/**
 * h6要素のコンパニオンオブジェクト
 */
export const H6Element = {
  /**
   * 型ガード: 与えられたノードがH6Elementかどうかを判定
   */
  isH6Element(node: unknown): node is H6Element {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "h6"
    );
  },

  /**
   * ファクトリー: H6Elementを作成
   */
  create(
    attributes: Partial<HeadingAttributes> = {},
    children: HTMLNode[] = [],
  ): H6Element {
    // デフォルト値と提供された属性をマージ
    const fullAttributes: HeadingAttributes = {
      ...attributes,
    };

    return {
      type: "element",
      tagName: "h6",
      attributes: fullAttributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: H6Element): string | undefined {
    return element.attributes.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: H6Element): string | undefined {
    return element.attributes.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: H6Element): string | undefined {
    return element.attributes.style;
  },
};
