import type { FigmaNodeConfig } from "../../../models/figma-node";
import { FigmaNode } from "../../../models/figma-node";
import { Paint } from "../../../models/paint";
import { AudioAttributes } from "../audio-attributes";

// プレースホルダーの背景色（ダークグレー、オーディオプレーヤー風）
const DEFAULT_PLACEHOLDER_COLOR = { r: 0.1, g: 0.1, b: 0.1 };

/**
 * 再生ボタンの設定
 * audio要素はvideo要素より小さいUIのため、ボタンサイズを調整
 * - SIZE: 40px - audio UIに適した小さめのサイズ
 * - ICON_SIZE: 16px - ボタンサイズの40%で視覚的バランスを確保
 * - BACKGROUND_OPACITY: 0.6 - 背景を透過しつつアイコンの視認性を維持
 */
const PLAY_BUTTON_CONFIG = {
  SIZE: 40,
  BACKGROUND_COLOR: { r: 0.0, g: 0.0, b: 0.0 },
  BACKGROUND_OPACITY: 0.6,
  ICON_COLOR: { r: 1, g: 1, b: 1 },
  ICON_SIZE: 16,
} as const;

/**
 * audio要素の子要素型（source要素など）
 */
export interface AudioChildElement {
  type: "element";
  tagName: string;
  attributes: Record<string, string | boolean | undefined>;
  children?: unknown[];
}

/**
 * audio要素の型定義
 * HTMLNodeから独立した専用の型
 */
export interface AudioElement {
  type: "element";
  tagName: "audio";
  attributes: AudioAttributes;
  children: AudioChildElement[];
}

/**
 * AudioElementコンパニオンオブジェクト
 */
export const AudioElement = {
  // 型ガード（任意のオブジェクトから判定）
  isAudioElement(node: unknown): node is AudioElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "audio"
    );
  },

  // ファクトリーメソッド
  create(
    attributes: Partial<AudioAttributes> = {},
    children: AudioChildElement[] = [],
  ): AudioElement {
    return {
      type: "element",
      tagName: "audio",
      attributes: attributes as AudioAttributes,
      children,
    };
  },

  // 属性の取得（型安全）
  getSrc(element: AudioElement): string | undefined {
    return element.attributes.src;
  },

  getWidth(element: AudioElement): string | undefined {
    return element.attributes.width;
  },

  getHeight(element: AudioElement): string | undefined {
    return element.attributes.height;
  },

  hasControls(element: AudioElement): boolean {
    return AudioAttributes.hasControls(element.attributes);
  },

  getStyle(element: AudioElement): string | undefined {
    return element.attributes.style;
  },

  // source子要素からsrcを取得
  getSourceFromChildren(element: AudioElement): string | null {
    if (!element.children || element.children.length === 0) {
      return null;
    }

    for (const child of element.children) {
      if (child.tagName === "source" && child.attributes.src) {
        const src = child.attributes.src;
        if (typeof src === "string" && AudioAttributes.isValidUrl(src)) {
          return src;
        }
      }
    }

    return null;
  },

  // 音声ソースを取得（src属性またはsource子要素から）
  getAudioSource(element: AudioElement): string | null {
    const src = AudioAttributes.getAudioSrc(element.attributes);
    if (src) {
      return src;
    }

    return this.getSourceFromChildren(element);
  },

  // ノード名の生成
  getNodeName(element: AudioElement): string {
    const title = element.attributes.title;
    if (title) {
      return `audio: ${title}`;
    }

    const src = this.getAudioSource(element);
    if (src) {
      const filename = src.split("/").pop();
      if (filename) {
        return `audio: ${filename}`;
      }
    }

    return "audio";
  },

  // Fillsの作成
  createFills(_element: AudioElement): Paint[] {
    // audio要素はposter属性がないため、常にプレースホルダー色を使用
    return [Paint.solid(DEFAULT_PLACEHOLDER_COLOR)];
  },

  // スタイルの適用
  applyStyles(config: FigmaNodeConfig, element: AudioElement): void {
    const border = AudioAttributes.getBorder(element.attributes);
    if (border) {
      FigmaNode.setStrokes(config, [Paint.solid(border.color)], border.width);
    }

    const borderRadius = AudioAttributes.getBorderRadius(element.attributes);
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
  toFigmaNode(element: AudioElement): FigmaNodeConfig {
    const config = FigmaNode.createFrame("audio");
    config.name = this.getNodeName(element);
    config.fills = this.createFills(element);

    const { width, height } = AudioAttributes.parseSize(element.attributes);
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
    if (this.isAudioElement(node)) {
      return this.toFigmaNode(node);
    }

    if (
      node !== null &&
      typeof node === "object" &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "audio"
    ) {
      const attributes =
        "attributes" in node && typeof node.attributes === "object"
          ? (node.attributes as Partial<AudioAttributes>)
          : {};
      const children =
        "children" in node && Array.isArray(node.children)
          ? (node.children as AudioChildElement[])
          : [];
      const element = this.create(attributes, children);
      return this.toFigmaNode(element);
    }

    return null;
  },
};
