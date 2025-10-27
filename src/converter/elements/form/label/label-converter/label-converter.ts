/**
 * @fileoverview label要素のFigma変換ロジック
 */

import type { FigmaNodeConfig } from "../../../../models/figma-node";
import { FigmaNode } from "../../../../models/figma-node";
import { LabelElement } from "../label-element";
import { mapToFigmaWith } from "../../../../utils/element-utils";

// デフォルトスタイル定数
const DEFAULT_LABEL_FONT_SIZE = 14;
const DEFAULT_LABEL_PADDING = 4;
const DEFAULT_LABEL_TEXT = "Label";

/**
 * label要素からテキストを取得
 */
function getLabelText(element: LabelElement): string {
  if (!element.children || element.children.length === 0) {
    return DEFAULT_LABEL_TEXT;
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

  return texts.length > 0 ? texts.join("") : DEFAULT_LABEL_TEXT;
}

/**
 * label要素をFigmaノードに変換
 */
export function toFigmaNode(element: LabelElement): FigmaNodeConfig {
  const config = FigmaNode.createFrame("label");
  config.layoutMode = "HORIZONTAL";
  config.layoutSizingHorizontal = "HUG";
  config.layoutSizingVertical = "HUG";
  config.primaryAxisAlignItems = "MIN";
  config.counterAxisAlignItems = "CENTER";

  // 背景を透明に
  config.fills = [];

  // パディング
  config.paddingLeft = DEFAULT_LABEL_PADDING;
  config.paddingRight = DEFAULT_LABEL_PADDING;
  config.paddingTop = DEFAULT_LABEL_PADDING;
  config.paddingBottom = DEFAULT_LABEL_PADDING;

  // テキストノード
  const displayText = getLabelText(element);
  const textNode = FigmaNode.createText(displayText);
  textNode.fontSize = DEFAULT_LABEL_FONT_SIZE;
  textNode.fills = [{ type: "SOLID", color: { r: 0.2, g: 0.2, b: 0.2 } }];

  config.children = [textNode];

  // ノード名の設定
  if (element.attributes.id) {
    config.name = `label#${element.attributes.id}`;
  } else if (element.attributes.class) {
    const className = element.attributes.class.split(" ")[0];
    config.name = `label.${className}`;
  }

  return config;
}

/**
 * HTMLNodeからlabel要素に変換してFigmaノードへ
 */
export function mapToFigma(node: unknown): FigmaNodeConfig | null {
  return mapToFigmaWith(
    node,
    "label",
    LabelElement.isLabelElement,
    LabelElement.create,
    toFigmaNode,
  );
}

/**
 * label要素のコンバータークラス
 */
export class LabelConverter {
  toFigmaNode(element: LabelElement): FigmaNodeConfig {
    return toFigmaNode(element);
  }

  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigma(node);
  }
}
