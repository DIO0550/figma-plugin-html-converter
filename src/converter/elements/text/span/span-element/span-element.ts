import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { BaseElement } from "../../../base/base-element/base-element";
import type { SpanAttributes } from "../span-attributes";

/**
 * span要素の型定義
 * HTMLのspan（インライン）要素を表現します
 * BaseElementを継承した専用の型
 */
export interface SpanElement extends BaseElement<"span", SpanAttributes> {
  children?: HTMLNode[];
}

/**
 * span要素のコンパニオンオブジェクト
 */
export const SpanElement = {
  /**
   * 型ガード: 与えられたノードがSpanElementかどうかを判定
   */
  isSpanElement(node: unknown): node is SpanElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "span"
    );
  },

  /**
   * ファクトリー: SpanElementを作成
   */
  create(
    attributes: Partial<SpanAttributes> = {},
    children: HTMLNode[] = [],
  ): SpanElement {
    // デフォルト値と提供された属性をマージ
    const fullAttributes: SpanAttributes = {
      ...attributes,
    };

    return {
      type: "element",
      tagName: "span",
      attributes: fullAttributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: SpanElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: SpanElement): string | undefined {
    return element.attributes?.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: SpanElement): string | undefined {
    return element.attributes?.style;
  },
};
