/**
 * @fileoverview DL要素のFigma変換
 */

import type { FigmaNodeConfig } from "../../../../models/figma-node";
import {
  FigmaNode,
  FigmaNodeConfig as FigmaNodeConfigUtil,
} from "../../../../models/figma-node";
import { DlElement } from "../dl-element";
import { Styles } from "../../../../models/styles";
import { isValidPadding } from "../../utils/validation";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

// デフォルトのスタイル定数
const DEFAULT_LIST_VERTICAL_PADDING = 16; // 上下のパディング
const DEFAULT_ITEM_SPACING = 8; // 項目間のスペース

/**
 * DL要素をFigmaノードに変換
 */
export function toFigmaNode(element: DlElement): FigmaNodeConfig {
  return toFigmaNodeWith(
    element,
    (el) => {
      // className/classをclassに変換してapplyHtmlElementDefaultsに渡す
      const attributesForDefaults: Record<string, unknown> = {};
      if (el.attributes) {
        if (el.attributes.id) {
          attributesForDefaults.id = el.attributes.id;
        }
        const classValue = el.attributes.className || el.attributes.class;
        if (classValue) {
          attributesForDefaults.class = classValue;
        }
      }

      const config = FigmaNode.createFrame("dl");
      const result = FigmaNodeConfigUtil.applyHtmlElementDefaults(
        config,
        "dl",
        attributesForDefaults,
      );

      // リストの基本レイアウト設定
      result.layoutMode = "VERTICAL";
      result.layoutSizingHorizontal = "HUG";
      result.layoutSizingVertical = "HUG";

      // デフォルトのパディングとitemSpacing
      result.paddingTop = DEFAULT_LIST_VERTICAL_PADDING;
      result.paddingBottom = DEFAULT_LIST_VERTICAL_PADDING;
      result.paddingLeft = 0;
      result.paddingRight = 0;
      result.itemSpacing = DEFAULT_ITEM_SPACING;
      result.children = [];

      return result;
    },
    {
      applyCommonStyles: true,
      customStyleApplier: (config, _, styles) => {
        // NaNやInfinityの値をデフォルトに戻す
        if (!isValidPadding(config.paddingTop ?? 0)) {
          config.paddingTop = DEFAULT_LIST_VERTICAL_PADDING;
        }
        if (!isValidPadding(config.paddingBottom ?? 0)) {
          config.paddingBottom = DEFAULT_LIST_VERTICAL_PADDING;
        }
        if (!isValidPadding(config.paddingLeft ?? 0)) {
          config.paddingLeft = 0;
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
 * HTMLNodeからDL要素に変換してFigmaノードへ
 */
export function mapToFigma(node: unknown): FigmaNodeConfig | null {
  return mapToFigmaWith(
    node,
    "dl",
    DlElement.isDlElement,
    DlElement.create,
    toFigmaNode,
  );
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
