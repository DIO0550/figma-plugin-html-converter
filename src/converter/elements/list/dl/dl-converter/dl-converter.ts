/**
 * @fileoverview DL要素のFigma変換
 */

import type { FigmaNodeConfig } from "../../../../models/figma-node";
import type { HTMLNode } from "../../../../models/html-node";
import { FigmaNode } from "../../../../models/figma-node";
import { DlElement } from "../dl-element";
import { Styles } from "../../../../models/styles";
import { isValidPadding } from "../../utils/validation";

// デフォルトのスタイル定数
const DEFAULT_LIST_VERTICAL_PADDING = 16; // 上下のパディング
const DEFAULT_ITEM_SPACING = 8; // 項目間のスペース

/**
 * DL要素をFigmaノードに変換
 */
export function toFigmaNode(element: DlElement): FigmaNodeConfig {
  const config = FigmaNode.createFrame("dl");
  config.layoutMode = "VERTICAL";
  config.itemSpacing = DEFAULT_ITEM_SPACING;

  // デフォルトのパディング
  config.paddingTop = DEFAULT_LIST_VERTICAL_PADDING;
  config.paddingBottom = DEFAULT_LIST_VERTICAL_PADDING;
  config.paddingLeft = 0;
  config.paddingRight = 0;

  // 属性が存在する場合のみ処理
  if (element.attributes) {
    // スタイルの適用
    if (element.attributes.style) {
      const styles = Styles.parse(element.attributes.style);

      // 背景色を適用
      const backgroundColor = Styles.getBackgroundColor(styles);
      if (backgroundColor) {
        config.fills = [{ type: "SOLID", color: backgroundColor }];
      }

      // paddingショートハンドプロパティをチェック
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

      // marginをgapに変換（リストアイテム間）
      const marginBottom = Styles.getMarginBottom(styles);
      if (marginBottom !== undefined && typeof marginBottom === "number") {
        config.itemSpacing = marginBottom;
      }
    }

    // クラス名やIDをノード名に反映
    if (element.attributes.id) {
      config.name = `dl#${element.attributes.id}`;
    } else if (element.attributes.class) {
      const className = element.attributes.class.split(" ")[0];
      config.name = `dl.${className}`;
    }
  }

  return config;
}

/**
 * HTMLNodeからDL要素に変換してFigmaノードへ
 */
export function mapToFigma(node: unknown): FigmaNodeConfig | null {
  // DlElementの場合
  if (DlElement.isDlElement(node)) {
    return toFigmaNode(node);
  }

  // HTMLNodeからの変換
  if (
    typeof node === "object" &&
    node !== null &&
    "type" in node &&
    "tagName" in node &&
    (node as { type: unknown }).type === "element" &&
    (node as { tagName: unknown }).tagName === "dl"
  ) {
    const htmlNode = node as HTMLNode;
    const attributes = htmlNode.attributes || {};
    const children = htmlNode.children || [];
    const element = DlElement.create(attributes, children);
    return toFigmaNode(element);
  }

  return null;
}

/**
 * DL要素のコンバータークラス
 */
export class DlConverter {
  toFigmaNode(element: DlElement): FigmaNodeConfig {
    return toFigmaNode(element);
  }

  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigma(node);
  }
}
