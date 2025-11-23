import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import type { TbodyAttributes } from "../tbody-attributes";
import type { BaseElement } from "../../../base/base-element";
import type { TrElement } from "../../tr";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

/**
 * tbody要素の型定義
 *
 * テーブルのボディセクションを表すHTML要素です。
 * Figma FrameNodeに変換され、子要素のtr要素を縦方向に配置します。
 * tbody要素は通常、td要素またはth要素を含むtr要素を子要素として持ちます。
 *
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/tbody
 */
export interface TbodyElement extends BaseElement<"tbody", TbodyAttributes> {
  /**
   * 子要素（行要素の配列）
   *
   * tbody要素はtr要素のみを直接の子として持ちます。
   */
  children: TrElement[];
}

/**
 * TbodyElementコンパニオンオブジェクト
 *
 * TbodyElementの生成、検証、Figma変換を提供します。
 */
export const TbodyElement = {
  /**
   * TbodyElement型ガード
   *
   * 与えられたオブジェクトがTbodyElement型であるかを判定します。
   *
   * @param node - 判定対象のオブジェクト
   * @returns TbodyElementであればtrue
   *
   * @example
   * ```typescript
   * const tbody = TbodyElement.create();
   * if (TbodyElement.isTbodyElement(tbody)) {
   *   // tbodyはTbodyElement型として扱える
   * }
   * ```
   */
  isTbodyElement(node: unknown): node is TbodyElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "tbody"
    );
  },

  /**
   * TbodyElement生成
   *
   * 新しいTbodyElementオブジェクトを生成します。
   * 属性は省略可能で、省略時は空のオブジェクトとして扱われます。
   *
   * @param attributes - tbody要素の属性（オプショナル）
   * @returns 新しいTbodyElementオブジェクト
   *
   * @example
   * ```typescript
   * // デフォルト値で作成
   * const tbody = TbodyElement.create();
   *
   * // id属性付きで作成
   * const tbodyWithId = TbodyElement.create({ id: "table-body" });
   * ```
   */
  create(attributes: Partial<TbodyAttributes> = {}): TbodyElement {
    return {
      type: "element",
      tagName: "tbody",
      attributes: attributes as TbodyAttributes,
      children: [],
    };
  },

  /**
   * Figma変換
   *
   * @param element - 変換対象のTbodyElement
   * @returns FigmaNodeConfig（FrameNode設定）
   */
  toFigmaNode(element: TbodyElement): FigmaNodeConfig {
    return toFigmaNodeWith(
      element,
      (el) => {
        const config = FigmaNode.createFrame("tbody");
        return FigmaNodeConfig.applyHtmlElementDefaults(
          config,
          "tbody",
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
      "tbody",
      this.isTbodyElement,
      this.create,
      this.toFigmaNode,
    );
  },
};
