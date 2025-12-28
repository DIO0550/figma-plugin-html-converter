import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { BaseElement } from "../../../base/base-element/base-element";
import type { VarAttributes } from "../var-attributes";

/**
 * var要素の型定義
 * HTMLのvar（変数）要素を表現します
 * BaseElementを継承した専用の型
 */
export interface VarElement extends BaseElement<"var", VarAttributes> {
  children?: HTMLNode[];
}

/**
 * var要素のコンパニオンオブジェクト
 */
export const VarElement = {
  /**
   * 型ガード: 与えられたノードがVarElementかどうかを判定
   */
  isVarElement(node: unknown): node is VarElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "var"
    );
  },

  /**
   * ファクトリー: VarElementを作成
   */
  create(
    attributes: Partial<VarAttributes> = {},
    children: HTMLNode[] = [],
  ): VarElement {
    const fullAttributes: VarAttributes = {
      ...attributes,
    };

    return {
      type: "element",
      tagName: "var",
      attributes: fullAttributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: VarElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: VarElement): string | undefined {
    return element.attributes?.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: VarElement): string | undefined {
    return element.attributes?.style;
  },
};
