/**
 * @fileoverview OL要素のFigma変換
 */

import type { FigmaNodeConfig } from "../../../../models/figma-node";
import {
  FigmaNode,
  FigmaNodeConfig as FigmaNodeConfigUtil,
} from "../../../../models/figma-node";
import { OlElement } from "../ol-element";
import { Styles } from "../../../../models/styles";
import { isValidPadding } from "../../utils/validation";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

// デフォルトのリストスタイル定数
const DEFAULT_LIST_INDENT = 40; // デフォルトのインデント
const DEFAULT_LIST_VERTICAL_PADDING = 16; // 上下のパディング
const DEFAULT_ITEM_SPACING = 8; // リストアイテム間のスペース

/**
 * OL要素をFigmaノードに変換
 */
export function toFigmaNode(element: OlElement): FigmaNodeConfig {
  return toFigmaNodeWith(
    element,
    (el) => {
      // className/classをclassに変換してapplyHtmlElementDefaultsに渡す
      const attributesForDefaults: Record<string, unknown> = {};
      if (el.attributes) {
        if (el.attributes.id) {
          attributesForDefaults.id = el.attributes.id;
        }
        // className と class の両方をサポート
        const classValue = el.attributes.className || el.attributes.class;
        if (classValue) {
          attributesForDefaults.class = classValue;
        }
      }

      const config = FigmaNode.createFrame("ol");
      const result = FigmaNodeConfigUtil.applyHtmlElementDefaults(
        config,
        "ol",
        attributesForDefaults,
      );

      // リストの基本レイアウト設定
      result.layoutMode = "VERTICAL";
      result.layoutSizingHorizontal = "HUG";
      result.layoutSizingVertical = "HUG";

      // デフォルトのリストスタイル
      result.paddingLeft = DEFAULT_LIST_INDENT;
      result.paddingTop = DEFAULT_LIST_VERTICAL_PADDING;
      result.paddingBottom = DEFAULT_LIST_VERTICAL_PADDING;
      result.paddingRight = 0;
      result.itemSpacing = DEFAULT_ITEM_SPACING;
      result.children = [];

      // 開始番号と逆順をノード名に反映
      const startNumber = OlElement.getStartNumber(el);
      if (startNumber !== 1) {
        result.name = `${result.name} (start=${startNumber})`;
      }
      if (OlElement.isReversed(el)) {
        result.name = `${result.name} (reversed)`;
      }

      return result;
    },
    {
      applyCommonStyles: true,
      customStyleApplier: (config, _, styles) => {
        // NaNやInfinityの値をデフォルトに戻す
        if (!isValidPadding(config.paddingLeft ?? 0)) {
          config.paddingLeft = DEFAULT_LIST_INDENT;
        }
        if (!isValidPadding(config.paddingTop ?? 0)) {
          config.paddingTop = DEFAULT_LIST_VERTICAL_PADDING;
        }
        if (!isValidPadding(config.paddingBottom ?? 0)) {
          config.paddingBottom = DEFAULT_LIST_VERTICAL_PADDING;
        }
        if (!isValidPadding(config.paddingRight ?? 0)) {
          config.paddingRight = 0;
        }

        // marginBottomをitemSpacingに変換
        const marginBottom = Styles.getMarginBottom(styles);
        if (marginBottom !== undefined && typeof marginBottom === "number") {
          config.itemSpacing = marginBottom;
        }

        return config;
      },
    },
  );
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
