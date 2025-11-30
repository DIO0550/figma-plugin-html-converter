import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import type { TdAttributes } from "../td-attributes";
import type { BaseElement } from "../../../base/base-element";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";
import { getColspanValue, getRowspanValue } from "../../utils";

/**
 * td要素の型定義
 * BaseElementを継承した専用の型
 */
export interface TdElement extends BaseElement<"td", TdAttributes> {
  children: TdElement[] | [];
}

/**
 * TdElementコンパニオンオブジェクト
 */
export const TdElement = {
  isTdElement(node: unknown): node is TdElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "td"
    );
  },

  create(attributes: Partial<TdAttributes> = {}): TdElement {
    return {
      type: "element",
      tagName: "td",
      attributes: attributes as TdAttributes,
      children: [],
    };
  },

  toFigmaNode(element: TdElement): FigmaNodeConfig {
    return toFigmaNodeWith(
      element,
      (el) => {
        const config = FigmaNode.createFrame("td");
        return FigmaNodeConfig.applyHtmlElementDefaults(
          config,
          "td",
          el.attributes,
        );
      },
      {
        applyCommonStyles: true,
      },
    );
  },

  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigmaWith(
      node,
      "td",
      this.isTdElement,
      this.create,
      this.toFigmaNode,
    );
  },

  /**
   * td要素のcolspan属性を取得する
   *
   * @param element - td要素
   * @returns colspan値（デフォルト: 1）
   *
   * @example
   * ```typescript
   * const td = TdElement.create({ colspan: "2" });
   * TdElement.getColspan(td); // => 2
   * ```
   */
  getColspan(element: TdElement): number {
    return getColspanValue(element);
  },

  /**
   * td要素のrowspan属性を取得する
   *
   * @param element - td要素
   * @returns rowspan値（デフォルト: 1）
   *
   * @example
   * ```typescript
   * const td = TdElement.create({ rowspan: "3" });
   * TdElement.getRowspan(td); // => 3
   * ```
   */
  getRowspan(element: TdElement): number {
    return getRowspanValue(element);
  },
};
