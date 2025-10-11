import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { MarkAttributes } from "../mark-attributes";
import type { BaseElement } from "../../../base/base-element";

/**
 * mark要素の型定義
 * HTMLのmark（ハイライトテキスト）要素を表現します
 * BaseElementを継承した専用の型
 */
export interface MarkElement extends BaseElement<"mark", MarkAttributes> {
  children?: HTMLNode[];
}

/**
 * mark要素のコンパニオンオブジェクト
 */
export const MarkElement = {
  /**
   * 型ガード: 与えられたノードがMarkElementかどうかを判定
   */
  isMarkElement(node: unknown): node is MarkElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "mark"
    );
  },

  /**
   * ファクトリー: MarkElementを作成
   */
  create(
    attributes: MarkAttributes = {},
    children: HTMLNode[] = [],
  ): MarkElement {
    return {
      type: "element",
      tagName: "mark",
      attributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: MarkElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: MarkElement): string | undefined {
    return element.attributes?.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: MarkElement): string | undefined {
    return element.attributes?.style;
  },
};
