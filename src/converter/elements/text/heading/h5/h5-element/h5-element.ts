import type { HTMLNode } from "../../../../../models/html-node/html-node";
import type { HeadingAttributes } from "../../heading-attributes";
import type { BaseElement } from "../../../../base/base-element/base-element";

/**
 * h5要素の型定義
 * HTMLのh5（第5レベル見出し）要素を表現します
 * BaseElementを継承した専用の型
 */
export interface H5Element extends BaseElement<"h5", HeadingAttributes> {
  children?: HTMLNode[];
}

/**
 * h5要素のコンパニオンオブジェクト
 */
export const H5Element = {
  /**
   * 型ガード: 与えられたノードがH5Elementかどうかを判定
   */
  isH5Element(node: unknown): node is H5Element {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "h5"
    );
  },

  /**
   * ファクトリー: H5Elementを作成
   */
  create(
    attributes: Partial<HeadingAttributes> = {},
    children: HTMLNode[] = [],
  ): H5Element {
    // デフォルト値と提供された属性をマージ
    const fullAttributes: HeadingAttributes = {
      ...attributes,
    };

    return {
      type: "element",
      tagName: "h5",
      attributes: fullAttributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: H5Element): string | undefined {
    return element.attributes?.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: H5Element): string | undefined {
    return element.attributes?.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: H5Element): string | undefined {
    return element.attributes?.style;
  },
};
