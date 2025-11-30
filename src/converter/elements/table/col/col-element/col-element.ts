/**
 * @fileoverview col要素の型定義とコンパニオンオブジェクト
 */

import type { FigmaNodeConfig } from "../../../../models/figma-node";
import type { ColAttributes } from "../col-attributes";
import type { BaseElement } from "../../../base/base-element";
import { getSpanValue } from "../../utils";

/**
 * col要素の型定義
 *
 * テーブルの列を定義するHTML要素です。
 * 空要素のため子要素を持たず、Figmaでは視覚的ノードを生成しません。
 * 列のメタデータ（幅、スタイル）を保持します。
 *
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/col
 */
export interface ColElement extends BaseElement<"col", ColAttributes> {
  /**
   * 子要素（空要素のため常に空配列）
   */
  children: never[];
}

/**
 * ColElementコンパニオンオブジェクト
 *
 * ColElementの生成、検証、Figma変換を提供します。
 */
export const ColElement = {
  /**
   * ColElement型ガード
   *
   * 与えられたオブジェクトがColElement型であるかを判定します。
   *
   * @param node - 判定対象のオブジェクト
   * @returns ColElementであればtrue
   *
   * @example
   * ```typescript
   * const col = ColElement.create({ span: 2 });
   * if (ColElement.isColElement(col)) {
   *   // colはColElement型として扱える
   * }
   * ```
   */
  isColElement(node: unknown): node is ColElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "col"
    );
  },

  /**
   * ColElement生成
   *
   * 新しいColElementオブジェクトを生成します。
   * 属性は省略可能で、省略時は空のオブジェクトとして扱われます。
   *
   * @param attributes - col要素の属性（オプショナル）
   * @returns 新しいColElementオブジェクト
   *
   * @example
   * ```typescript
   * // デフォルト値で作成
   * const col = ColElement.create();
   *
   * // span属性付きで作成
   * const colWithSpan = ColElement.create({ span: 2 });
   * ```
   */
  create(attributes: Partial<ColAttributes> = {}): ColElement {
    return {
      type: "element",
      tagName: "col",
      attributes: attributes as ColAttributes,
      children: [] as never[],
    };
  },

  /**
   * Figma変換
   *
   * col要素はメタデータのみを保持し、視覚的なFigmaノードを生成しません。
   * 常にnullを返します。
   *
   * @param _element - 変換対象のColElement（未使用）
   * @returns null（Figmaノードなし）
   */
  toFigmaNode(_element: ColElement): FigmaNodeConfig | null {
    // col要素はメタデータのみでFigmaノードを生成しない
    return null;
  },

  /**
   * マッピング
   *
   * col要素はメタデータのみのため、常にnullを返します。
   *
   * @param node - マッピング対象のオブジェクト
   * @returns null（Figmaノードなし）
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    if (!this.isColElement(node)) {
      return null;
    }
    return this.toFigmaNode(node);
  },

  /**
   * span属性の取得
   *
   * col要素のspan属性を数値として取得します。
   * 未設定の場合はデフォルト値の1を返します。
   *
   * @param element - ColElement
   * @returns span値（1以上の整数）
   */
  getSpan(element: ColElement): number {
    return getSpanValue(element);
  },

  /**
   * width属性の取得
   *
   * col要素のwidth属性を文字列として取得します。
   * 数値の場合はpx単位の文字列に変換します。
   *
   * @param element - ColElement
   * @returns width値（文字列）またはundefined
   */
  getWidth(element: ColElement): string | undefined {
    const width = element.attributes?.width;
    if (width === undefined) {
      return undefined;
    }
    return typeof width === "number" ? `${width}px` : width;
  },
};
