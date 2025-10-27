/**
 * @fileoverview OL要素のFigma変換
 */

import type { FigmaNodeConfig } from "../../../../models/figma-node";
import { FigmaNode } from "../../../../models/figma-node";
import { OlElement } from "../ol-element";
import { Styles } from "../../../../models/styles";
import { isValidPadding } from "../../utils/validation";
import { mapToFigmaWith } from "../../../../utils/element-utils";

// デフォルトのリストスタイル定数
const DEFAULT_LIST_INDENT = 40; // デフォルトのインデント
const DEFAULT_LIST_VERTICAL_PADDING = 16; // 上下のパディング
const DEFAULT_ITEM_SPACING = 8; // リストアイテム間のスペース

/**
 * OL要素をFigmaノードに変換
 */
export function toFigmaNode(element: OlElement): FigmaNodeConfig {
  const config = FigmaNode.createFrame("ol");
  config.layoutMode = "VERTICAL";
  config.itemSpacing = DEFAULT_ITEM_SPACING;

  // デフォルトのパディング
  config.paddingLeft = DEFAULT_LIST_INDENT;
  config.paddingTop = DEFAULT_LIST_VERTICAL_PADDING;
  config.paddingBottom = DEFAULT_LIST_VERTICAL_PADDING;
  config.paddingRight = 0;

  // 属性が存在する場合のみ処理
  if (element.attributes) {
    // 開始番号の取得
    const startNumber = OlElement.getStartNumber(element);

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
      config.name = `ol#${element.attributes.id}`;
    } else if (element.attributes.class) {
      const className = element.attributes.class.split(" ")[0];
      config.name = `ol.${className}`;
    } else {
      // IDもclassもない場合はデフォルト名を設定
      config.name = "ol";
    }

    // 開始番号が1以外の場合はノード名に反映
    if (startNumber !== 1) {
      config.name = `${config.name} (start=${startNumber})`;
    }

    // 逆順の場合はノード名に反映
    if (OlElement.isReversed(element)) {
      config.name = `${config.name} (reversed)`;
    }
  }

  return config;
}

/**
 * HTMLNodeからOL要素に変換してFigmaノードへ
 */
export function mapToFigma(node: unknown): FigmaNodeConfig | null {
  return mapToFigmaWith(
    node,
    "ol",
    OlElement.isOlElement,
    OlElement.create,
    toFigmaNode,
  );
}

/**
 * OL要素のコンバータークラス
 */
export class OlConverter {
  toFigmaNode(element: OlElement): FigmaNodeConfig {
    return toFigmaNode(element);
  }

  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigma(node);
  }
}
