import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import type { TheadAttributes } from "../thead-attributes";
import type { BaseElement } from "../../../base/base-element";
import type { TrElement } from "../../tr";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

/**
 * thead要素の型定義
 * BaseElementを継承した専用の型
 */
export interface TheadElement extends BaseElement<"thead", TheadAttributes> {
  children: TrElement[];
}

/**
 * TheadElementコンパニオンオブジェクト
 */
export const TheadElement = {
  /**
   * TheadElement型ガード
   *
   * @param node - 判定対象のオブジェクト
   * @returns TheadElementであればtrue
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
   * @param attributes - thead要素の属性（オプショナル）
   * @returns 新しいTheadElementオブジェクト
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
