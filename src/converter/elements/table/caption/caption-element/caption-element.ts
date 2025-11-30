/**
 * @fileoverview caption要素の型定義とコンパニオンオブジェクト
 */

import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import type { CaptionAttributes } from "../caption-attributes";
import type { BaseElement } from "../../../base/base-element";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

/**
 * caption要素の型定義
 *
 * テーブルのキャプション（説明文）を表すHTML要素です。
 * Figma FrameNodeに変換され、テキストやフローコンテンツを子要素として持ちます。
 *
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/caption
 */
export interface CaptionElement extends BaseElement<
  "caption",
  CaptionAttributes
> {
  /**
   * 子要素
   *
   * caption要素はフローコンテンツを子として持てます。
   */
  children: unknown[];
}

/**
 * CaptionElementコンパニオンオブジェクト
 *
 * CaptionElementの生成、検証、Figma変換を提供します。
 */
export const CaptionElement = {
  /**
   * CaptionElement型ガード
   *
   * 与えられたオブジェクトがCaptionElement型であるかを判定します。
   *
   * @param node - 判定対象のオブジェクト
   * @returns CaptionElementであればtrue
   *
   * @example
   * ```typescript
   * const caption = CaptionElement.create();
   * if (CaptionElement.isCaptionElement(caption)) {
   *   // captionはCaptionElement型として扱える
   * }
   * ```
   */
  isCaptionElement(node: unknown): node is CaptionElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "caption"
    );
  },

  /**
   * CaptionElement生成
   *
   * 新しいCaptionElementオブジェクトを生成します。
   * 属性は省略可能で、省略時は空のオブジェクトとして扱われます。
   *
   * @param attributes - caption要素の属性（オプショナル）
   * @returns 新しいCaptionElementオブジェクト
   *
   * @example
   * ```typescript
   * // デフォルト値で作成
   * const caption = CaptionElement.create();
   *
   * // id属性付きで作成
   * const captionWithId = CaptionElement.create({ id: "table-caption" });
   * ```
   */
  create(attributes: Partial<CaptionAttributes> = {}): CaptionElement {
    return {
      type: "element",
      tagName: "caption",
      attributes: attributes as CaptionAttributes,
      children: [],
    };
  },

  /**
   * Figma変換
   *
   * @param element - 変換対象のCaptionElement
   * @returns FigmaNodeConfig（FrameNode設定）
   */
  toFigmaNode(element: CaptionElement): FigmaNodeConfig {
    return toFigmaNodeWith(
      element,
      (el) => {
        const config = FigmaNode.createFrame("caption");
        return FigmaNodeConfig.applyHtmlElementDefaults(
          config,
          "caption",
          el.attributes,
        );
      },
      {
        applyCommonStyles: true,
      },
    );
  },

  /**
   * マッピング
   *
   * @param node - マッピング対象のオブジェクト
   * @returns FigmaNodeConfigまたはnull（変換失敗時）
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigmaWith(
      node,
      "caption",
      this.isCaptionElement,
      this.create,
      this.toFigmaNode,
    );
  },
};
