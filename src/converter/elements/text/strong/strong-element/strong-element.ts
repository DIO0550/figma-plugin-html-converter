import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { BaseElement } from "../../../base/base-element/base-element";
import type { StrongAttributes } from "../strong-attributes";

/**
 * strong要素の型定義
 * HTMLのstrong（強調）要素を表現します
 * BaseElementを継承した専用の型
 */
export interface StrongElement extends BaseElement<"strong", StrongAttributes> {
  children?: HTMLNode[];
}

/**
 * strong要素のコンパニオンオブジェクト
 */
export const StrongElement = {
  /**
   * 型ガード: 与えられたノードがStrongElementかどうかを判定
   */
  isStrongElement(node: unknown): node is StrongElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "strong"
    );
  },

  /**
   * ファクトリー: StrongElementを作成
   */
  create(
    attributes: Partial<StrongAttributes> = {},
    children: HTMLNode[] = [],
  ): StrongElement {
    // デフォルト値と提供された属性をマージ
    const fullAttributes: StrongAttributes = {
      ...attributes,
    };

    return {
      type: "element",
      tagName: "strong",
      attributes: fullAttributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: StrongElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: StrongElement): string | undefined {
    return element.attributes?.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: StrongElement): string | undefined {
    return element.attributes?.style;
  },
};
