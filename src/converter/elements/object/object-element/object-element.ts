/**
 * object要素のFigma変換処理
 * 外部コンテンツを埋め込むため、プレースホルダーとして表示
 */

import type { FigmaNodeConfig } from "../../../models/figma-node";
import { FigmaNode } from "../../../models/figma-node";
import type { HTMLNode } from "../../../models/html-node/html-node";
import { Paint } from "../../../models/paint";
import { ObjectAttributes } from "../object-attributes";

/**
 * Figmaの標準プレースホルダー色
 */
const DEFAULT_PLACEHOLDER_COLOR = { r: 0.94, g: 0.94, b: 0.94 };

/**
 * オブジェクト要素用アイコン設定
 */
const ICON_CONFIG = {
  SIZE: 48,
  BACKGROUND_COLOR: { r: 1, g: 1, b: 1 },
  BORDER_COLOR: { r: 0.6, g: 0.6, b: 0.6 },
  BORDER_WIDTH: 2,
  INNER_SIZE: 32,
  CORNER_RADIUS: 4,
  OBJECT_COLOR: { r: 0.4, g: 0.4, b: 0.6 },
} as const;

/**
 * ラベル表示設定
 *
 * 各値の意図:
 * - MAX_LENGTH: URLの可読性を保ちながら長すぎる表示を防ぐための文字数上限
 * - ELLIPSIS: 省略時に使用する標準的な省略記号
 * - FONT_SIZE: Figmaの標準的なキャプションサイズに準拠
 * - COLOR: グレー（50%）で控えめな表示、メインコンテンツより目立たない
 * - ITEM_SPACING: Figmaの標準的な8pxグリッドシステムに準拠
 */
export const LABEL_CONFIG = {
  MAX_LENGTH: 50,
  ELLIPSIS: "...",
  FONT_SIZE: 12,
  COLOR: { r: 0.5, g: 0.5, b: 0.5 },
  ITEM_SPACING: 8,
} as const;

export interface ObjectElement {
  type: "element";
  tagName: "object";
  attributes: ObjectAttributes;
  children: HTMLNode[];
}

