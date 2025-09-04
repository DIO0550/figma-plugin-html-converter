import type { HTMLNode } from "../../../../../models/html-node/html-node";
import type { HeadingAttributes } from "../../heading-attributes";
import type { BaseElement } from "../../../../base/base-element";

/**
 * h1要素の型定義
 * HTMLのh1（最上位見出し）要素を表現します
 * BaseElementを継承した専用の型
 */
export interface H1Element extends BaseElement<"h1", HeadingAttributes> {
  children?: HTMLNode[];
}

/**
 * h1要素のコンパニオンオブジェクト
 */
export const H1Element = {
  /**
   * 型ガード: 与えられたノードがH1Elementかどうかを判定
   */
  isH1Element(node: unknown): node is H1Element {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "h1"
    );
  },

  /**
   * ファクトリー: H1Elementを作成
   */
  create(
    attributes: Partial<HeadingAttributes> = {},
    children: HTMLNode[] = [],
  ): H1Element {
    // デフォルト値と提供された属性をマージ
    const fullAttributes: HeadingAttributes = {
      ...attributes,
    };

    return {
      type: "element",
      tagName: "h1",
      attributes: fullAttributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: H1Element): string | undefined {
    return element.attributes?.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: H1Element): string | undefined {
    return element.attributes?.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: H1Element): string | undefined {
    return element.attributes?.style;
  },
};
