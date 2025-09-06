import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { BaseElement } from "../../../base/base-element/base-element";
import type { EmAttributes } from "../em-attributes";

/**
 * em要素の型定義
 * HTMLのem（強調）要素を表現します
 * BaseElementを継承した専用の型
 */
export interface EmElement extends BaseElement<"em", EmAttributes> {
  children?: HTMLNode[];
}

/**
 * em要素のコンパニオンオブジェクト
 */
export const EmElement = {
  /**
   * 型ガード: 与えられたノードがEmElementかどうかを判定
   */
  isEmElement(node: unknown): node is EmElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "em"
    );
  },

  /**
   * ファクトリー: EmElementを作成
   */
  create(
    attributes: Partial<EmAttributes> = {},
    children: HTMLNode[] = [],
  ): EmElement {
    // デフォルト値と提供された属性をマージ
    const fullAttributes: EmAttributes = {
      ...attributes,
    };

    return {
      type: "element",
      tagName: "em",
      attributes: fullAttributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: EmElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: EmElement): string | undefined {
    return element.attributes?.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: EmElement): string | undefined {
    return element.attributes?.style;
  },
};
