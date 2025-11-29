/**
 * @fileoverview colgroup要素の型定義とコンパニオンオブジェクト
 */

import type { FigmaNodeConfig } from "../../../../models/figma-node";
import type { ColgroupAttributes } from "../colgroup-attributes";
import type { BaseElement } from "../../../base/base-element";
import { ColElement } from "../../col";

/**
 * colgroup要素の型定義
 *
 * テーブルの列グループを定義するHTML要素です。
 * col要素を子として持つか、span属性で列数を指定します。
 * Figmaでは視覚的ノードを生成しません（メタデータ要素）。
 *
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/colgroup
 */
export interface ColgroupElement extends BaseElement<
  "colgroup",
  ColgroupAttributes
> {
  /**
   * 子要素（col要素の配列）
   */
  children: ColElement[];
}

/**
 * ColgroupElementコンパニオンオブジェクト
 *
 * ColgroupElementの生成、検証、Figma変換を提供します。
 */
export const ColgroupElement = {
  /**
   * ColgroupElement型ガード
   *
   * 与えられたオブジェクトがColgroupElement型であるかを判定します。
   *
   * @param node - 判定対象のオブジェクト
   * @returns ColgroupElementであればtrue
   *
   * @example
   * ```typescript
   * const colgroup = ColgroupElement.create({ span: 2 });
   * if (ColgroupElement.isColgroupElement(colgroup)) {
   *   // colgroupはColgroupElement型として扱える
   * }
   * ```
   */
  isColgroupElement(node: unknown): node is ColgroupElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "colgroup"
    );
  },

  /**
   * ColgroupElement生成
   *
   * 新しいColgroupElementオブジェクトを生成します。
   * 属性は省略可能で、省略時は空のオブジェクトとして扱われます。
   *
   * @param attributes - colgroup要素の属性（オプショナル）
   * @returns 新しいColgroupElementオブジェクト
   *
   * @example
   * ```typescript
   * // デフォルト値で作成
   * const colgroup = ColgroupElement.create();
   *
   * // span属性付きで作成
   * const colgroupWithSpan = ColgroupElement.create({ span: 3 });
   * ```
   */
  create(attributes: Partial<ColgroupAttributes> = {}): ColgroupElement {
    return {
      type: "element",
      tagName: "colgroup",
      attributes: attributes as ColgroupAttributes,
      children: [],
    };
  },

  /**
   * 子要素付きColgroupElement生成
   *
   * col要素を子として持つColgroupElementを生成します。
   *
   * @param attributes - colgroup要素の属性
   * @param children - col要素の配列
   * @returns 新しいColgroupElementオブジェクト
   *
   * @example
   * ```typescript
   * const col1 = ColElement.create({ span: 1 });
   * const col2 = ColElement.create({ span: 2 });
   * const colgroup = ColgroupElement.createWithChildren({}, [col1, col2]);
   * ```
   */
  createWithChildren(
    attributes: Partial<ColgroupAttributes> = {},
    children: ColElement[] = [],
  ): ColgroupElement {
    return {
      type: "element",
      tagName: "colgroup",
      attributes: attributes as ColgroupAttributes,
      children,
    };
  },

  /**
   * Figma変換
   *
   * colgroup要素はメタデータのみを保持し、視覚的なFigmaノードを生成しません。
   * 常にnullを返します。
   *
   * @param _element - 変換対象のColgroupElement（未使用）
   * @returns null（Figmaノードなし）
   */
  toFigmaNode(_element: ColgroupElement): FigmaNodeConfig | null {
    // colgroup要素はメタデータのみでFigmaノードを生成しない
    return null;
  },

  /**
   * マッピング
   *
   * colgroup要素はメタデータのみのため、常にnullを返します。
   *
   * @param node - マッピング対象のオブジェクト
   * @returns null（Figmaノードなし）
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    if (!this.isColgroupElement(node)) {
      return null;
    }
    return this.toFigmaNode(node);
  },

  /**
   * span属性の取得
   *
   * colgroup要素のspan属性を数値として取得します。
   * 未設定の場合はデフォルト値の1を返します。
   *
   * @param element - ColgroupElement
   * @returns span値（1以上の整数）
   */
  getSpan(element: ColgroupElement): number {
    const span = element.attributes?.span;
    if (span === undefined) {
      return 1;
    }
    const parsed = typeof span === "string" ? parseInt(span, 10) : span;
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  },

  /**
   * 列数の取得
   *
   * colgroupが管理する総列数を取得します。
   * - 子col要素がある場合: 各colのspanの合計
   * - 子col要素がない場合: span属性の値（デフォルト1）
   *
   * @param element - ColgroupElement
   * @returns 総列数
   */
  getColumnCount(element: ColgroupElement): number {
    const children = element.children ?? [];

    if (children.length === 0) {
      // 子要素がない場合はspan属性を使用
      return this.getSpan(element);
    }

    // 子col要素のspanを合計
    return children.reduce((total, col) => {
      if (ColElement.isColElement(col)) {
        return total + ColElement.getSpan(col);
      }
      return total + 1; // 不明な子要素は1列としてカウント
    }, 0);
  },
};
