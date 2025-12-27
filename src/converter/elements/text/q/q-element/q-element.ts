import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { BaseElement } from "../../../base/base-element/base-element";
import type { QAttributes } from "../q-attributes";

/**
 * q要素の型定義
 * HTMLのq（インライン引用）要素を表現します
 * BaseElementを継承した専用の型
 */
export interface QElement extends BaseElement<"q", QAttributes> {
  children?: HTMLNode[];
}

/**
 * q要素のコンパニオンオブジェクト
 */
export const QElement = {
  /**
   * 型ガード: 与えられたノードがQElementかどうかを判定
   */
  isQElement(node: unknown): node is QElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "q"
    );
  },

  /**
   * ファクトリー: QElementを作成
   */
  create(
    attributes: Partial<QAttributes> = {},
    children: HTMLNode[] = [],
  ): QElement {
    const fullAttributes: QAttributes = {
      ...attributes,
    };

    return {
      type: "element",
      tagName: "q",
      attributes: fullAttributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: QElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: QElement): string | undefined {
    return element.attributes?.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: QElement): string | undefined {
    return element.attributes?.style;
  },

  /**
   * cite属性の取得
   */
  getCite(element: QElement): string | undefined {
    return element.attributes?.cite;
  },
};
