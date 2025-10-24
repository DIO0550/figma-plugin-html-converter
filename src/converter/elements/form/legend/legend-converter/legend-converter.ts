/**
 * @fileoverview legend要素のFigma変換ロジック
 */

import type { FigmaNodeConfig } from "../../../../models/figma-node";
import type { HTMLNode } from "../../../../models/html-node";
import { FigmaNode } from "../../../../models/figma-node";
import { LegendElement } from "../legend-element";

// デフォルトスタイル定数
const LEGEND_FONT_SIZE = 16;
const LEGEND_BOTTOM_PADDING = 8;
const PLACEHOLDER_TEXT = "Legend";

/**
 * legend要素からテキストを取得
 */
function getLegendText(element: LegendElement): string {
  if (!element.children || element.children.length === 0) {
    return PLACEHOLDER_TEXT;
  }

  // すべてのテキストノードを結合
  const texts: string[] = [];
  for (const child of element.children) {
    if (
      typeof child === "object" &&
      child !== null &&
      "type" in child &&
      child.type === "text" &&
      "textContent" in child &&
      typeof child.textContent === "string"
    ) {
      texts.push(child.textContent);
    }
  }

  return texts.length > 0 ? texts.join("") : PLACEHOLDER_TEXT;
}

/**
 * legend要素をFigmaノードに変換
 */
export function toFigmaNode(element: LegendElement): FigmaNodeConfig {
  const config = FigmaNode.createFrame("legend");
  config.layoutMode = "HORIZONTAL";
  config.layoutSizingHorizontal = "HUG";
  config.layoutSizingVertical = "HUG";
  config.primaryAxisAlignItems = "MIN";
  config.counterAxisAlignItems = "CENTER";

  // 背景を透明に
  config.fills = [];

  // パディング（下部のみ）
  config.paddingLeft = 0;
  config.paddingRight = 0;
  config.paddingTop = 0;
  config.paddingBottom = LEGEND_BOTTOM_PADDING;

  // テキストノード
  const displayText = getLegendText(element);
  const textNode = FigmaNode.createText(displayText);
  textNode.fontSize = LEGEND_FONT_SIZE;
  textNode.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.1 } }];

  config.children = [textNode];

  // ノード名の設定
  if (element.attributes.id) {
    config.name = `legend#${element.attributes.id}`;
  } else if (element.attributes.class) {
    const className = element.attributes.class.split(" ")[0];
    config.name = `legend.${className}`;
  }

  return config;
}

/**
 * HTMLNodeからlegend要素に変換してFigmaノードへ
 */
export function mapToFigma(node: unknown): FigmaNodeConfig | null {
  if (LegendElement.isLegendElement(node)) {
    return toFigmaNode(node);
  }

  if (
    typeof node === "object" &&
    node !== null &&
    "type" in node &&
    "tagName" in node &&
    (node as { type: unknown }).type === "element" &&
    (node as { tagName: unknown }).tagName === "legend"
  ) {
    const htmlNode = node as HTMLNode;
    const attributes = htmlNode.attributes || {};
    const children = htmlNode.children || [];
    const element = LegendElement.create(attributes, children);
    return toFigmaNode(element);
  }

  return null;
}

/**
 * legend要素のコンバータークラス
 */
export class LegendConverter {
  toFigmaNode(element: LegendElement): FigmaNodeConfig {
    return toFigmaNode(element);
  }

  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigma(node);
  }
}
