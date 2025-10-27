/**
 * @fileoverview fieldset要素のFigma変換ロジック
 */

import type { FigmaNodeConfig } from "../../../../models/figma-node";
import { FigmaNode } from "../../../../models/figma-node";
import { FieldsetElement } from "../fieldset-element";
import { mapToFigmaWith } from "../../../../utils/element-utils";

// デフォルトスタイル定数
const FIELDSET_DEFAULT_PADDING_PX = 12;
const FIELDSET_DEFAULT_BORDER_WIDTH_PX = 1;
const FIELDSET_DEFAULT_BORDER_COLOR = { r: 0.7, g: 0.7, b: 0.7 };
const FIELDSET_DEFAULT_ITEM_SPACING_PX = 8;
const DISABLED_OPACITY = 0.5;

/**
 * fieldset要素をFigmaノードに変換
 */
export function toFigmaNode(element: FieldsetElement): FigmaNodeConfig {
  const config = FigmaNode.createFrame("fieldset");

  // レイアウト設定
  config.layoutMode = "VERTICAL";
  config.layoutSizingHorizontal = "HUG";
  config.layoutSizingVertical = "HUG";
  config.primaryAxisAlignItems = "MIN";
  config.counterAxisAlignItems = "MIN";
  config.itemSpacing = FIELDSET_DEFAULT_ITEM_SPACING_PX;

  // 背景を透明に
  config.fills = [];

  // 枠線
  config.strokes = [{ type: "SOLID", color: FIELDSET_DEFAULT_BORDER_COLOR }];
  config.strokeWeight = FIELDSET_DEFAULT_BORDER_WIDTH_PX;
  config.cornerRadius = 4;

  // パディング
  config.paddingLeft = FIELDSET_DEFAULT_PADDING_PX;
  config.paddingRight = FIELDSET_DEFAULT_PADDING_PX;
  config.paddingTop = FIELDSET_DEFAULT_PADDING_PX;
  config.paddingBottom = FIELDSET_DEFAULT_PADDING_PX;

  // disabled状態
  if (element.attributes.disabled) {
    config.opacity = DISABLED_OPACITY;
  }

  // ノード名の設定（優先順位: id > class > name）
  if (element.attributes.id) {
    config.name = `fieldset#${element.attributes.id}`;
  } else if (element.attributes.class) {
    const className = element.attributes.class.split(" ")[0];
    config.name = `fieldset.${className}`;
  } else if (element.attributes.name) {
    config.name = `fieldset[name=${element.attributes.name}]`;
  }

  return config;
}

/**
 * HTMLNodeからfieldset要素に変換してFigmaノードへ
 */
export function mapToFigma(node: unknown): FigmaNodeConfig | null {
  return mapToFigmaWith(
    node,
    "fieldset",
    FieldsetElement.isFieldsetElement,
    FieldsetElement.create,
    toFigmaNode,
  );
}

/**
 * fieldset要素のコンバータークラス
 */
export class FieldsetConverter {
  toFigmaNode(element: FieldsetElement): FigmaNodeConfig {
    return toFigmaNode(element);
  }

  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigma(node);
  }
}
