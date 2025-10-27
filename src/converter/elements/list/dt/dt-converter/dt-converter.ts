/**
 * @fileoverview DT要素のFigma変換
 */

import type { FigmaNodeConfig } from "../../../../models/figma-node";
import { FigmaNode } from "../../../../models/figma-node";
import { DtElement } from "../dt-element";
import { Styles } from "../../../../models/styles";
import { mapToFigmaWith } from "../../../../utils/element-utils";

/**
 * DT要素をFigmaノードに変換
 */
export function toFigmaNode(element: DtElement): FigmaNodeConfig {
  const config = FigmaNode.createFrame("dt");
  config.layoutMode = "VERTICAL";
  config.layoutSizingHorizontal = "FILL";
  config.layoutSizingVertical = "HUG";

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
    }

    // フォントウェイトはStylesモジュールではサポートされていないため、
    // デフォルトの太字設定をそのまま使用
  }

  // クラス名やIDをノード名に反映
  if (element.attributes) {
    if (element.attributes.id) {
      config.name = `dt#${element.attributes.id}`;
    } else if (element.attributes.class) {
      const className = element.attributes.class.split(" ")[0];
      config.name = `dt.${className}`;
    }
  }

  return config;
}

/**
 * HTMLNodeからDT要素に変換してFigmaノードへ
 */
export function mapToFigma(node: unknown): FigmaNodeConfig | null {
  return mapToFigmaWith(
    node,
    "dt",
    DtElement.isDtElement,
    DtElement.create,
    toFigmaNode,
  );
}

/**
 * DT要素のコンバータークラス
 */
export class DtConverter {
  toFigmaNode(element: DtElement): FigmaNodeConfig {
    return toFigmaNode(element);
  }

  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigma(node);
  }
}
