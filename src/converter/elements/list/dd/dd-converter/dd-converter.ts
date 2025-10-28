/**
 * @fileoverview DD要素のFigma変換
 */

import type { FigmaNodeConfig } from "../../../../models/figma-node";
import {
  FigmaNode,
  FigmaNodeConfig as FigmaNodeConfigUtil,
} from "../../../../models/figma-node";
import { DdElement } from "../dd-element";
import { Styles } from "../../../../models/styles";
import { isValidPadding } from "../../utils/validation";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

// デフォルトのスタイル定数
const DEFAULT_INDENT = 40; // 説明のインデント

/**
 * DD要素をFigmaノードに変換
 */
export function toFigmaNode(element: DdElement): FigmaNodeConfig {
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

      const config = FigmaNode.createFrame("dd");
      const result = FigmaNodeConfigUtil.applyHtmlElementDefaults(
        config,
        "dd",
        attributesForDefaults,
      );

      // リストの基本レイアウト設定
      result.layoutMode = "VERTICAL";
      result.layoutSizingHorizontal = "FILL";
      result.layoutSizingVertical = "HUG";

      // デフォルトのインデント
      result.paddingLeft = DEFAULT_INDENT;
      result.children = [];

      return result;
    },
    {
      applyCommonStyles: true,
      customStyleApplier: (config, _, styles) => {
        // NaNやInfinityの値をデフォルトに戻す
        if (!isValidPadding(config.paddingLeft ?? 0)) {
          config.paddingLeft = DEFAULT_INDENT;
        }
        if (!isValidPadding(config.paddingTop ?? 0)) {
          config.paddingTop = 0;
        }
        if (!isValidPadding(config.paddingBottom ?? 0)) {
          config.paddingBottom = 0;
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
