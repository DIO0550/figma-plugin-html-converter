import type { FigmaNodeConfig } from "../../../models/figma-node";
import { FigmaNode } from "../../../models/figma-node";
import { Paint } from "../../../models/paint";
import { VideoAttributes } from "../video-attributes";

// プレースホルダーの背景色（ダークグレー、動画プレーヤー風）
const DEFAULT_PLACEHOLDER_COLOR = { r: 0.1, g: 0.1, b: 0.1 };

/**
 * 再生ボタンの設定
 * YouTube/Vimeo等の主要動画プレーヤーUIを参考に設計
 * - SIZE: 64px - モバイル・デスクトップ両方でタップ/クリックしやすいサイズ
 * - ICON_SIZE: 24px - ボタンサイズの約37.5%で視覚的バランスを確保
 * - BACKGROUND_OPACITY: 0.6 - 背景を透過しつつアイコンの視認性を維持
 */
const PLAY_BUTTON_CONFIG = {
  SIZE: 64,
  BACKGROUND_COLOR: { r: 0.0, g: 0.0, b: 0.0 },
  BACKGROUND_OPACITY: 0.6,
  ICON_COLOR: { r: 1, g: 1, b: 1 },
  ICON_SIZE: 24,
} as const;

/**
 * video要素の子要素型（source要素など）
 */
export interface VideoChildElement {
  type: "element";
  tagName: string;
  attributes: Record<string, string | boolean | undefined>;
  children?: unknown[];
}

/**
 * video要素の型定義
 * HTMLNodeから独立した専用の型
 */
export interface VideoElement {
  type: "element";
  tagName: "video";
  attributes: VideoAttributes;
  children: VideoChildElement[];
}

/**
 * VideoElementコンパニオンオブジェクト
 */
export const VideoElement = {
  // 型ガード（任意のオブジェクトから判定）
  isVideoElement(node: unknown): node is VideoElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "video"
    );
  },

  // ファクトリーメソッド
  create(
    attributes: Partial<VideoAttributes> = {},
    children: VideoChildElement[] = [],
  ): VideoElement {
    return {
      type: "element",
      tagName: "video",
      attributes: attributes as VideoAttributes,
      children,
    };
  },

  // 属性の取得（型安全）
  getSrc(element: VideoElement): string | undefined {
    return element.attributes.src;
  },

  getPoster(element: VideoElement): string | undefined {
    return element.attributes.poster;
  },

  getWidth(element: VideoElement): string | undefined {
    return element.attributes.width;
  },

  getHeight(element: VideoElement): string | undefined {
    return element.attributes.height;
  },

  hasControls(element: VideoElement): boolean {
    return VideoAttributes.hasControls(element.attributes);
  },

  getStyle(element: VideoElement): string | undefined {
    return element.attributes.style;
  },

  // source子要素からsrcを取得
  getSourceFromChildren(element: VideoElement): string | null {
    if (!element.children || element.children.length === 0) {
      return null;
    }

    for (const child of element.children) {
      if (child.tagName === "source" && child.attributes.src) {
        const src = child.attributes.src;
        if (typeof src === "string" && VideoAttributes.isValidUrl(src)) {
          return src;
        }
      }
    }

    return null;
  },

  // 動画ソースを取得（src属性またはsource子要素から）
  getVideoSource(element: VideoElement): string | null {
    const src = VideoAttributes.getVideoSrc(element.attributes);
    if (src) {
      return src;
    }

    return this.getSourceFromChildren(element);
  },

  // ノード名の生成
  getNodeName(element: VideoElement): string {
    const title = element.attributes.title;
    if (title) {
      return `video: ${title}`;
    }

    const src = this.getVideoSource(element);
    if (src) {
      const filename = src.split("/").pop();
      if (filename) {
        return `video: ${filename}`;
      }
    }

    return "video";
  },

  // Fillsの作成
  createFills(element: VideoElement): Paint[] {
    const poster = VideoAttributes.getPoster(element.attributes);

    if (poster) {
      return [Paint.image(poster)];
    }

    return [Paint.solid(DEFAULT_PLACEHOLDER_COLOR)];
  },

  // スタイルの適用
  applyStyles(config: FigmaNodeConfig, element: VideoElement): void {
    const border = VideoAttributes.getBorder(element.attributes);
    if (border) {
      FigmaNode.setStrokes(config, [Paint.solid(border.color)], border.width);
    }

    const borderRadius = VideoAttributes.getBorderRadius(element.attributes);
    if (borderRadius !== null) {
      FigmaNode.setCornerRadius(config, borderRadius);
    }
  },

  /**
   * 再生アイコン（三角形）の作成
   * Figma POLYGONのデフォルト三角形は上向き（▲）のため、
   * 90度回転させて右向き（▶）の再生アイコンにする
   */
  createPlayIcon(): FigmaNodeConfig {
    const icon: FigmaNodeConfig = {
      type: "POLYGON",
      name: "play-icon",
      width: PLAY_BUTTON_CONFIG.ICON_SIZE,
      height: PLAY_BUTTON_CONFIG.ICON_SIZE,
      fills: [Paint.solid(PLAY_BUTTON_CONFIG.ICON_COLOR)],
      pointCount: 3,
      rotation: 90,
    };
    return icon;
  },

  // 再生ボタンコンテナの作成
  createPlayButton(): FigmaNodeConfig {
    const playIcon = this.createPlayIcon();

    const button: FigmaNodeConfig = {
      type: "FRAME",
      name: "play-button",
      width: PLAY_BUTTON_CONFIG.SIZE,
      height: PLAY_BUTTON_CONFIG.SIZE,
      cornerRadius: PLAY_BUTTON_CONFIG.SIZE / 2,
      fills: [
        {
          ...Paint.solid(PLAY_BUTTON_CONFIG.BACKGROUND_COLOR),
          opacity: PLAY_BUTTON_CONFIG.BACKGROUND_OPACITY,
        },
      ],
      layoutMode: "HORIZONTAL",
      primaryAxisAlignItems: "CENTER",
      counterAxisAlignItems: "CENTER",
      children: [playIcon],
    };

    return button;
  },

  // FigmaNodeConfigへの変換
  toFigmaNode(element: VideoElement): FigmaNodeConfig {
    const config = FigmaNode.createFrame("video");
    config.name = this.getNodeName(element);
    config.fills = this.createFills(element);

    const { width, height } = VideoAttributes.parseSize(element.attributes);
    config.width = width;
    config.height = height;

    this.applyStyles(config, element);

    // controls属性がある場合、再生ボタンを追加
    if (this.hasControls(element)) {
      const playButton = this.createPlayButton();
      config.children = [playButton];
      config.layoutMode = "HORIZONTAL";
      config.primaryAxisAlignItems = "CENTER";
      config.counterAxisAlignItems = "CENTER";
    }

    return config;
  },

  // マッピング関数（mapperから呼ばれる）
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    if (this.isVideoElement(node)) {
      return this.toFigmaNode(node);
    }

    if (
      node !== null &&
      typeof node === "object" &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "video"
    ) {
      const attributes =
        "attributes" in node && typeof node.attributes === "object"
          ? (node.attributes as Partial<VideoAttributes>)
          : {};
      const children =
        "children" in node && Array.isArray(node.children)
          ? (node.children as VideoChildElement[])
          : [];
      const element = this.create(attributes, children);
      return this.toFigmaNode(element);
    }

    return null;
  },
};
