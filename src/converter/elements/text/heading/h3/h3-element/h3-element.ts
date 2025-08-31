import type { HTMLNode } from "../../../../../models/html-node/html-node";
import type { HeadingAttributes } from "../../heading-attributes";

/**
 * h3要素の型定義
 * HTMLのh3（第3レベル見出し）要素を表現します
 */
export interface H3Element {
  type: "element";
  tagName: "h3";
  attributes: HeadingAttributes;
  children?: HTMLNode[];
}

/**
 * h3要素のコンパニオンオブジェクト
 */
export const H3Element = {
  /**
   * 型ガード: 与えられたノードがH3Elementかどうかを判定
   */
  isH3Element(node: unknown): node is H3Element {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "h3"
    );
  },

  /**
   * ファクトリー: H3Elementを作成
   */
  create(
    attributes: Partial<HeadingAttributes> = {},
    children: HTMLNode[] = [],
  ): H3Element {
    // デフォルト値と提供された属性をマージ
    const fullAttributes: HeadingAttributes = {
      ...attributes,
    };

    return {
      type: "element",
      tagName: "h3",
      attributes: fullAttributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: H3Element): string | undefined {
    return element.attributes.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: H3Element): string | undefined {
    return element.attributes.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: H3Element): string | undefined {
    return element.attributes.style;
  },
};
