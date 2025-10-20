/**
 * @fileoverview input要素のFigma変換ロジック
 */

import type { FigmaNodeConfig } from "../../../../models/figma-node";
import type { HTMLNode } from "../../../../models/html-node";
import { FigmaNode } from "../../../../models/figma-node";
import { InputElement } from "../input-element";

// デフォルトスタイル定数
const DEFAULT_INPUT_PADDING = 12;
const DEFAULT_INPUT_VERTICAL_PADDING = 8;
const DEFAULT_BORDER_RADIUS = 4;
const DEFAULT_STROKE_WEIGHT = 1;
const CHECKBOX_SIZE = 20;
const RADIO_SIZE = 20;
const RADIO_DOT_SIZE = 10;

/**
 * input要素をFigmaノードに変換
 */
export function toFigmaNode(element: InputElement): FigmaNodeConfig {
  const inputType = element.attributes.type || "text";

  // typeに応じて変換
  switch (inputType) {
    case "checkbox":
      return createCheckbox(element);
    case "radio":
      return createRadio(element);
    case "submit":
    case "button":
    case "reset":
      return createButton(element, inputType);
    default:
      return createTextInput(element);
  }
}

/**
 * テキスト入力系のinputを作成
 */
function createTextInput(element: InputElement): FigmaNodeConfig {
  const config = FigmaNode.createFrame("input");
  config.layoutMode = "HORIZONTAL";
  config.layoutSizingHorizontal = "HUG";
  config.layoutSizingVertical = "HUG";

  // 背景色（白）
  config.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];

  // ボーダー
  config.strokes = [{ type: "SOLID", color: { r: 0.8, g: 0.8, b: 0.8 } }];
  config.strokeWeight = DEFAULT_STROKE_WEIGHT;
  config.cornerRadius = DEFAULT_BORDER_RADIUS;

  // パディング
  config.paddingLeft = DEFAULT_INPUT_PADDING;
  config.paddingRight = DEFAULT_INPUT_PADDING;
  config.paddingTop = DEFAULT_INPUT_VERTICAL_PADDING;
  config.paddingBottom = DEFAULT_INPUT_VERTICAL_PADDING;

  // テキスト表示（valueまたはplaceholder）
  const text = element.attributes.value || element.attributes.placeholder;
  if (text) {
    const textNode = FigmaNode.createText(text);

    // placeholderの場合はグレー表示
    if (!element.attributes.value && element.attributes.placeholder) {
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
  config.name = getNodeName(element, "input");

  return config;
}

/**
 * checkboxを作成
 */
function createCheckbox(element: InputElement): FigmaNodeConfig {
  const config = FigmaNode.createRectangle("checkbox");
  config.width = CHECKBOX_SIZE;
  config.height = CHECKBOX_SIZE;
  config.cornerRadius = DEFAULT_BORDER_RADIUS;

  // 背景色（白）
  config.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];

  // ボーダー
  config.strokes = [{ type: "SOLID", color: { r: 0.4, g: 0.4, b: 0.4 } }];
  config.strokeWeight = 2;

  // checked状態の場合はチェックマークを追加
  if (element.attributes.checked) {
    const checkmark = FigmaNode.createText("✓");
    checkmark.fills = [{ type: "SOLID", color: { r: 0.2, g: 0.6, b: 1 } }];

    config.children = [checkmark];
  }

  // disabled状態
  if (element.attributes.disabled) {
    config.fills = [{ type: "SOLID", color: { r: 0.95, g: 0.95, b: 0.95 } }];
  }

  // ノード名の設定
  config.name = getNodeName(element, "checkbox");

  return config;
}

/**
 * radioボタンを作成
 */
function createRadio(element: InputElement): FigmaNodeConfig {
  const config = FigmaNode.createRectangle("radio");
  config.width = RADIO_SIZE;
  config.height = RADIO_SIZE;
  config.cornerRadius = RADIO_SIZE / 2; // 円形に見せる

  // 背景色（白）
  config.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];

  // ボーダー
  config.strokes = [{ type: "SOLID", color: { r: 0.4, g: 0.4, b: 0.4 } }];
  config.strokeWeight = 2;

  // checked状態の場合はドットを追加
  if (element.attributes.checked) {
    const dot = FigmaNode.createRectangle("dot");
    dot.width = RADIO_DOT_SIZE;
    dot.height = RADIO_DOT_SIZE;
    dot.cornerRadius = RADIO_DOT_SIZE / 2; // 円形に見せる
    dot.fills = [{ type: "SOLID", color: { r: 0.2, g: 0.6, b: 1 } }];

    config.children = [dot];
  }

  // disabled状態
  if (element.attributes.disabled) {
    config.fills = [{ type: "SOLID", color: { r: 0.95, g: 0.95, b: 0.95 } }];
  }

  // ノード名の設定
  config.name = getNodeName(element, "radio");

  return config;
}

/**
 * ボタンを作成
 */
function createButton(
  element: InputElement,
  buttonType: "submit" | "button" | "reset",
): FigmaNodeConfig {
  const config = FigmaNode.createFrame(buttonType);
  config.layoutMode = "HORIZONTAL";
  config.layoutSizingHorizontal = "HUG";
  config.layoutSizingVertical = "HUG";

  // 背景色（青）
  config.fills = [{ type: "SOLID", color: { r: 0.2, g: 0.6, b: 1 } }];
  config.cornerRadius = DEFAULT_BORDER_RADIUS;

  // パディング
  config.paddingLeft = 16;
  config.paddingRight = 16;
  config.paddingTop = DEFAULT_INPUT_VERTICAL_PADDING;
  config.paddingBottom = DEFAULT_INPUT_VERTICAL_PADDING;

  // テキスト
  const text =
    element.attributes.value ||
    (buttonType === "submit"
      ? "Submit"
      : buttonType === "reset"
        ? "Reset"
        : "Button");
  const textNode = FigmaNode.createText(text);
  textNode.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];

  config.children = [textNode];

  // disabled状態
  if (element.attributes.disabled) {
    config.fills = [{ type: "SOLID", color: { r: 0.6, g: 0.6, b: 0.6 } }];
  }

  // ノード名の設定
  config.name = getNodeName(element, buttonType);

  return config;
}

/**
 * ノード名を取得
 */
function getNodeName(element: InputElement, defaultName: string): string {
  if (element.attributes.id) {
    return `input#${element.attributes.id}`;
  }
  if (element.attributes.class) {
    const className = element.attributes.class.split(" ")[0];
    return `input.${className}`;
  }
  return defaultName;
}

/**
 * HTMLNodeからinput要素に変換してFigmaノードへ
 */
export function mapToFigma(node: unknown): FigmaNodeConfig | null {
  // InputElementの場合
  if (InputElement.isInputElement(node)) {
    return toFigmaNode(node);
  }

  // HTMLNodeからの変換
  if (
    typeof node === "object" &&
    node !== null &&
    "type" in node &&
    "tagName" in node &&
    (node as { type: unknown }).type === "element" &&
    (node as { tagName: unknown }).tagName === "input"
  ) {
    const htmlNode = node as HTMLNode;
    const attributes = htmlNode.attributes || {};
    const element = InputElement.create(attributes);
    return toFigmaNode(element);
  }

  return null;
}

/**
 * input要素のコンバータークラス
 */
export class InputConverter {
  toFigmaNode(element: InputElement): FigmaNodeConfig {
    return toFigmaNode(element);
  }

  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigma(node);
  }
}
