import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { BaseElement } from "../../../base/base-element/base-element";
import type { CiteAttributes } from "../cite-attributes";

/**
 * cite要素の型定義
 * HTMLのcite（引用元）要素を表現します
 * BaseElementを継承した専用の型
 */
export interface CiteElement extends BaseElement<"cite", CiteAttributes> {
  children?: HTMLNode[];
}

/**
 * cite要素のコンパニオンオブジェクト
 */
export const CiteElement = {
  /**
   * 型ガード: 与えられたノードがCiteElementかどうかを判定
   */
  isCiteElement(node: unknown): node is CiteElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "cite"
    );
  },

  /**
   * ファクトリー: CiteElementを作成
   */
  create(
    attributes: Partial<CiteAttributes> = {},
    children: HTMLNode[] = [],
  ): CiteElement {
    const fullAttributes: CiteAttributes = {
      ...attributes,
    };

    return {
      type: "element",
      tagName: "cite",
      attributes: fullAttributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: CiteElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: CiteElement): string | undefined {
    return element.attributes?.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: CiteElement): string | undefined {
    return element.attributes?.style;
  },
};
