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
      const startNumber = context.startNumber || 1;
      if (context.reversed) {
        // 制限事項: 逆順（reversed）リストの場合、正しい番号付けにはリスト全体の要素数（itemCount）が必要です。
        // 現在は itemCount を受け取っていないため、HTML仕様通りの番号付けができません。
        //
        // 期待される動作: reversed属性がtrueの場合、番号は startNumber から始まり、リストの末尾から順に減少します。
        // 例: start=5, itemCount=3 の場合、各liの番号は 5, 4, 3 となるべきですが、
        //     現状は index のみで計算しています。
        //
        // 実装の差異: 現在は startNumber - context.index で簡易計算しており、itemCountが考慮されていません。
        //             このため、リスト全体の要素数によって開始番号が変わる正しい動作とは異なります。
        //
        // TODO: ListContextに itemCount（リスト全体の要素数）フィールドを追加し、
        //       正しい逆順番号付けを実装すること。
        //       正しい計算式: startNumber - (itemCount - 1 - context.index)
        return startNumber - context.index;
      } else {
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
