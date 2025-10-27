/**
 * @fileoverview DD要素のFigma変換
 */

import type { FigmaNodeConfig } from "../../../../models/figma-node";
import { FigmaNode } from "../../../../models/figma-node";
import { DdElement } from "../dd-element";
import { Styles } from "../../../../models/styles";
import { isValidPadding } from "../../utils/validation";
import { mapToFigmaWith } from "../../../../utils/element-utils";

// デフォルトのスタイル定数
const DEFAULT_INDENT = 40; // 説明のインデント

/**
 * DD要素をFigmaノードに変換
 */
export function toFigmaNode(element: DdElement): FigmaNodeConfig {
  const config = FigmaNode.createFrame("dd");
  config.layoutMode = "VERTICAL";
  config.layoutSizingHorizontal = "FILL";
  config.layoutSizingVertical = "HUG";

  // デフォルトのインデント
  config.paddingLeft = DEFAULT_INDENT;

  // スタイルの適用
  if (element.attributes && element.attributes.style) {
    const styles = Styles.parse(element.attributes.style);

    // 背景色を適用
    const backgroundColor = Styles.getBackgroundColor(styles);
    if (backgroundColor) {
      config.fills = [{ type: "SOLID", color: backgroundColor }];
    }

    // パディングを適用
    const padding = Styles.getPadding(styles);
    if (padding) {
      config.paddingTop = padding.top;
      config.paddingBottom = padding.bottom;
      config.paddingLeft = padding.left;
      config.paddingRight = padding.right;
    } else {
      // 個別のパディング値を適用
      const paddingLeft = Styles.getPaddingLeft(styles);
      if (paddingLeft !== undefined && isValidPadding(paddingLeft)) {
        config.paddingLeft = paddingLeft;
      }
      const paddingTop = Styles.getPaddingTop(styles);
      if (paddingTop !== undefined && isValidPadding(paddingTop)) {
        config.paddingTop = paddingTop;
      }
      const paddingBottom = Styles.getPaddingBottom(styles);
      if (paddingBottom !== undefined && isValidPadding(paddingBottom)) {
        config.paddingBottom = paddingBottom;
      }
      const paddingRight = Styles.getPaddingRight(styles);
      if (paddingRight !== undefined && isValidPadding(paddingRight)) {
        config.paddingRight = paddingRight;
      }
    }

    // マージンを適用
    const marginBottom = Styles.getMarginBottom(styles);
    if (marginBottom !== undefined && typeof marginBottom === "number") {
      config.itemSpacing = marginBottom;
    }
  }

  // クラス名やIDをノード名に反映
  if (element.attributes) {
    if (element.attributes.id) {
      config.name = `dd#${element.attributes.id}`;
    } else if (element.attributes.class) {
      const className = element.attributes.class.split(" ")[0];
      config.name = `dd.${className}`;
    }
  }

  return config;
}

/**
 * HTMLNodeからDD要素に変換してFigmaノードへ
 */
export function mapToFigma(node: unknown): FigmaNodeConfig | null {
  return mapToFigmaWith(
    node,
    "dd",
    DdElement.isDdElement,
    DdElement.create,
    toFigmaNode,
  );
}

/**
 * DD要素のコンバータークラス
 */
export class DdConverter {
  toFigmaNode(element: DdElement): FigmaNodeConfig {
    return toFigmaNode(element);
  }

  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigma(node);
  }
}
