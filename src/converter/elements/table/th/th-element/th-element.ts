import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import type { ThAttributes } from "../th-attributes";
import type { BaseElement } from "../../../base/base-element";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

/**
 * th要素の型定義
 * BaseElementを継承した専用の型
 */
export interface ThElement extends BaseElement<"th", ThAttributes> {
  children: ThElement[] | [];
}

/**
 * ThElementコンパニオンオブジェクト
 */
export const ThElement = {
  isThElement(node: unknown): node is ThElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "th"
    );
  },

  create(attributes: Partial<ThAttributes> = {}): ThElement {
    return {
      type: "element",
      tagName: "th",
      attributes: attributes as ThAttributes,
      children: [],
    };
  },

  toFigmaNode(element: ThElement): FigmaNodeConfig {
    return toFigmaNodeWith(
      element,
      (el) => {
        const nodeName = el.attributes?.scope
          ? `th-${el.attributes.scope}`
          : "th";
        const config = FigmaNode.createFrame(nodeName);
        return FigmaNodeConfig.applyHtmlElementDefaults(
          config,
          "th",
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
      "th",
      this.isThElement,
      this.create,
      this.toFigmaNode,
    );
  },

  /**
   * th要素のcolspan属性を取得する
   *
   * @param element - th要素
   * @returns colspan値（デフォルト: 1）
   *
   * @example
   * ```typescript
   * const th = ThElement.create({ colspan: "2" });
   * ThElement.getColspan(th); // => 2
   * ```
   */
  getColspan(element: ThElement): number {
    const colspan = element.attributes?.colspan;
    if (colspan === undefined || colspan === "") {
      return 1;
    }
    const parsed = parseInt(String(colspan), 10);
    return isNaN(parsed) || parsed <= 0 ? 1 : parsed;
  },

  /**
   * th要素のrowspan属性を取得する
   *
   * @param element - th要素
   * @returns rowspan値（デフォルト: 1）
   *
   * @example
   * ```typescript
   * const th = ThElement.create({ rowspan: "3" });
   * ThElement.getRowspan(th); // => 3
   * ```
   */
  getRowspan(element: ThElement): number {
    const rowspan = element.attributes?.rowspan;
    if (rowspan === undefined || rowspan === "") {
      return 1;
    }
    const parsed = parseInt(String(rowspan), 10);
    return isNaN(parsed) || parsed <= 0 ? 1 : parsed;
  },
};
