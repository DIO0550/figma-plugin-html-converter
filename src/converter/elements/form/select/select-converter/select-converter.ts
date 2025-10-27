/**
 * @fileoverview select要素のFigma変換ロジック
 */

import type { FigmaNodeConfig } from "../../../../models/figma-node";
import type { HTMLNode } from "../../../../models/html-node";
import { FigmaNode } from "../../../../models/figma-node";
import { SelectElement } from "../select-element";
import { mapToFigmaWith } from "../../../../utils/element-utils";

// デフォルトスタイル定数
const DEFAULT_SELECT_PADDING = 12;
const DEFAULT_SELECT_VERTICAL_PADDING = 8;
const DEFAULT_BORDER_RADIUS = 4;
const DEFAULT_ARROW_SIZE = 8;
const DEFAULT_ITEM_SPACING = 8;
const DEFAULT_PLACEHOLDER_TEXT = "Select an option";

/**
 * option要素からテキストを取得
 */
function getOptionText(option: unknown): string {
  if (
    typeof option === "object" &&
    option !== null &&
    "children" in option &&
    Array.isArray(option.children) &&
    option.children.length > 0
  ) {
    const firstChild = option.children[0];
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
  return "";
}

/**
 * 選択されたoption要素を取得
 */
function getSelectedOption(children: HTMLNode[] | undefined): unknown | null {
  if (!children || children.length === 0) {
    return null;
  }

  // selected属性を持つoption要素を探す
  const selectedOption = children.find(
    (child) =>
      typeof child === "object" &&
      child !== null &&
      "type" in child &&
      "tagName" in child &&
      child.type === "element" &&
      child.tagName === "option" &&
      "attributes" in child &&
      typeof child.attributes === "object" &&
      child.attributes !== null &&
      "selected" in child.attributes,
  );

  if (selectedOption) {
    return selectedOption;
  }

  // なければ最初のoption要素を返す
  return children.find(
    (child) =>
      typeof child === "object" &&
      child !== null &&
      "type" in child &&
      "tagName" in child &&
      child.type === "element" &&
      child.tagName === "option",
  );
}

/**
 * ドロップダウン矢印を作成
 */
function createDropdownArrow(): FigmaNodeConfig {
  const arrow = FigmaNode.createText("▼");
  arrow.fontSize = DEFAULT_ARROW_SIZE;
  arrow.fills = [{ type: "SOLID", color: { r: 0.4, g: 0.4, b: 0.4 } }];
  return arrow;
}

/**
 * select要素をFigmaノードに変換
 */
export function toFigmaNode(element: SelectElement): FigmaNodeConfig {
  const config = FigmaNode.createFrame("select");
  config.layoutMode = "HORIZONTAL";
  config.layoutSizingHorizontal = "HUG";
  config.layoutSizingVertical = "HUG";
  config.primaryAxisAlignItems = "CENTER";
  config.counterAxisAlignItems = "CENTER";
  config.itemSpacing = DEFAULT_ITEM_SPACING;

  // 背景と枠線
  config.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  config.strokes = [{ type: "SOLID", color: { r: 0.8, g: 0.8, b: 0.8 } }];
  config.strokeWeight = 1;
  config.cornerRadius = DEFAULT_BORDER_RADIUS;

  // パディング
  config.paddingLeft = DEFAULT_SELECT_PADDING;
  config.paddingRight = DEFAULT_SELECT_PADDING;
  config.paddingTop = DEFAULT_SELECT_VERTICAL_PADDING;
  config.paddingBottom = DEFAULT_SELECT_VERTICAL_PADDING;

  // 表示テキストを取得
  const selectedOption = getSelectedOption(element.children);
  let displayText = DEFAULT_PLACEHOLDER_TEXT;
  if (selectedOption) {
    const optionText = getOptionText(selectedOption);
    if (optionText) {
      displayText = optionText;
    }
  }

  // テキストノード
  const textNode = FigmaNode.createText(displayText);
  textNode.fills = [{ type: "SOLID", color: { r: 0.2, g: 0.2, b: 0.2 } }];

  // ドロップダウン矢印
  const arrow = createDropdownArrow();

  config.children = [textNode, arrow];

  // disabled状態
  if (element.attributes.disabled) {
    config.opacity = 0.5;
  }

  // ノード名の設定
  if (element.attributes.id) {
    config.name = `select#${element.attributes.id}`;
  } else if (element.attributes.class) {
    const className = element.attributes.class.split(" ")[0];
    config.name = `select.${className}`;
  }

  return config;
}

/**
 * HTMLNodeからselect要素に変換してFigmaノードへ
 */
export function mapToFigma(node: unknown): FigmaNodeConfig | null {
  return mapToFigmaWith(
    node,
    "select",
    SelectElement.isSelectElement,
    SelectElement.create,
    toFigmaNode,
  );
}

/**
 * select要素のコンバータークラス
 */
export class SelectConverter {
  toFigmaNode(element: SelectElement): FigmaNodeConfig {
    return toFigmaNode(element);
  }

  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigma(node);
  }
}
