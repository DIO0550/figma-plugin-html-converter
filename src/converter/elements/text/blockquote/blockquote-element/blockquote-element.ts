import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { BlockquoteAttributes } from "../blockquote-attributes";
import type { BaseElement } from "../../../base/base-element";

/**
 * blockquote要素の型定義
 * HTMLのblockquote（引用ブロック）要素を表現します
 * BaseElementを継承した専用の型
 */
export interface BlockquoteElement
  extends BaseElement<"blockquote", BlockquoteAttributes> {
  children?: HTMLNode[];
}

/**
 * blockquote要素のコンパニオンオブジェクト
 */
export const BlockquoteElement = {
  /**
   * 型ガード: 与えられたノードがBlockquoteElementかどうかを判定
   */
  isBlockquoteElement(node: unknown): node is BlockquoteElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "blockquote"
    );
  },

  /**
   * ファクトリー: BlockquoteElementを作成
   */
  create(
    attributes: Partial<BlockquoteAttributes> = {},
    children: HTMLNode[] = [],
  ): BlockquoteElement {
    // デフォルト値と提供された属性をマージ
    const fullAttributes: BlockquoteAttributes = {
      ...attributes,
    };

    return {
      type: "element",
      tagName: "blockquote",
      attributes: fullAttributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: BlockquoteElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: BlockquoteElement): string | undefined {
    return element.attributes?.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: BlockquoteElement): string | undefined {
    return element.attributes?.style;
  },

  /**
   * cite属性の取得
   */
  getCite(element: BlockquoteElement): string | undefined {
    return element.attributes?.cite;
  },
};
