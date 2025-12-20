import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import type { SummaryAttributes } from "../summary-attributes";
import type { BaseElement } from "../../../base/base-element";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

/**
 * summary要素のレイアウト定数
 */
const SUMMARY_LAYOUT = {
  ITEM_SPACING: 8,
} as const;

/**
 * summary要素の型定義
 * details要素の要約を表示するセマンティック要素
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/summary
 */
export interface SummaryElement extends BaseElement<
  "summary",
  SummaryAttributes
> {
  children: SummaryElement[] | [];
}

/**
 * SummaryElementコンパニオンオブジェクト
 */
export const SummaryElement = {
  /**
   * ノードがSummaryElementかどうかを判定する型ガード
   */
  isSummaryElement(node: unknown): node is SummaryElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "summary"
    );
  },

  /**
   * SummaryElementを作成するファクトリメソッド
   */
  create(attributes: Partial<SummaryAttributes> = {}): SummaryElement {
    return {
      type: "element",
      tagName: "summary",
      attributes: attributes as SummaryAttributes,
      children: [],
    };
  },

  /**
   * SummaryElementをFigmaNodeConfigに変換
   * summary要素は水平レイアウトで、先頭に展開マーカー（▶）を表示
   */
  toFigmaNode(element: SummaryElement): FigmaNodeConfig {
    return toFigmaNodeWith(
      element,
      (el) => {
        const config = FigmaNode.createFrame("summary");
        const baseConfig = FigmaNodeConfig.applyHtmlElementDefaults(
          config,
          "summary",
          el.attributes,
        );

        // summary要素のデフォルトレイアウト設定
        // 水平方向に配置し、マーカーとコンテンツを並べる
        const layoutConfig: FigmaNodeConfig = {
          ...baseConfig,
          layoutMode: "HORIZONTAL",
          itemSpacing: SUMMARY_LAYOUT.ITEM_SPACING,
          counterAxisAlignItems: "CENTER",
        };

        // 展開マーカー（▶）を追加
        const marker = FigmaNode.createText("▶");
        layoutConfig.children = [marker];

        return layoutConfig;
      },
      {
        applyCommonStyles: true,
      },
    );
  },

  /**
   * HTMLノードからFigmaノードへのマッピング
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigmaWith(
      node,
      "summary",
      this.isSummaryElement,
      this.create,
      this.toFigmaNode,
    );
  },
};
