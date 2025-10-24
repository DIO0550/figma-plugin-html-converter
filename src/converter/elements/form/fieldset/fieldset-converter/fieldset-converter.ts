/**
 * @fileoverview fieldset要素のFigma変換ロジック
 */

import type { FigmaNodeConfig } from "../../../../models/figma-node";
import type { HTMLNode } from "../../../../models/html-node";
import { FigmaNode } from "../../../../models/figma-node";
import { FieldsetElement } from "../fieldset-element";

// デフォルトスタイル定数
const FIELDSET_PADDING = 12;
const FIELDSET_BORDER_WIDTH = 1;
const FIELDSET_BORDER_COLOR = { r: 0.7, g: 0.7, b: 0.7 };
const FIELDSET_ITEM_SPACING = 8;
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
  config.itemSpacing = FIELDSET_ITEM_SPACING;

  // 背景を透明に
  config.fills = [];

  // 枠線
  config.strokes = [{ type: "SOLID", color: FIELDSET_BORDER_COLOR }];
  config.strokeWeight = FIELDSET_BORDER_WIDTH;
  config.cornerRadius = 4;

  // パディング
  config.paddingLeft = FIELDSET_PADDING;
  config.paddingRight = FIELDSET_PADDING;
  config.paddingTop = FIELDSET_PADDING;
  config.paddingBottom = FIELDSET_PADDING;

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
  if (FieldsetElement.isFieldsetElement(node)) {
    return toFigmaNode(node);
  }

  if (
    typeof node === "object" &&
    node !== null &&
    "type" in node &&
    "tagName" in node &&
    (node as { type: unknown }).type === "element" &&
    (node as { tagName: unknown }).tagName === "fieldset"
  ) {
    const htmlNode = node as HTMLNode;
    const attributes = htmlNode.attributes || {};
    const children = htmlNode.children || [];
    const element = FieldsetElement.create(attributes, children);
    return toFigmaNode(element);
  }

  return null;
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
