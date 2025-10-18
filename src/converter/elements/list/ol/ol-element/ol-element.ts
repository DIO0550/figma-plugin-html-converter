/**
 * @fileoverview OL要素の定義とコンパニオンオブジェクト
 */

import { BaseElement } from "../../../base";
import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { OlAttributes } from "../ol-attributes";
import { toAlpha, toRoman } from "../../utils/list-number-formatter";

/**
 * OL要素のインターフェース
 */
export interface OlElement extends BaseElement<"ol"> {
  type: "element";
  tagName: "ol";
  attributes: OlAttributes;
}

/**
 * OL要素のコンパニオンオブジェクト
 */
export const OlElement = {
  /**
   * 与えられたノードがOlElementかどうかを判定
   */
  isOlElement(node: unknown): node is OlElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "ol"
    );
  },

  /**
   * OlElementを作成
   */
  create(
    attributes: Partial<OlAttributes> = {},
    children: HTMLNode[] = [],
  ): OlElement {
    return {
      type: "element",
      tagName: "ol",
      attributes: attributes as OlAttributes,
      children,
    };
  },

  /**
   * 開始番号を取得
   */
  getStartNumber(element: OlElement): number {
    // 属性が存在しない場合はデフォルト値を返す
    if (!element.attributes || !element.attributes.start) {
      return 1;
    }

    const parsed = parseInt(element.attributes.start, 10);
    if (!isNaN(parsed)) {
      return parsed;
    }
    return 1;
  },

  /**
   * リストタイプを取得
   */
  getListType(element: OlElement): "1" | "a" | "A" | "i" | "I" {
    if (!element.attributes || !element.attributes.type) {
      return "1";
    }
    return element.attributes.type;
  },

  /**
   * 逆順かどうかを判定
   */
  isReversed(element: OlElement): boolean {
    if (!element.attributes) {
      return false;
    }
    return element.attributes.reversed !== undefined;
  },

  /**
   * リスト番号をフォーマット
   */
  formatNumber(index: number, type: "1" | "a" | "A" | "i" | "I"): string {
    switch (type) {
      case "1":
        return `${index}`;
      case "a":
        return toAlpha(index).toLowerCase();
      case "A":
        return toAlpha(index).toUpperCase();
      case "i":
        return toRoman(index).toLowerCase();
      case "I":
        return toRoman(index).toUpperCase();
      default:
        return `${index}`;
    }
  },
};