export const ObjectElement = {
  isObjectElement(node: unknown): node is ObjectElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "object"
    );
  },

  create(
    attributes: Partial<ObjectAttributes> = {},
    children: HTMLNode[] = [],
  ): ObjectElement {
    return {
      type: "element",
      tagName: "object",
      attributes: attributes as ObjectAttributes,
      children,
    };
  },

  getData(element: ObjectElement): string | undefined {
    return element.attributes.data;
  },

  getWidth(element: ObjectElement): string | undefined {
    return element.attributes.width;
  },

  getHeight(element: ObjectElement): string | undefined {
    return element.attributes.height;
  },

  getType(element: ObjectElement): string | undefined {
    return element.attributes.type;
  },

  getName(element: ObjectElement): string | undefined {
    return element.attributes.name;
  },

  getStyle(element: ObjectElement): string | undefined {
    return element.attributes.style;
  },

  getNodeName(element: ObjectElement): string {
    const name = element.attributes.name;
    if (name) {
      return `object: ${name}`;
    }

    const type = element.attributes.type;
    if (type) {
      return `object: ${type}`;
    }

    const data = ObjectAttributes.getData(element.attributes);
    if (data) {
      try {
        const url = new URL(data);
        return `object: ${url.hostname}`;
      } catch {
        return "object";
      }
    }

    return "object";
  },

  createFills(): Paint[] {
    return [Paint.solid(DEFAULT_PLACEHOLDER_COLOR)];
  },

  applyStyles(config: FigmaNodeConfig, element: ObjectElement): void {
    const border = ObjectAttributes.getBorder(element.attributes);
    if (border) {
      FigmaNode.setStrokes(config, [Paint.solid(border.color)], border.width);
    }

    const borderRadius = ObjectAttributes.getBorderRadius(element.attributes);
    if (borderRadius !== null) {
      FigmaNode.setCornerRadius(config, borderRadius);
    }
  },

  createPlaceholder(): FigmaNodeConfig {
    const iconFrame: FigmaNodeConfig = {
      type: "FRAME",
      name: "object-icon",
      width: ICON_CONFIG.SIZE,
      height: ICON_CONFIG.SIZE,
      fills: [Paint.solid(ICON_CONFIG.BACKGROUND_COLOR)],
      strokes: [Paint.solid(ICON_CONFIG.BORDER_COLOR)],
      strokeWeight: ICON_CONFIG.BORDER_WIDTH,
      cornerRadius: ICON_CONFIG.CORNER_RADIUS,
      layoutMode: "VERTICAL",
      primaryAxisAlignItems: "CENTER",
      counterAxisAlignItems: "CENTER",
      children: [
        {
          type: "FRAME",
          name: "object-inner-icon",
          width: ICON_CONFIG.INNER_SIZE,
          height: ICON_CONFIG.INNER_SIZE,
          fills: [Paint.solid(ICON_CONFIG.OBJECT_COLOR)],
          cornerRadius: ICON_CONFIG.CORNER_RADIUS,
        },
      ],
    };

    return iconFrame;
  },

  createUrlLabel(url: string): FigmaNodeConfig {
    let displayUrl = url;
    if (url.length > LABEL_CONFIG.MAX_LENGTH) {
      displayUrl =
        url.substring(0, LABEL_CONFIG.MAX_LENGTH) + LABEL_CONFIG.ELLIPSIS;
    }

    const label: FigmaNodeConfig = {
      type: "TEXT",
      name: "url-label",
      characters: displayUrl,
      fontSize: LABEL_CONFIG.FONT_SIZE,
      fills: [Paint.solid(LABEL_CONFIG.COLOR)],
    };

    return label;
  },

  createTypeLabel(type: string): FigmaNodeConfig {
    const label: FigmaNodeConfig = {
      type: "TEXT",
      name: "type-label",
      characters: type,
      fontSize: LABEL_CONFIG.FONT_SIZE,
      fills: [Paint.solid(LABEL_CONFIG.COLOR)],
    };

    return label;
  },

  toFigmaNode(element: ObjectElement): FigmaNodeConfig {
    const config = FigmaNode.createFrame("object");
    config.name = this.getNodeName(element);
    config.fills = this.createFills();

    const { width, height } = ObjectAttributes.parseSize(element.attributes);
    config.width = width;
    config.height = height;

    this.applyStyles(config, element);

    const children: FigmaNodeConfig[] = [];
    const placeholder = this.createPlaceholder();
    children.push(placeholder);

    const type = ObjectAttributes.getType(element.attributes);
    if (type) {
      const typeLabel = this.createTypeLabel(type);
      children.push(typeLabel);
    }

    const data = ObjectAttributes.getData(element.attributes);
    if (data) {
      const urlLabel = this.createUrlLabel(data);
      children.push(urlLabel);
    }

    config.children = children;
    config.layoutMode = "VERTICAL";
    config.primaryAxisAlignItems = "CENTER";
    config.counterAxisAlignItems = "CENTER";
    config.itemSpacing = LABEL_CONFIG.ITEM_SPACING;

    return config;
  },

  mapToFigma(node: unknown): FigmaNodeConfig | null {
    if (this.isObjectElement(node)) {
      return this.toFigmaNode(node);
    }

    if (
      node !== null &&
      typeof node === "object" &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "object"
    ) {
      const attributes =
        "attributes" in node && typeof node.attributes === "object"
          ? (node.attributes as Partial<ObjectAttributes>)
          : {};
      const children =
        "children" in node && Array.isArray(node.children)
          ? (node.children as HTMLNode[])
          : [];
      const element = this.create(attributes, children);
      return this.toFigmaNode(element);
    }

    return null;
  },
};
