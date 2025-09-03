import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { PAttributes } from "../p-attributes";
import type { BaseElement } from "../../../base/base-element";

/**
 * p要素の型定義
 * HTMLのp（段落）要素を表現します
 * BaseElementを継承した専用の型
 */
export interface PElement extends BaseElement<"p", PAttributes> {
  attributes: PAttributes;
  children?: HTMLNode[];
}

/**
 * p要素のコンパニオンオブジェクト
 */
export const PElement = {
  /**
   * 型ガード: 与えられたノードがPElementかどうかを判定
   */
  isPElement(node: unknown): node is PElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "p"
    );
  },

  /**
   * ファクトリー: PElementを作成
   */
  create(
    attributes: Partial<PAttributes> = {},
    children: HTMLNode[] = [],
  ): PElement {
    // デフォルト値と提供された属性をマージ
    const fullAttributes: PAttributes = {
      ...attributes,
    };

    return {
      type: "element",
      tagName: "p",
      attributes: fullAttributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: PElement): string | undefined {
    return element.attributes.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: PElement): string | undefined {
    return element.attributes.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: PElement): string | undefined {
    return element.attributes.style;
  },
};
