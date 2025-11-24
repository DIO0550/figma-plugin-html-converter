import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import type { TfootAttributes } from "../tfoot-attributes";
import type { BaseElement } from "../../../base/base-element";
import type { TrElement } from "../../tr";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

/**
 * tfoot要素の型定義
 *
 * テーブルのフッターセクションを表すHTML要素です。
 * Figma FrameNodeに変換され、子要素のtr要素を縦方向に配置します。
 * tfoot要素は通常、td要素またはth要素を含むtr要素を子要素として持ちます。
 *
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/tfoot
 */
export interface TfootElement extends BaseElement<"tfoot", TfootAttributes> {
  /**
   * 子要素（行要素の配列）
   *
   * tfoot要素はtr要素のみを直接の子として持ちます。
   */
  children: TrElement[];
}

/**
 * TfootElementコンパニオンオブジェクト
 *
 * TfootElementの生成、検証、Figma変換を提供します。
 */
export const TfootElement = {
  /**
   * TfootElement型ガード
   *
   * 与えられたオブジェクトがTfootElement型であるかを判定します。
   *
   * @param node - 判定対象のオブジェクト
   * @returns TfootElementであればtrue
   *
   * @example
   * ```typescript
   * const tfoot = TfootElement.create();
   * if (TfootElement.isTfootElement(tfoot)) {
   *   // tfootはTfootElement型として扱える
   * }
   * ```
   */
  isTfootElement(node: unknown): node is TfootElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "tfoot"
    );
  },

  /**
   * TfootElement生成
   *
   * 新しいTfootElementオブジェクトを生成します。
   * 属性は省略可能で、省略時は空のオブジェクトとして扱われます。
   *
   * @param attributes - tfoot要素の属性（オプショナル）
   * @returns 新しいTfootElementオブジェクト
   *
   * @example
   * ```typescript
   * // デフォルト値で作成
   * const tfoot = TfootElement.create();
   *
   * // id属性付きで作成
   * const tfootWithId = TfootElement.create({ id: "table-footer" });
   * ```
   */
  create(attributes: Partial<TfootAttributes> = {}): TfootElement {
    return {
      type: "element",
      tagName: "tfoot",
      attributes: attributes as TfootAttributes,
      children: [],
    };
  },

  /**
   * Figma変換
   *
   * @param element - 変換対象のTfootElement
   * @returns FigmaNodeConfig（FrameNode設定）
   */
  toFigmaNode(element: TfootElement): FigmaNodeConfig {
    return toFigmaNodeWith(
      element,
      (el) => {
        const config = FigmaNode.createFrame("tfoot");
        return FigmaNodeConfig.applyHtmlElementDefaults(
          config,
          "tfoot",
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
      "tfoot",
      this.isTfootElement,
      this.create,
      this.toFigmaNode,
    );
  },
};
