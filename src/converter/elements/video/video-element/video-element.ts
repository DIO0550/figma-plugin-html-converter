import type { FigmaNodeConfig } from "../../../models/figma-node";
import { FigmaNode } from "../../../models/figma-node";
import { Paint } from "../../../models/paint";
import { VideoAttributes } from "../video-attributes";
import { mapToFigmaWith } from "../../../utils/element-utils";

// プレースホルダーの背景色（ダークグレー、動画プレーヤー風）
const DEFAULT_PLACEHOLDER_COLOR = { r: 0.1, g: 0.1, b: 0.1 };

// 再生ボタンの設定
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

    // source要素を探す
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
    // src属性を優先
    const src = VideoAttributes.getVideoSrc(element.attributes);
    if (src) {
      return src;
    }

    // source子要素から取得
    return this.getSourceFromChildren(element);
  },

  // ノード名の生成
  getNodeName(element: VideoElement): string {
    // titleがあればそれを使用
    const title = element.attributes.title;
    if (title) {
      return `video: ${title}`;
    }

    // 動画ソースからファイル名を抽出
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

    // poster属性がある場合は画像として表示
    if (poster) {
      return [Paint.image(poster)];
    }

    // poster属性がない場合はダーク背景
    return [Paint.solid(DEFAULT_PLACEHOLDER_COLOR)];
  },

  // スタイルの適用
  applyStyles(config: FigmaNodeConfig, element: VideoElement): void {
    // ボーダー
    const border = VideoAttributes.getBorder(element.attributes);
    if (border) {
      FigmaNode.setStrokes(config, [Paint.solid(border.color)], border.width);
    }

    // 角丸
    const borderRadius = VideoAttributes.getBorderRadius(element.attributes);
    if (borderRadius !== null) {
      FigmaNode.setCornerRadius(config, borderRadius);
    }
  },

  // 再生アイコン（三角形）の作成
  createPlayIcon(): FigmaNodeConfig {
    const icon: FigmaNodeConfig = {
      type: "POLYGON",
      name: "play-icon",
      width: PLAY_BUTTON_CONFIG.ICON_SIZE,
      height: PLAY_BUTTON_CONFIG.ICON_SIZE,
      fills: [Paint.solid(PLAY_BUTTON_CONFIG.ICON_COLOR)],
      // 三角形は3点のポリゴン
      pointCount: 3,
      // 90度回転して右向き三角形に
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
      // 円形にするため、サイズの半分の角丸
      cornerRadius: PLAY_BUTTON_CONFIG.SIZE / 2,
      fills: [
        {
          ...Paint.solid(PLAY_BUTTON_CONFIG.BACKGROUND_COLOR),
          opacity: PLAY_BUTTON_CONFIG.BACKGROUND_OPACITY,
        },
      ],
      // 子要素を中央揃え
      layoutMode: "HORIZONTAL",
      primaryAxisAlignItems: "CENTER",
      counterAxisAlignItems: "CENTER",
      children: [playIcon],
    };

    return button;
  },

  // FigmaNodeConfigへの変換
  toFigmaNode(element: VideoElement): FigmaNodeConfig {
    // FRAMEを使用（プレースホルダーとして子要素を持てるように）
    const config = FigmaNode.createFrame("video");

    // 基本設定
    config.name = this.getNodeName(element);
    config.fills = this.createFills(element);

    // サイズ設定
    const { width, height } = VideoAttributes.parseSize(element.attributes);
    config.width = width;
    config.height = height;

    // スタイル適用
    this.applyStyles(config, element);

    // controls属性がある場合、再生ボタンを追加
    if (this.hasControls(element)) {
      const playButton = this.createPlayButton();
      config.children = [playButton];

      // 子要素を中央に配置するためのレイアウト設定
      config.layoutMode = "HORIZONTAL";
      config.primaryAxisAlignItems = "CENTER";
      config.counterAxisAlignItems = "CENTER";
    }

    return config;
  },

  // 汎用的なHTMLNodeからの変換（後方互換性のため）
  fromHTMLNode(node: unknown): VideoElement | null {
    if (!this.isVideoElement(node)) {
      // HTMLNodeのような構造から変換を試みる
      if (
        node !== null &&
        typeof node === "object" &&
        "type" in node &&
        "tagName" in node &&
        "attributes" in node &&
        node.type === "element" &&
        node.tagName === "video" &&
        typeof node.attributes === "object" &&
        node.attributes !== null
      ) {
        const children =
          "children" in node && Array.isArray(node.children)
            ? (node.children as VideoChildElement[])
            : [];
        return this.create(node.attributes as Record<string, string>, children);
      }
      return null;
    }
    return node;
  },

  // マッピング関数（mapperから呼ばれる）
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigmaWith(
      node,
      "video",
      this.isVideoElement,
      (attrs) => this.create(attrs as Partial<VideoAttributes>),
      (element) => this.toFigmaNode(element),
    );
  },
};
