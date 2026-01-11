/**
 * iframe要素のFigma変換処理
 * セキュリティ上の理由から実際のコンテンツは取得できないため、
 * ブラウザウィンドウ風のアイコンとURLラベルでプレースホルダーとして表示
 */

import type { FigmaNodeConfig } from "../../../models/figma-node";
import { FigmaNode } from "../../../models/figma-node";
import type { HTMLNode } from "../../../models/html-node/html-node";
import { Paint } from "../../../models/paint";
import { IframeAttributes } from "../iframe-attributes";

/**
 * Figmaの標準プレースホルダー色に合わせることで、他のFigma要素との視覚的一貫性を確保
 */
const DEFAULT_PLACEHOLDER_COLOR = { r: 0.94, g: 0.94, b: 0.94 };

/**
 * ブラウザUIとの視覚的整合性を確保するため、主要ブラウザのウィンドウデザインを参考に設計
 */
const ICON_CONFIG = {
  SIZE: 48,
  BACKGROUND_COLOR: { r: 1, g: 1, b: 1 },
  BORDER_COLOR: { r: 0.6, g: 0.6, b: 0.6 },
  BORDER_WIDTH: 2,
  INNER_SIZE: 40,
  HEADER_HEIGHT: 10,
  HEADER_COLOR: { r: 0.7, g: 0.7, b: 0.7 },
  CORNER_RADIUS: 4,
} as const;

/**
 * プレースホルダーのメインコンテンツを引き立てるため、補助情報は控えめに表示
 */
export const URL_LABEL_CONFIG = {
  /** 一般的なURL（プロトコル + ドメイン + 短いパス）が切り捨てられずに表示できる長さ */
  MAX_LENGTH: 50,
  FONT_SIZE: 12,
  COLOR: { r: 0.5, g: 0.5, b: 0.5 },
  ITEM_SPACING: 8,
} as const;

export interface IframeElement {
  type: "element";
  tagName: "iframe";
  attributes: IframeAttributes;
  children: HTMLNode[];
}

export const IframeElement = {
  isIframeElement(node: unknown): node is IframeElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "iframe"
    );
  },

  create(
    attributes: Partial<IframeAttributes> = {},
    children: HTMLNode[] = [],
  ): IframeElement {
    return {
      type: "element",
      tagName: "iframe",
      attributes: attributes as IframeAttributes,
      children,
    };
  },

  getSrc(element: IframeElement): string | undefined {
    return element.attributes.src;
  },

  getWidth(element: IframeElement): string | undefined {
    return element.attributes.width;
  },

  getHeight(element: IframeElement): string | undefined {
    return element.attributes.height;
  },

  getTitle(element: IframeElement): string | undefined {
    return element.attributes.title;
  },

  getStyle(element: IframeElement): string | undefined {
    return element.attributes.style;
  },

  getNodeName(element: IframeElement): string {
    const title = element.attributes.title;
    if (title) {
      return `iframe: ${title}`;
    }

    const src = IframeAttributes.getSrc(element.attributes);
    if (src) {
      try {
        const url = new URL(src);
        return `iframe: ${url.hostname}`;
      } catch {
        return "iframe";
      }
    }

    return "iframe";
  },

  createFills(): Paint[] {
    return [Paint.solid(DEFAULT_PLACEHOLDER_COLOR)];
  },

  applyStyles(config: FigmaNodeConfig, element: IframeElement): void {
    const border = IframeAttributes.getBorder(element.attributes);
    if (border) {
      FigmaNode.setStrokes(config, [Paint.solid(border.color)], border.width);
    }

    const borderRadius = IframeAttributes.getBorderRadius(element.attributes);
    if (borderRadius !== null) {
      FigmaNode.setCornerRadius(config, borderRadius);
    }
  },

  createPlaceholder(): FigmaNodeConfig {
    const iconFrame: FigmaNodeConfig = {
      type: "FRAME",
      name: "iframe-icon",
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
          name: "header-bar",
          width: ICON_CONFIG.INNER_SIZE,
          height: ICON_CONFIG.HEADER_HEIGHT,
          fills: [Paint.solid(ICON_CONFIG.HEADER_COLOR)],
        },
      ],
    };

    return iconFrame;
  },

  createUrlLabel(url: string): FigmaNodeConfig {
    let displayUrl = url;
    if (url.length > URL_LABEL_CONFIG.MAX_LENGTH) {
      displayUrl = url.substring(0, URL_LABEL_CONFIG.MAX_LENGTH) + "...";
    }

    const label: FigmaNodeConfig = {
      type: "TEXT",
      name: "url-label",
      characters: displayUrl,
      fontSize: URL_LABEL_CONFIG.FONT_SIZE,
      fills: [Paint.solid(URL_LABEL_CONFIG.COLOR)],
    };

    return label;
  },

  toFigmaNode(element: IframeElement): FigmaNodeConfig {
    const config = FigmaNode.createFrame("iframe");
    config.name = this.getNodeName(element);
    config.fills = this.createFills();

    const { width, height } = IframeAttributes.parseSize(element.attributes);
    config.width = width;
    config.height = height;

    this.applyStyles(config, element);

    const children: FigmaNodeConfig[] = [];
    const placeholder = this.createPlaceholder();
    children.push(placeholder);

    const src = IframeAttributes.getSrc(element.attributes);
    if (src) {
      const urlLabel = this.createUrlLabel(src);
      children.push(urlLabel);
    }

    config.children = children;
    config.layoutMode = "VERTICAL";
    config.primaryAxisAlignItems = "CENTER";
    config.counterAxisAlignItems = "CENTER";
    config.itemSpacing = URL_LABEL_CONFIG.ITEM_SPACING;

    return config;
  },

  mapToFigma(node: unknown): FigmaNodeConfig | null {
    if (this.isIframeElement(node)) {
      return this.toFigmaNode(node);
    }

    if (
      node !== null &&
      typeof node === "object" &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "iframe"
    ) {
      const attributes =
        "attributes" in node && typeof node.attributes === "object"
          ? (node.attributes as Partial<IframeAttributes>)
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
