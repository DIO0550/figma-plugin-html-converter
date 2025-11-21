import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import type { TrAttributes } from "../tr-attributes";
import type { BaseElement } from "../../../base/base-element";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

/**
 * tr要素の型定義
 * BaseElementを継承した専用の型
 */
export interface TrElement extends BaseElement<"tr", TrAttributes> {
  children: TrElement[] | [];
}

/**
 * TrElementコンパニオンオブジェクト
 */
export const TrElement = {
  /**
   * TrElement型ガード
   *
   * @param node - 判定対象のオブジェクト
   * @returns TrElementであればtrue
   */
  isTrElement(node: unknown): node is TrElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "tr"
    );
  },

  /**
   * TrElement生成
   *
   * @param attributes - tr要素の属性（オプショナル）
   * @returns 新しいTrElementオブジェクト
   */
  create(attributes: Partial<TrAttributes> = {}): TrElement {
    return {
      type: "element",
      tagName: "tr",
      attributes: attributes as TrAttributes,
      children: [],
    };
  },

  /**
   * Figma変換
   *
   * @param element - 変換対象のTrElement
   * @returns FigmaNodeConfig（FrameNode設定）
   */
  toFigmaNode(element: TrElement): FigmaNodeConfig {
    return toFigmaNodeWith(
      element,
      (el) => {
        const config = FigmaNode.createFrame("tr");
        return FigmaNodeConfig.applyHtmlElementDefaults(
          config,
          "tr",
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
      "tr",
      this.isTrElement,
      this.create,
      this.toFigmaNode,
    );
  },
};
