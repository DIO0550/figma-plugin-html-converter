import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import type { DivAttributes } from "../div-attributes";
import type { BaseElement } from "../../../base/base-element";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

/**
 * div要素の型定義
 * BaseElementを継承した専用の型
 */
export interface DivElement extends BaseElement<"div", DivAttributes> {
  children: DivElement[] | [];
}

/**
 * DivElementコンパニオンオブジェクト
 */
export const DivElement = {
  isDivElement(node: unknown): node is DivElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "div"
    );
  },

  create(attributes: Partial<DivAttributes> = {}): DivElement {
    return {
      type: "element",
      tagName: "div",
      attributes: attributes as DivAttributes,
      children: [],
    };
  },

  toFigmaNode(element: DivElement): FigmaNodeConfig {
    return toFigmaNodeWith(
      element,
      (el) => {
        const config = FigmaNode.createFrame("div");
        return FigmaNodeConfig.applyHtmlElementDefaults(
          config,
          "div",
          el.attributes,
        );
      },
      {
        applyCommonStyles: true,
        customStyleApplier: (config, _el, styles) => {
          // Flexboxスタイルを適用（div固有）
          return FigmaNodeConfig.applyFlexboxStyles(
            config,
            Styles.extractFlexboxOptions(styles),
          );
        },
      },
    );
  },

  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigmaWith(
      node,
      "div",
      this.isDivElement,
      this.create,
      this.toFigmaNode,
    );
  },
};
