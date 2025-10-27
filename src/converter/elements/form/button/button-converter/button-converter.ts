/**
 * @fileoverview button要素のFigma変換ロジック
 */

import type { FigmaNodeConfig } from "../../../../models/figma-node";
import { FigmaNode } from "../../../../models/figma-node";
import { ButtonElement } from "../button-element";
import { mapToFigmaWith } from "../../../../utils/element-utils";

// デフォルトスタイル定数
const DEFAULT_BUTTON_PADDING = 16;
const DEFAULT_BUTTON_VERTICAL_PADDING = 8;
const DEFAULT_BORDER_RADIUS = 4;

/**
 * button要素をFigmaノードに変換
 */
export function toFigmaNode(element: ButtonElement): FigmaNodeConfig {
  const config = FigmaNode.createFrame("button");
  config.layoutMode = "HORIZONTAL";
  config.layoutSizingHorizontal = "HUG";
  config.layoutSizingVertical = "HUG";

  // 背景色（青）
  config.fills = [{ type: "SOLID", color: { r: 0.2, g: 0.6, b: 1 } }];
  config.cornerRadius = DEFAULT_BORDER_RADIUS;

  // パディング
  config.paddingLeft = DEFAULT_BUTTON_PADDING;
  config.paddingRight = DEFAULT_BUTTON_PADDING;
  config.paddingTop = DEFAULT_BUTTON_VERTICAL_PADDING;
  config.paddingBottom = DEFAULT_BUTTON_VERTICAL_PADDING;

  // テキスト（子要素のテキストまたはvalueまたはtype）
  let text = "Button";
  if (element.children && element.children.length > 0) {
    // 子要素がある場合は最初のテキストノードを使用
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
        "Button";
    }
  } else if (element.attributes.value) {
    text = element.attributes.value;
  } else if (element.attributes.type === "submit") {
    text = "Submit";
  } else if (element.attributes.type === "reset") {
    text = "Reset";
  }

  const textNode = FigmaNode.createText(text);
  textNode.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  config.children = [textNode];

  // disabled状態
  if (element.attributes.disabled) {
    config.fills = [{ type: "SOLID", color: { r: 0.6, g: 0.6, b: 0.6 } }];
  }

  // ノード名の設定
  if (element.attributes.id) {
    config.name = `button#${element.attributes.id}`;
  } else if (element.attributes.class) {
    const className = element.attributes.class.split(" ")[0];
    config.name = `button.${className}`;
  }

  return config;
}

/**
 * HTMLNodeからbutton要素に変換してFigmaノードへ
 */
export function mapToFigma(node: unknown): FigmaNodeConfig | null {
  return mapToFigmaWith(
    node,
    "button",
    ButtonElement.isButtonElement,
    ButtonElement.create,
    toFigmaNode,
  );
}

/**
 * button要素のコンバータークラス
 */
export class ButtonConverter {
  toFigmaNode(element: ButtonElement): FigmaNodeConfig {
    return toFigmaNode(element);
  }

  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigma(node);
  }
}
