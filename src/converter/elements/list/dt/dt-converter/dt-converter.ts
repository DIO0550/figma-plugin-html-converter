/**
 * @fileoverview DT要素のFigma変換
 */

import type { FigmaNodeConfig } from "../../../../models/figma-node";
import {
  FigmaNode,
  FigmaNodeConfig as FigmaNodeConfigUtil,
} from "../../../../models/figma-node";
import { DtElement } from "../dt-element";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

/**
 * DT要素をFigmaノードに変換
 */
export function toFigmaNode(element: DtElement): FigmaNodeConfig {
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

      const config = FigmaNode.createFrame("dt");
      const result = FigmaNodeConfigUtil.applyHtmlElementDefaults(
        config,
        "dt",
        attributesForDefaults,
      );

      // リストの基本レイアウト設定
      result.layoutMode = "VERTICAL";
      result.layoutSizingHorizontal = "FILL";
      result.layoutSizingVertical = "HUG";
      result.children = [];

      return result;
    },
    {
      applyCommonStyles: true,
    },
  );
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
