/**
 * @fileoverview DD要素のFigma変換
 */

import type { FigmaNodeConfig } from "../../../../models/figma-node";
import type { HTMLNode } from "../../../../models/html-node";
import { FigmaNode } from "../../../../models/figma-node";
import { DdElement } from "../dd-element";
import { Styles } from "../../../../models/styles";

// デフォルトのスタイル定数
const DEFAULT_INDENT = 40; // 説明のインデント
const DEFAULT_MARGIN_BOTTOM = 8; // 説明項目間の間隔

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
      if (paddingLeft !== undefined && typeof paddingLeft === "number") {
        config.paddingLeft = paddingLeft;
      }
      const paddingTop = Styles.getPaddingTop(styles);
      if (paddingTop !== undefined && typeof paddingTop === "number") {
        config.paddingTop = paddingTop;
      }
      const paddingBottom = Styles.getPaddingBottom(styles);
      if (paddingBottom !== undefined && typeof paddingBottom === "number") {
        config.paddingBottom = paddingBottom;
      }
      const paddingRight = Styles.getPaddingRight(styles);
      if (paddingRight !== undefined && typeof paddingRight === "number") {
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
  // DdElementの場合
  if (DdElement.isDdElement(node)) {
    return toFigmaNode(node);
  }

  // HTMLNodeからの変換
  if (
    typeof node === "object" &&
    node !== null &&
    "type" in node &&
    "tagName" in node &&
    (node as any).type === "element" &&
    (node as any).tagName === "dd"
  ) {
    const htmlNode = node as HTMLNode;
    const attributes = htmlNode.attributes || {};
    const children = htmlNode.children || [];
    const element = DdElement.create(attributes, children);
    return toFigmaNode(element);
  }

  return null;
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
