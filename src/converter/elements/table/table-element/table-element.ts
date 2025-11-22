/**
 * @fileoverview table要素の実装
 */

import { FigmaNodeConfig, FigmaNode } from "../../../models/figma-node";
import type { TableAttributes } from "../table-attributes";
import type { BaseElement } from "../../base/base-element";
import type { TrElement } from "../tr/tr-element";
import { mapToFigmaWith } from "../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../utils/to-figma-node-with";

/**
 * table要素の型定義
 *
 * テーブル全体のコンテナを表すHTML要素です。
 * Figma FrameNodeに変換され、子要素のtr要素を縦方向（VERTICAL）に配置します。
 *
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/table
 */
export interface TableElement extends BaseElement<"table", TableAttributes> {
  /**
   * 子要素（行要素の配列）
   *
   * table要素はtr要素のみを直接の子として持ちます。
   */
  children: TrElement[];
}

/**
 * TableElementコンパニオンオブジェクト
 *
 * TableElementの生成、検証、Figma変換を提供します。
 */
export const TableElement = {
  /**
   * TableElement型ガード
   *
   * 与えられたオブジェクトがTableElement型であるかを判定します。
   *
   * @param node - 判定対象のオブジェクト
   * @returns TableElementであればtrue
   *
   * @example
   * ```typescript
   * const table = TableElement.create();
   * if (TableElement.isTableElement(table)) {
   *   // tableはTableElement型として扱える
   * }
   * ```
   */
  isTableElement(node: unknown): node is TableElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "table"
    );
  },

  /**
   * TableElement生成
   *
   * 新しいTableElementオブジェクトを生成します。
   * 属性は省略可能で、省略時は空のオブジェクトとして扱われます。
   *
   * @param attributes - table要素の属性（オプショナル）
   * @returns 新しいTableElementオブジェクト
   *
   * @example
   * ```typescript
   * // デフォルト値で作成
   * const table = TableElement.create();
   *
   * // border属性付きで作成
   * const tableWithBorder = TableElement.create({ border: "1" });
   *
   * // 複数の属性で作成
   * const styledTable = TableElement.create({
   *   border: "1",
   *   class: "my-table",
   *   id: "data-table"
   * });
   * ```
   */
  create(attributes: Partial<TableAttributes> = {}): TableElement {
    return {
      type: "element",
      tagName: "table",
      attributes: attributes as TableAttributes,
      children: [],
    };
  },

  /**
   * Figma FrameNodeへ変換
   *
   * TableElementをFigma FrameNodeに変換します。
   * Auto LayoutはVERTICALモードで設定され、tr要素が縦方向に配置されます。
   *
   * @param element - 変換対象のTableElement
   * @returns FigmaNodeConfig（FrameNode設定）
   *
   * @example
   * ```typescript
   * const table = TableElement.create();
   * const config = TableElement.toFigmaNode(table);
   * // config.node.type === "FRAME"
   * // config.node.layoutMode === "VERTICAL"
   * ```
   */
  toFigmaNode(element: TableElement): FigmaNodeConfig {
    return toFigmaNodeWith(
      element,
      (el) => {
        let config = FigmaNode.createFrame("table");
        config = FigmaNodeConfig.applyHtmlElementDefaults(
          config,
          "table",
          el.attributes,
        );

        // Auto Layout設定（縦方向配置）
        // table要素は常にVERTICALレイアウトで子要素（tr）を配置
        config.layoutMode = "VERTICAL";
        config.primaryAxisAlignItems = "MIN";
        config.counterAxisAlignItems = "MIN";
        config.itemSpacing = 0;

        return config;
      },
      {
        applyCommonStyles: true,
      },
    );
  },

  /**
   * マッピング
   *
   * 未知のオブジェクトをTableElementとして解釈し、Figmaノードに変換します。
   * 型検証に失敗した場合はnullを返します。
   *
   * @param node - マッピング対象のオブジェクト
   * @returns FigmaNodeConfigまたはnull（変換失敗時）
   *
   * @example
   * ```typescript
   * const htmlNode = { type: "element", tagName: "table", children: [] };
   * const config = TableElement.mapToFigma(htmlNode);
   * if (config) {
   *   // 変換成功
   * }
   * ```
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigmaWith(
      node,
      "table",
      this.isTableElement,
      this.create,
      this.toFigmaNode,
    );
  },
};
