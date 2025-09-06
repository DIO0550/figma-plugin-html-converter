import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { BaseElement } from "../../../base/base-element/base-element";
import type { IAttributes } from "../i-attributes";

/**
 * i要素の型定義
 * HTMLのi（斜体）要素を表現します
 * BaseElementを継承した専用の型
 */
export interface IElement extends BaseElement<"i", IAttributes> {
  children?: HTMLNode[];
}

/**
 * i要素のコンパニオンオブジェクト
 */
export const IElement = {
  /**
   * 型ガード: 与えられたノードがIElementかどうかを判定
   */
  isIElement(node: unknown): node is IElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "i"
    );
  },

  /**
   * ファクトリー: IElementを作成
   */
  create(
    attributes: Partial<IAttributes> = {},
    children: HTMLNode[] = [],
  ): IElement {
    // デフォルト値と提供された属性をマージ
    const fullAttributes: IAttributes = {
      ...attributes,
    };

    return {
      type: "element",
      tagName: "i",
      attributes: fullAttributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: IElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: IElement): string | undefined {
    return element.attributes?.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: IElement): string | undefined {
    return element.attributes?.style;
  },
};
