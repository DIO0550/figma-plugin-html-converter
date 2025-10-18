/**
 * @fileoverview LI要素のFigma変換
 */

import type { FigmaNodeConfig } from "../../../../models/figma-node";
import type { HTMLNode } from "../../../../models/html-node";
import { FigmaNode } from "../../../../models/figma-node";
import { LiElement, type ListContext } from "../li-element";
import { Styles } from "../../../../models/styles";

// デフォルトのスタイル定数
const DEFAULT_MARKER_WIDTH = 24; // マーカーの幅
const DEFAULT_MARKER_SPACING = 8; // マーカーとコンテンツの間隔
const DEFAULT_BULLET_SIZE = 6; // バレットのサイズ

/**
 * マーカーノードを作成
 * @param element LI要素
 * @param context リストコンテキスト
 */
export function createMarker(
  element: LiElement,
  context?: ListContext,
): FigmaNodeConfig {
  // デフォルトコンテキスト（ul要素として扱う）
  const ctx = context || { listType: "ul" };

  if (ctx.listType === "ul") {
    // バレットを作成（四角形を円形に）
    const bulletConfig = FigmaNode.createRectangle("bullet");
    bulletConfig.width = DEFAULT_BULLET_SIZE;
    bulletConfig.height = DEFAULT_BULLET_SIZE;
    bulletConfig.cornerRadius = DEFAULT_BULLET_SIZE / 2; // 半径を設定して円形に
    bulletConfig.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];

    // バレットを中央揃えするためのコンテナ
    const markerContainer = FigmaNode.createFrame("marker");
    markerContainer.width = DEFAULT_MARKER_WIDTH;
    markerContainer.layoutMode = "HORIZONTAL";
    markerContainer.primaryAxisAlignItems = "CENTER";
    markerContainer.counterAxisAlignItems = "MIN";
    markerContainer.children = [bulletConfig];

    return markerContainer;
  } else {
    // 番号を作成
    const markerText = LiElement.getMarkerText(ctx, element);
    const textConfig = FigmaNode.createText(markerText);
    textConfig.name = "marker";
    textConfig.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];

    // テキストを右揃えするためのコンテナ
    const markerContainer = FigmaNode.createFrame("marker");
    markerContainer.width = DEFAULT_MARKER_WIDTH;
    markerContainer.layoutMode = "HORIZONTAL";
    markerContainer.primaryAxisAlignItems = "MAX"; // 右揃え
    markerContainer.counterAxisAlignItems = "MIN";
    markerContainer.children = [textConfig];

    return markerContainer;
  }
}

/**
 * LI要素をFigmaノードに変換
 * @param element LI要素
 * @param context リストコンテキスト（オプション）
 */
export function toFigmaNode(
  element: LiElement,
  context?: ListContext,
): FigmaNodeConfig {
  const config = FigmaNode.createFrame("li");
  config.layoutMode = "HORIZONTAL";
  config.itemSpacing = DEFAULT_MARKER_SPACING;
  config.layoutSizingHorizontal = "FILL";
  config.layoutSizingVertical = "HUG";

  // マーカーを作成
  const markerConfig = createMarker(element, context);

  // コンテンツコンテナを作成
  const contentConfig = FigmaNode.createFrame("content");
  contentConfig.layoutMode = "VERTICAL";
  contentConfig.layoutGrow = 1;
  contentConfig.layoutSizingHorizontal = "FILL";
  contentConfig.layoutSizingVertical = "HUG";

  // マーカーとコンテンツを子要素として設定
  config.children = [markerConfig, contentConfig];

  // スタイルの適用
  if (element.attributes && element.attributes.style) {
    const styles = Styles.parse(element.attributes.style);

    // 背景色を適用
    const backgroundColor = Styles.getBackgroundColor(styles);
    if (backgroundColor) {
      config.fills = [{ type: "SOLID", color: backgroundColor }];
    }

    // パディングを適用
    const padding = Styles.getPadding(styles);
    if (padding) {
      config.paddingTop = padding.top;
      config.paddingBottom = padding.bottom;
      config.paddingLeft = padding.left;
      config.paddingRight = padding.right;
    }
  }

  // クラス名やIDをノード名に反映
  if (element.attributes) {
    if (element.attributes.id) {
      config.name = `li#${element.attributes.id}`;
    } else if (element.attributes.class) {
      const className = element.attributes.class.split(" ")[0];
      config.name = `li.${className}`;
    }
  }

  return config;
}

/**
 * HTMLNodeからLI要素に変換してFigmaノードへ
 */
export function mapToFigma(
  node: unknown,
  context?: ListContext,
): FigmaNodeConfig | null {
  // LiElementの場合
  if (LiElement.isLiElement(node)) {
    return toFigmaNode(node, context);
  }

  // HTMLNodeからの変換
  if (
    typeof node === "object" &&
    node !== null &&
    "type" in node &&
    "tagName" in node &&
    (node as { type: unknown }).type === "element" &&
    (node as { tagName: unknown }).tagName === "li"
  ) {
    const htmlNode = node as HTMLNode;
    const attributes = htmlNode.attributes || {};
    const children = htmlNode.children || [];
    const element = LiElement.create(attributes, children);
    return toFigmaNode(element, context);
  }

  return null;
}

/**
 * LI要素のコンバータークラス
 */
export class LiConverter {
  toFigmaNode(element: LiElement, context?: ListContext): FigmaNodeConfig {
    return toFigmaNode(element, context);
  }

  createMarker(element: LiElement, context?: ListContext): FigmaNodeConfig {
    return createMarker(element, context);
  }

  mapToFigma(node: unknown, context?: ListContext): FigmaNodeConfig | null {
    return mapToFigma(node, context);
  }
}
