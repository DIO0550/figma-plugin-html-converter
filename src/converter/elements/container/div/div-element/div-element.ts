import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import type { DivAttributes } from "../div-attributes";
import type { BaseElement } from "../../../base/base-element";
import { mapToFigmaWith } from "../../../../utils/element-utils";

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
    let config = FigmaNode.createFrame("div");

    // HTML要素のデフォルト設定を適用
    config = FigmaNodeConfig.applyHtmlElementDefaults(
      config,
      "div",
      element.attributes,
    );

    // スタイルがない場合は早期リターン
    if (!element.attributes?.style) {
      return config;
    }

    const styles = Styles.parse(element.attributes?.style);

    // 背景色を適用
    const backgroundColor = Styles.getBackgroundColor(styles);
    if (backgroundColor) {
      config = FigmaNodeConfig.applyBackgroundColor(config, backgroundColor);
    }

    // パディングを適用
    const padding = Styles.getPadding(styles);
    if (padding) {
      config = FigmaNodeConfig.applyPaddingStyles(config, padding);
    }

    // Flexboxスタイルを適用（常に実行、内部で判定）
    config = FigmaNodeConfig.applyFlexboxStyles(
      config,
      Styles.extractFlexboxOptions(styles),
    );

    // ボーダースタイルを適用（常に実行、内部で判定）
    config = FigmaNodeConfig.applyBorderStyles(
      config,
      Styles.extractBorderOptions(styles),
    );

    // サイズスタイルを適用（常に実行、内部で判定）
    config = FigmaNodeConfig.applySizeStyles(
      config,
      Styles.extractSizeOptions(styles),
    );

    return config;
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
