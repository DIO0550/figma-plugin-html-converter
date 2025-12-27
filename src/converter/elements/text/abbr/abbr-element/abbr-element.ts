import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { BaseElement } from "../../../base/base-element/base-element";
import type { AbbrAttributes } from "../abbr-attributes";

/**
 * abbr要素の型定義
 * HTMLのabbr（略語）要素を表現します
 * BaseElementを継承した専用の型
 */
export interface AbbrElement extends BaseElement<"abbr", AbbrAttributes> {
  children?: HTMLNode[];
}

/**
 * abbr要素のコンパニオンオブジェクト
 */
export const AbbrElement = {
  /**
   * 型ガード: 与えられたノードがAbbrElementかどうかを判定
   */
  isAbbrElement(node: unknown): node is AbbrElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "abbr"
    );
  },

  /**
   * ファクトリー: AbbrElementを作成
   */
  create(
    attributes: Partial<AbbrAttributes> = {},
    children: HTMLNode[] = [],
  ): AbbrElement {
    const fullAttributes: AbbrAttributes = {
      ...attributes,
    };

    return {
      type: "element",
      tagName: "abbr",
      attributes: fullAttributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: AbbrElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: AbbrElement): string | undefined {
    return element.attributes?.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: AbbrElement): string | undefined {
    return element.attributes?.style;
  },

  /**
   * title属性の取得（略語の説明）
   */
  getTitle(element: AbbrElement): string | undefined {
    return element.attributes?.title;
  },
};
