import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { BaseElement } from "../../../base/base-element/base-element";
import type { AAttributes } from "../a-attributes/a-attributes";

/**
 * a要素の型定義
 * HTMLのアンカー要素（リンク）を表す
 */
export interface AElement extends BaseElement<"a", AAttributes> {
  children?: HTMLNode[];
}

/**
 * a要素のコンパニオンオブジェクト
 */
export const AElement = {
  /**
   * 型ガード: 与えられたノードがAElementかどうかを判定
   */
  isAElement(node: unknown): node is AElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "a"
    );
  },

  /**
   * ファクトリー: AElementを作成
   */
  create(
    attributes: Partial<AAttributes> = {},
    children: HTMLNode[] = [],
  ): AElement {
    // デフォルト値と提供された属性をマージ
    const fullAttributes: AAttributes = {
      ...attributes,
    };

    return {
      type: "element",
      tagName: "a",
      attributes: fullAttributes,
      children,
    };
  },

  /**
   * href属性の取得
   */
  getHref(element: AElement): string | undefined {
    return element.attributes?.href;
  },

  /**
   * target属性の取得
   */
  getTarget(element: AElement): string | undefined {
    return element.attributes?.target;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: AElement): string | undefined {
    return element.attributes?.style;
  },

  /**
   * 外部リンクかどうか判定
   */
  isExternalLink(element: AElement): boolean {
    const href = element.attributes?.href;
    if (!href) return false;

    return (
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("//")
    );
  },

  /**
   * アンカーリンクかどうか判定
   */
  isAnchorLink(element: AElement): boolean {
    const href = element.attributes?.href;
    return !!href && href.startsWith("#");
  },
};
