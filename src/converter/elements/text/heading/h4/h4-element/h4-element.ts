import type { HTMLNode } from "../../../../../models/html-node/html-node";
import type { HeadingAttributes } from "../../heading-attributes";

/**
 * h4要素の型定義
 * HTMLのh4（第4レベル見出し）要素を表現します
 */
export interface H4Element {
  type: "element";
  tagName: "h4";
  attributes: HeadingAttributes;
  children?: HTMLNode[];
}

/**
 * h4要素のコンパニオンオブジェクト
 */
export const H4Element = {
  /**
   * 型ガード: 与えられたノードがH4Elementかどうかを判定
   */
  isH4Element(node: unknown): node is H4Element {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "h4"
    );
  },

  /**
   * ファクトリー: H4Elementを作成
   */
  create(
    attributes: Partial<HeadingAttributes> = {},
    children: HTMLNode[] = [],
  ): H4Element {
    // デフォルト値と提供された属性をマージ
    const fullAttributes: HeadingAttributes = {
      ...attributes,
    };

    return {
      type: "element",
      tagName: "h4",
      attributes: fullAttributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: H4Element): string | undefined {
    return element.attributes.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: H4Element): string | undefined {
    return element.attributes.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: H4Element): string | undefined {
    return element.attributes.style;
  },
};
