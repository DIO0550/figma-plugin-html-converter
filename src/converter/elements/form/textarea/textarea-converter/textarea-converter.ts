/**
 * @fileoverview textarea要素のFigma変換ロジック
 */

import type { FigmaNodeConfig } from "../../../../models/figma-node";
import { FigmaNode } from "../../../../models/figma-node";
import { TextareaElement } from "../textarea-element";
import { mapToFigmaWith } from "../../../../utils/element-utils";

// デフォルトスタイル定数
const DEFAULT_TEXTAREA_PADDING = 12;
const DEFAULT_TEXTAREA_VERTICAL_PADDING = 8;
const DEFAULT_BORDER_RADIUS = 4;
const DEFAULT_STROKE_WEIGHT = 1;
const DEFAULT_MIN_HEIGHT = 80;

/**
 * textarea要素をFigmaノードに変換
 */
export function toFigmaNode(element: TextareaElement): FigmaNodeConfig {
  const config = FigmaNode.createFrame("textarea");
  config.layoutMode = "VERTICAL";
  config.layoutSizingHorizontal = "FILL";
  config.layoutSizingVertical = "HUG";
  config.minHeight = DEFAULT_MIN_HEIGHT;

  // 背景色（白）
  config.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];

  // ボーダー
  config.strokes = [{ type: "SOLID", color: { r: 0.8, g: 0.8, b: 0.8 } }];
  config.strokeWeight = DEFAULT_STROKE_WEIGHT;
  config.cornerRadius = DEFAULT_BORDER_RADIUS;

  // パディング
  config.paddingLeft = DEFAULT_TEXTAREA_PADDING;
  config.paddingRight = DEFAULT_TEXTAREA_PADDING;
  config.paddingTop = DEFAULT_TEXTAREA_VERTICAL_PADDING;
  config.paddingBottom = DEFAULT_TEXTAREA_VERTICAL_PADDING;

  // テキスト表示（子要素のテキストまたはplaceholder）
  let text = element.attributes.placeholder || "";
  if (element.children && element.children.length > 0) {
    const firstChild = element.children[0];
    if (
      typeof firstChild === "object" &&
      firstChild !== null &&
      "type" in firstChild &&
      firstChild.type === "text" &&
      "textContent" in firstChild &&
      typeof (firstChild as { textContent: unknown }).textContent === "string"
    ) {
      text =
        (firstChild as { type: "text"; textContent: string }).textContent ||
        text;
    }
  }

  if (text) {
    const textNode = FigmaNode.createText(text);

    // placeholderの場合はグレー表示
    if (!element.children || element.children.length === 0) {
      textNode.fills = [{ type: "SOLID", color: { r: 0.6, g: 0.6, b: 0.6 } }];
    } else {
      textNode.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
    }

    config.children = [textNode];
  }

  // disabled状態
  if (element.attributes.disabled) {
    config.fills = [{ type: "SOLID", color: { r: 0.95, g: 0.95, b: 0.95 } }];
  }

  // ノード名の設定
  if (element.attributes.id) {
    config.name = `textarea#${element.attributes.id}`;
  } else if (element.attributes.class) {
    const className = element.attributes.class.split(" ")[0];
    config.name = `textarea.${className}`;
  } else {
    config.name = "textarea";
  }

  return config;
}

/**
 * HTMLNodeからtextarea要素に変換してFigmaノードへ
 */
export function mapToFigma(node: unknown): FigmaNodeConfig | null {
  return mapToFigmaWith(
    node,
    "textarea",
    TextareaElement.isTextareaElement,
    TextareaElement.create,
    toFigmaNode,
  );
}

/**
 * textarea要素のコンバータークラス
 */
export class TextareaConverter {
  toFigmaNode(element: TextareaElement): FigmaNodeConfig {
    return toFigmaNode(element);
  }

  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigma(node);
  }
}
