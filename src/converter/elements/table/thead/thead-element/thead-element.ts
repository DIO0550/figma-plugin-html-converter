import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import type { TheadAttributes } from "../thead-attributes";
import type { BaseElement } from "../../../base/base-element";
import type { TrElement } from "../../tr";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

/**
 * thead要素の型定義
 *
 * テーブルのヘッダーセクションを表すHTML要素です。
 * Figma FrameNodeに変換され、子要素のtr要素を縦方向に配置します。
 * thead要素は通常、th要素を含むtr要素を子要素として持ちます。
 *
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/thead
 */
export interface TheadElement extends BaseElement<"thead", TheadAttributes> {
  /**
   * 子要素（行要素の配列）
   *
   * thead要素はtr要素のみを直接の子として持ちます。
   */
  children: TrElement[];
}

/**
 * TheadElementコンパニオンオブジェクト
 *
 * TheadElementの生成、検証、Figma変換を提供します。
 */
export const TheadElement = {
  /**
   * TheadElement型ガード
   *
   * 与えられたオブジェクトがTheadElement型であるかを判定します。
   *
   * @param node - 判定対象のオブジェクト
   * @returns TheadElementであればtrue
   *
   * @example
   * ```typescript
   * const thead = TheadElement.create();
   * if (TheadElement.isTheadElement(thead)) {
   *   // theadはTheadElement型として扱える
   * }
   * ```
   */
  isTheadElement(node: unknown): node is TheadElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "thead"
    );
  },

  /**
   * TheadElement生成
   *
   * 新しいTheadElementオブジェクトを生成します。
   * 属性は省略可能で、省略時は空のオブジェクトとして扱われます。
   *
   * @param attributes - thead要素の属性（オプショナル）
   * @returns 新しいTheadElementオブジェクト
   *
   * @example
   * ```typescript
   * // デフォルト値で作成
   * const thead = TheadElement.create();
   *
   * // id属性付きで作成
   * const theadWithId = TheadElement.create({ id: "table-header" });
   * ```
   */
  create(attributes: Partial<TheadAttributes> = {}): TheadElement {
    return {
      type: "element",
      tagName: "thead",
      attributes: attributes as TheadAttributes,
      children: [],
    };
  },

  /**
   * Figma変換
   *
   * @param element - 変換対象のTheadElement
   * @returns FigmaNodeConfig（FrameNode設定）
   */
  toFigmaNode(element: TheadElement): FigmaNodeConfig {
    return toFigmaNodeWith(
      element,
      (el) => {
        const config = FigmaNode.createFrame("thead");
        return FigmaNodeConfig.applyHtmlElementDefaults(
          config,
          "thead",
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
      "thead",
      this.isTheadElement,
      this.create,
      this.toFigmaNode,
    );
  },
};
