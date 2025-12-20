import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import { Paint } from "../../../../models/paint";
import { DetailsAttributes } from "../details-attributes";
import type { BaseElement } from "../../../base/base-element";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

/**
 * details要素のレイアウト定数
 */
const DETAILS_LAYOUT = {
  PADDING_VERTICAL: 8,
  PADDING_HORIZONTAL: 12,
  ITEM_SPACING: 8,
} as const;

/**
 * details要素の型定義
 * 詳細開示ウィジェットを表すセマンティック要素
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/details
 */
export interface DetailsElement extends BaseElement<
  "details",
  DetailsAttributes
> {
  children: DetailsElement[] | [];
}

/**
 * DetailsElementコンパニオンオブジェクト
 */
export const DetailsElement = {
  /**
   * ノードがDetailsElementかどうかを判定する型ガード
   */
  isDetailsElement(node: unknown): node is DetailsElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "details"
    );
  },

  /**
   * DetailsElementを作成するファクトリメソッド
   */
  create(attributes: Partial<DetailsAttributes> = {}): DetailsElement {
    return {
      type: "element",
      tagName: "details",
      attributes: attributes as DetailsAttributes,
      children: [],
    };
  },

  /**
   * DetailsElementをFigmaNodeConfigに変換（details要素は常に表示される）
   */
  toFigmaNode(element: DetailsElement): FigmaNodeConfig {
    return toFigmaNodeWith(
      element,
      (el) => {
        const config = FigmaNode.createFrame("details");
        const baseConfig = FigmaNodeConfig.applyHtmlElementDefaults(
          config,
          "details",
          el.attributes,
        );

        // details要素のデフォルトスタイル
        const detailsConfig: FigmaNodeConfig = {
          ...baseConfig,
          layoutMode: "VERTICAL",
          layoutSizingHorizontal: "FILL",
          opacity: 1,
          // デフォルトのボーダー（details要素の視覚的区別）
          strokes: [Paint.solid({ r: 0.8, g: 0.8, b: 0.8 })],
          strokeWeight: 1,
          // デフォルトのパディング
          paddingTop: DETAILS_LAYOUT.PADDING_VERTICAL,
          paddingBottom: DETAILS_LAYOUT.PADDING_VERTICAL,
          paddingLeft: DETAILS_LAYOUT.PADDING_HORIZONTAL,
          paddingRight: DETAILS_LAYOUT.PADDING_HORIZONTAL,
          itemSpacing: DETAILS_LAYOUT.ITEM_SPACING,
        };

        return detailsConfig;
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
      "details",
      this.isDetailsElement,
      this.create,
      this.toFigmaNode,
    );
  },
};
