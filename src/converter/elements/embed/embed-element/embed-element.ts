/**
 * embed要素のFigma変換処理
 * 外部コンテンツを埋め込むため、プレースホルダーとして表示
 */

import type { FigmaNodeConfig } from "../../../models/figma-node";
import { FigmaNode } from "../../../models/figma-node";
import type { HTMLNode } from "../../../models/html-node/html-node";
import { Paint } from "../../../models/paint";
import { EmbedAttributes } from "../embed-attributes";

/**
 * Figmaの標準プレースホルダー色
 */
const DEFAULT_PLACEHOLDER_COLOR = { r: 0.94, g: 0.94, b: 0.94 };

/**
 * 埋め込みコンテンツ用アイコン設定
 */
const ICON_CONFIG = {
  SIZE: 48,
  BACKGROUND_COLOR: { r: 1, g: 1, b: 1 },
  BORDER_COLOR: { r: 0.6, g: 0.6, b: 0.6 },
  BORDER_WIDTH: 2,
  INNER_SIZE: 32,
  CORNER_RADIUS: 4,
  PLUG_COLOR: { r: 0.5, g: 0.5, b: 0.5 },
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

export interface EmbedElement {
  type: "element";
  tagName: "embed";
  attributes: EmbedAttributes;
  children: HTMLNode[];
}

export const EmbedElement = {
  isEmbedElement(node: unknown): node is EmbedElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "embed"
    );
  },

  create(
    attributes: Partial<EmbedAttributes> = {},
    children: HTMLNode[] = [],
  ): EmbedElement {
    return {
      type: "element",
      tagName: "embed",
      attributes: attributes as EmbedAttributes,
      children,
    };
  },

  getSrc(element: EmbedElement): string | undefined {
    return element.attributes.src;
  },

  getWidth(element: EmbedElement): string | undefined {
    return element.attributes.width;
  },

  getHeight(element: EmbedElement): string | undefined {
    return element.attributes.height;
  },

  getType(element: EmbedElement): string | undefined {
    return element.attributes.type;
  },

  getStyle(element: EmbedElement): string | undefined {
    return element.attributes.style;
  },

  getNodeName(element: EmbedElement): string {
    const type = element.attributes.type;
    if (type) {
      return `embed: ${type}`;
    }

    const src = EmbedAttributes.getSrc(element.attributes);
    if (src) {
      try {
        const url = new URL(src);
        return `embed: ${url.hostname}`;
      } catch {
        return "embed";
      }
    }

    return "embed";
  },

  createFills(): Paint[] {
    return [Paint.solid(DEFAULT_PLACEHOLDER_COLOR)];
  },

  applyStyles(config: FigmaNodeConfig, element: EmbedElement): void {
    const border = EmbedAttributes.getBorder(element.attributes);
    if (border) {
      FigmaNode.setStrokes(config, [Paint.solid(border.color)], border.width);
    }

    const borderRadius = EmbedAttributes.getBorderRadius(element.attributes);
    if (borderRadius !== null) {
      FigmaNode.setCornerRadius(config, borderRadius);
    }
  },

  createPlaceholder(): FigmaNodeConfig {
    const iconFrame: FigmaNodeConfig = {
      type: "FRAME",
      name: "embed-icon",
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
          name: "plug-icon",
          width: ICON_CONFIG.INNER_SIZE,
          height: ICON_CONFIG.INNER_SIZE,
          fills: [Paint.solid(ICON_CONFIG.PLUG_COLOR)],
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

  toFigmaNode(element: EmbedElement): FigmaNodeConfig {
    const config = FigmaNode.createFrame("embed");
    config.name = this.getNodeName(element);
    config.fills = this.createFills();

    const { width, height } = EmbedAttributes.parseSize(element.attributes);
    config.width = width;
    config.height = height;

    this.applyStyles(config, element);

    const children: FigmaNodeConfig[] = [];
    const placeholder = this.createPlaceholder();
    children.push(placeholder);

    const type = EmbedAttributes.getType(element.attributes);
    if (type) {
      const typeLabel = this.createTypeLabel(type);
      children.push(typeLabel);
    }

    const src = EmbedAttributes.getSrc(element.attributes);
    if (src) {
      const urlLabel = this.createUrlLabel(src);
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
    if (this.isEmbedElement(node)) {
      return this.toFigmaNode(node);
    }

    if (
      node !== null &&
      typeof node === "object" &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "embed"
    ) {
      const attributes =
        "attributes" in node && typeof node.attributes === "object"
          ? (node.attributes as Partial<EmbedAttributes>)
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
