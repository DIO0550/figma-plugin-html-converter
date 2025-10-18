/**
 * @fileoverview LI要素の定義とコンパニオンオブジェクト
 */

import { BaseElement } from "../../../base";
import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { LiAttributes } from "../li-attributes";
import { toAlpha, toRoman } from "../../utils/list-number-formatter";

/**
 * LI要素のインターフェース
 */
export interface LiElement extends BaseElement<"li"> {
  type: "element";
  tagName: "li";
  attributes: LiAttributes;
}

/**
 * リストコンテキスト
 * li要素が属するリストのタイプと番号を表す
 */
export interface ListContext {
  /** リストのタイプ（ul/ol） */
  listType: "ul" | "ol";
  /** アイテムのインデックス（0ベース） */
  index?: number;
  /** OLの場合の開始番号 */
  startNumber?: number;
  /** OLの場合のタイプ（1/a/A/i/I） */
  type?: "1" | "a" | "A" | "i" | "I";
  /** OLの場合の逆順フラグ */
  reversed?: boolean;
  /** リスト全体の要素数 */
  itemCount?: number;
}

/**
 * LI要素のコンパニオンオブジェクト
 */
export const LiElement = {
  /**
   * 与えられたノードがLiElementかどうかを判定
   */
  isLiElement(node: unknown): node is LiElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "li"
    );
  },

  /**
   * LiElementを作成
   */
  create(
    attributes: Partial<LiAttributes> = {},
    children: HTMLNode[] = [],
  ): LiElement {
    return {
      type: "element",
      tagName: "li",
      attributes: attributes as LiAttributes,
      children,
    };
  },

  /**
   * value属性から番号を取得
   */
  getValue(element: LiElement): number | undefined {
    if (!element.attributes || !element.attributes.value) {
      return undefined;
    }
    const parsed = parseInt(element.attributes.value, 10);
    if (!isNaN(parsed)) {
      return parsed;
    }
    return undefined;
  },

  /**
   * リスト番号を計算
   * @param context リストコンテキスト
   * @param element LI要素
   * @returns 実際のリスト番号
   */
  calculateItemNumber(
    context: ListContext,
    element: LiElement,
  ): number | undefined {
    // ul要素の場合は番号なし
    if (context.listType === "ul") {
      return undefined;
    }

    // value属性が指定されている場合はそれを使用
    const explicitValue = this.getValue(element);
    if (explicitValue !== undefined) {
      return explicitValue;
    }

    // インデックスから計算
    if (context.index !== undefined) {
      if (context.reversed) {
        // reversed属性の場合、startが未指定ならitemCountから開始
        const effectiveStart =
          context.startNumber !== undefined
            ? context.startNumber
            : context.itemCount || 1;
        return effectiveStart - context.index;
      } else {
        const startNumber = context.startNumber || 1;
        return startNumber + context.index;
      }
    }

    return 1;
  },

  /**
   * マーカーテキストを生成
   * @param context リストコンテキスト
   * @param element LI要素
   * @returns マーカーテキスト（例: "1.", "a.", "•"）
   */
  getMarkerText(context: ListContext, element: LiElement): string {
    if (context.listType === "ul") {
      return "•"; // バレット
    }

    const number = this.calculateItemNumber(context, element);
    if (number === undefined) {
      return "";
    }

    const type = context.type || "1";

    // 共通ユーティリティを使用して番号をフォーマット
    switch (type) {
      case "1":
        return `${number}.`;
      case "a":
        return `${toAlpha(number).toLowerCase()}.`;
      case "A":
        return `${toAlpha(number).toUpperCase()}.`;
      case "i":
        return `${toRoman(number).toLowerCase()}.`;
      case "I":
        return `${toRoman(number).toUpperCase()}.`;
      default:
        return `${number}.`;
    }
  },
};
