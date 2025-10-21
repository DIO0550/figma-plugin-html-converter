/**
 * @fileoverview option要素のFigma変換ロジック
 */

import type { FigmaNodeConfig } from "../../../../models/figma-node";
import type { HTMLNode } from "../../../../models/html-node";
import { FigmaNode } from "../../../../models/figma-node";
import { OptionElement } from "../option-element";

// デフォルトスタイル定数
const DEFAULT_OPTION_PADDING = 8;
const DEFAULT_OPTION_VERTICAL_PADDING = 4;
const DEFAULT_BORDER_RADIUS = 2;

/**
 * option要素からテキストを取得
 */
function getOptionText(element: OptionElement): string {
  // label属性が最優先
  if (element.attributes.label) {
    return element.attributes.label;
  }

  // 子要素のテキストコンテンツを取得
  if (element.children && element.children.length > 0) {
    const firstChild = element.children[0];
    if (
      typeof firstChild === "object" &&
      firstChild !== null &&
      "type" in firstChild &&
      firstChild.type === "text" &&
      "textContent" in firstChild &&
      typeof firstChild.textContent === "string"
    ) {
      return firstChild.textContent;
    }
  }

  // value属性を使用
  if (element.attributes.value) {
    return element.attributes.value;
  }

  // デフォルト
  return "Option";
}

/**
 * option要素をFigmaノードに変換
 */
export function toFigmaNode(element: OptionElement): FigmaNodeConfig {
  const config = FigmaNode.createFrame("option");
  config.layoutMode = "HORIZONTAL";
  config.layoutSizingHorizontal = "FILL";
  config.layoutSizingVertical = "HUG";
  config.primaryAxisAlignItems = "MIN";
  config.counterAxisAlignItems = "CENTER";

  // 背景色（selected状態で変更）
  if (element.attributes.selected) {
    config.fills = [{ type: "SOLID", color: { r: 0.9, g: 0.95, b: 1 } }];
  } else {
    config.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  }

  config.cornerRadius = DEFAULT_BORDER_RADIUS;

  // パディング
  config.paddingLeft = DEFAULT_OPTION_PADDING;
  config.paddingRight = DEFAULT_OPTION_PADDING;
  config.paddingTop = DEFAULT_OPTION_VERTICAL_PADDING;
  config.paddingBottom = DEFAULT_OPTION_VERTICAL_PADDING;

  // テキストノード
  const displayText = getOptionText(element);
  const textNode = FigmaNode.createText(displayText);
  textNode.fills = [{ type: "SOLID", color: { r: 0.2, g: 0.2, b: 0.2 } }];

  config.children = [textNode];

  // disabled状態
  if (element.attributes.disabled) {
    config.opacity = 0.5;
  }

  // ノード名の設定
  if (element.attributes.id) {
    config.name = `option#${element.attributes.id}`;
  } else if (element.attributes.class) {
    const className = element.attributes.class.split(" ")[0];
    config.name = `option.${className}`;
  }

  return config;
}

/**
 * HTMLNodeからoption要素に変換してFigmaノードへ
 */
export function mapToFigma(node: unknown): FigmaNodeConfig | null {
  if (OptionElement.isOptionElement(node)) {
    return toFigmaNode(node);
  }

  if (
    typeof node === "object" &&
    node !== null &&
    "type" in node &&
    "tagName" in node &&
    (node as { type: unknown }).type === "element" &&
    (node as { tagName: unknown }).tagName === "option"
  ) {
    const htmlNode = node as HTMLNode;
    const attributes = htmlNode.attributes || {};
    const children = htmlNode.children || [];
    const element = OptionElement.create(attributes, children);
    return toFigmaNode(element);
  }

  return null;
}

/**
 * option要素のコンバータークラス
 */
export class OptionConverter {
  toFigmaNode(element: OptionElement): FigmaNodeConfig {
    return toFigmaNode(element);
  }

  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigma(node);
  }
}
