import type { FigmaNodeConfig } from "../../../models/figma-node";
import { FigmaNode } from "../../../models/figma-node";
import { Paint } from "../../../models/paint";
import { IframeAttributes } from "../iframe-attributes";

// プレースホルダーの背景色（ライトグレー、埋め込みコンテンツ風）
const DEFAULT_PLACEHOLDER_COLOR = { r: 0.94, g: 0.94, b: 0.94 };

// アイコンの設定
const ICON_CONFIG = {
  SIZE: 48,
  BORDER_COLOR: { r: 0.6, g: 0.6, b: 0.6 },
  BORDER_WIDTH: 2,
  INNER_SIZE: 40,
  HEADER_HEIGHT: 10,
  HEADER_COLOR: { r: 0.7, g: 0.7, b: 0.7 },
} as const;

// URLラベルの設定
const URL_LABEL_CONFIG = {
  MAX_LENGTH: 47,
  FONT_SIZE: 12,
  COLOR: { r: 0.5, g: 0.5, b: 0.5 },
} as const;

/**
 * iframe要素の型定義
 * HTMLNodeから独立した専用の型
 */
export interface IframeElement {
  type: "element";
  tagName: "iframe";
  attributes: IframeAttributes;
}

/**
 * IframeElementコンパニオンオブジェクト
 */
export const IframeElement = {
  // 型ガード（任意のオブジェクトから判定）
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

  // ファクトリーメソッド
  create(attributes: Partial<IframeAttributes> = {}): IframeElement {
    return {
      type: "element",
      tagName: "iframe",
      attributes: attributes as IframeAttributes,
    };
  },

  // 属性の取得（型安全）
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

  // ノード名の生成
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
        // 相対URLの場合はデフォルト名を返す
        return "iframe";
      }
    }

    return "iframe";
  },

  // Fillsの作成
  createFills(): Paint[] {
    return [Paint.solid(DEFAULT_PLACEHOLDER_COLOR)];
  },

  // スタイルの適用
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

  /**
   * iframeアイコン（ブラウザウィンドウ風）の作成
   */
  createPlaceholder(): FigmaNodeConfig {
    // ブラウザウィンドウ風のアイコン
    const iconFrame: FigmaNodeConfig = {
      type: "FRAME",
      name: "iframe-icon",
      width: ICON_CONFIG.SIZE,
      height: ICON_CONFIG.SIZE,
      fills: [Paint.solid({ r: 1, g: 1, b: 1 })],
      strokes: [Paint.solid(ICON_CONFIG.BORDER_COLOR)],
      strokeWeight: ICON_CONFIG.BORDER_WIDTH,
      cornerRadius: 4,
      layoutMode: "VERTICAL",
      primaryAxisAlignItems: "CENTER",
      counterAxisAlignItems: "CENTER",
      children: [
        // ヘッダーバー（ブラウザのタイトルバー風）
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

  /**
   * URLラベルの作成
   */
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

  // FigmaNodeConfigへの変換
  toFigmaNode(element: IframeElement): FigmaNodeConfig {
    const config = FigmaNode.createFrame("iframe");
    config.name = this.getNodeName(element);
    config.fills = this.createFills();

    const { width, height } = IframeAttributes.parseSize(element.attributes);
    config.width = width;
    config.height = height;

    this.applyStyles(config, element);

    // プレースホルダーコンテンツを追加
    const children: FigmaNodeConfig[] = [];

    // iframeアイコン
    const placeholder = this.createPlaceholder();
    children.push(placeholder);

    // src属性がある場合はURLラベルを追加
    const src = IframeAttributes.getSrc(element.attributes);
    if (src) {
      const urlLabel = this.createUrlLabel(src);
      children.push(urlLabel);
    }

    config.children = children;
    config.layoutMode = "VERTICAL";
    config.primaryAxisAlignItems = "CENTER";
    config.counterAxisAlignItems = "CENTER";
    config.itemSpacing = 8;

    return config;
  },

  // マッピング関数（mapperから呼ばれる）
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
      const element = this.create(attributes);
      return this.toFigmaNode(element);
    }

    return null;
  },
};
