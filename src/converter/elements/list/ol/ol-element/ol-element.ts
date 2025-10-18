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
   * @param element 開始番号を取得する対象のOL要素
   * @returns start属性の値（整数）。未指定または無効な値の場合は1を返す
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
   * @param element リストタイプを取得する対象のOL要素
   * @returns OL要素のtype属性の値（"1": 数字, "a": 小文字アルファベット, "A": 大文字アルファベット, "i": 小文字ローマ数字, "I": 大文字ローマ数字）。未指定の場合は"1"を返す
   */
  getListType(element: OlElement): "1" | "a" | "A" | "i" | "I" {
    if (!element.attributes || !element.attributes.type) {
      return "1";
    }
    return element.attributes.type;
  },

  /**
   * 逆順かどうかを判定
   * @param element 判定対象のOL要素
   * @returns reversed属性が指定されていればtrue、そうでなければfalse
   */
  isReversed(element: OlElement): boolean {
    if (!element.attributes) {
      return false;
    }
    return element.attributes.reversed !== undefined;
  },

  /**
   * リスト番号をフォーマット
   * @param index リスト項目のインデックス（1から始まる番号）
   * @param type リストのタイプ（"1": 数字, "a": 小文字アルファベット, "A": 大文字アルファベット, "i": 小文字ローマ数字, "I": 大文字ローマ数字）
   * @returns フォーマットされたリスト番号の文字列
   */
  formatNumber(index: number, type: "1" | "a" | "A" | "i" | "I"): string {
    switch (type) {
      case "1":
        return `${index}`;
      case "a":
        return toAlpha(index, true);
      case "A":
        return toAlpha(index);
      case "i":
        return toRoman(index, true);
      case "I":
        return toRoman(index);
      default:
        return `${index}`;
    }
  },
};
