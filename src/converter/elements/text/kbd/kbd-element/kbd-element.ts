import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { BaseElement } from "../../../base/base-element/base-element";
import type { KbdAttributes } from "../kbd-attributes";

/**
 * kbd要素の型定義
 * HTMLのkbd（キーボード入力）要素を表現します
 * BaseElementを継承した専用の型
 */
export interface KbdElement extends BaseElement<"kbd", KbdAttributes> {
  children?: HTMLNode[];
}

/**
 * kbd要素のコンパニオンオブジェクト
 */
export const KbdElement = {
  /**
   * 型ガード: 与えられたノードがKbdElementかどうかを判定
   */
  isKbdElement(node: unknown): node is KbdElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "kbd"
    );
  },

  /**
   * ファクトリー: KbdElementを作成
   */
  create(
    attributes: Partial<KbdAttributes> = {},
    children: HTMLNode[] = [],
  ): KbdElement {
    const fullAttributes: KbdAttributes = {
      ...attributes,
    };

    return {
      type: "element",
      tagName: "kbd",
      attributes: fullAttributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: KbdElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: KbdElement): string | undefined {
    return element.attributes?.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: KbdElement): string | undefined {
    return element.attributes?.style;
  },
};
