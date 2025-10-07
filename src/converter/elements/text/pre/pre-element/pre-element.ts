import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { PreAttributes } from "../pre-attributes";
import type { BaseElement } from "../../../base/base-element";

/**
 * pre要素の型定義
 * HTMLのpre（プリフォーマットテキスト）要素を表現します
 * BaseElementを継承した専用の型
 */
export interface PreElement extends BaseElement<"pre", PreAttributes> {
  children?: HTMLNode[];
}

/**
 * pre要素のコンパニオンオブジェクト
 */
export const PreElement = {
  /**
   * 型ガード: 与えられたノードがPreElementかどうかを判定
   */
  isPreElement(node: unknown): node is PreElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "pre"
    );
  },

  /**
   * ファクトリー: PreElementを作成
   */
  create(
    attributes: Partial<PreAttributes> = {},
    children: HTMLNode[] = [],
  ): PreElement {
    // デフォルト値と提供された属性をマージ
    const fullAttributes: PreAttributes = {
      ...attributes,
    };

    return {
      type: "element",
      tagName: "pre",
      attributes: fullAttributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: PreElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: PreElement): string | undefined {
    return element.attributes?.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: PreElement): string | undefined {
    return element.attributes?.style;
  },
};
