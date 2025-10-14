/**
 * @fileoverview LI要素の定義とコンパニオンオブジェクト
 */

import { BaseElement } from "../../../base";
import type { LiAttributes } from "../li-attributes";

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
    children: BaseElement["children"] = [],
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
        // TODO: 逆順の場合、全体の要素数が必要
        // 現在は簡易的に実装
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

    // OlElementの変換関数を使用するために、動的にインポートする必要がある
    // ここでは簡易的な実装
    switch (type) {
      case "1":
        return `${number}.`;
      case "a":
        return `${this.toAlpha(number).toLowerCase()}.`;
      case "A":
        return `${this.toAlpha(number).toUpperCase()}.`;
      case "i":
        return `${this.toRoman(number).toLowerCase()}.`;
      case "I":
        return `${this.toRoman(number).toUpperCase()}.`;
      default:
        return `${number}.`;
    }
  },

  /**
   * 数字をアルファベットに変換（簡易実装）
   */
  toAlpha(num: number): string {
    let result = "";
    let n = num - 1;
    while (n >= 0) {
      result = String.fromCharCode(65 + (n % 26)) + result;
      n = Math.floor(n / 26) - 1;
    }
    return result;
  },

  /**
   * 数字をローマ数字に変換（簡易実装）
   */
  toRoman(num: number): string {
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const symbols = [
      "M",
      "CM",
      "D",
      "CD",
      "C",
      "XC",
      "L",
      "XL",
      "X",
      "IX",
      "V",
      "IV",
      "I",
    ];

    let result = "";
    let n = num;

    for (let i = 0; i < values.length; i++) {
      while (n >= values[i]) {
        result += symbols[i];
        n -= values[i];
      }
    }

    return result;
  },
};
