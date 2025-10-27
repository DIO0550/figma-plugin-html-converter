import type { FigmaNodeConfig } from "../../../models/figma-node";
import { FigmaNode } from "../../../models/figma-node";
import { Paint } from "../../../models/paint";
import { ImgAttributes } from "../img-attributes";
import { mapToFigmaWith } from "../../../utils/element-utils";

// object-fitの定数
const OBJECT_FIT = {
  FILL: "fill",
  CONTAIN: "contain",
  COVER: "cover",
  NONE: "none",
  SCALE_DOWN: "scale-down",
} as const;

export type ObjectFit = (typeof OBJECT_FIT)[keyof typeof OBJECT_FIT];

// FigmaのScaleModeの定数
const SCALE_MODE = {
  FILL: "FILL",
  FIT: "FIT",
  CROP: "CROP",
  TILE: "TILE",
} as const;

export type ScaleMode = (typeof SCALE_MODE)[keyof typeof SCALE_MODE];

// object-fitからScaleModeへのマッピング
const OBJECT_FIT_TO_SCALE_MODE: Record<ObjectFit, ScaleMode> = {
  [OBJECT_FIT.FILL]: SCALE_MODE.FILL,
  [OBJECT_FIT.CONTAIN]: SCALE_MODE.FIT,
  [OBJECT_FIT.COVER]: SCALE_MODE.FILL,
  [OBJECT_FIT.NONE]: SCALE_MODE.CROP,
  [OBJECT_FIT.SCALE_DOWN]: SCALE_MODE.FIT,
};

/**
 * img要素の型定義
 * HTMLNodeから独立した専用の型
 */
export interface ImgElement {
  type: "element";
  tagName: "img";
  attributes: ImgAttributes;
  children?: never; // img要素は子要素を持たない
}

// デフォルト値
const DEFAULT_PLACEHOLDER_COLOR = { r: 0.8, g: 0.8, b: 0.8 };

/**
 * ImgElementコンパニオンオブジェクト
 */
export const ImgElement = {
  // 型ガード（任意のオブジェクトから判定）
  isImgElement(node: unknown): node is ImgElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "img"
    );
  },

  // ファクトリーメソッド
  create(attributes: Partial<ImgAttributes> = {}): ImgElement {
    return {
      type: "element",
      tagName: "img",
      attributes: attributes as ImgAttributes,
    };
  },

  // 属性の取得（型安全）
  getSrc(element: ImgElement): string | undefined {
    return element.attributes.src;
  },

  getAlt(element: ImgElement): string | undefined {
    return element.attributes.alt;
  },

  getWidth(element: ImgElement): string | undefined {
    return element.attributes.width;
  },

  getHeight(element: ImgElement): string | undefined {
    return element.attributes.height;
  },

  getStyle(element: ImgElement): string | undefined {
    return element.attributes.style;
  },

  // ノード名の生成
  getNodeName(element: ImgElement): string {
    const alt = this.getAlt(element);
    return alt ? `img: ${alt}` : "img";
  },

  // Fillsの作成
  createFills(element: ImgElement): Paint[] {
    const src = this.getSrc(element);

    if (ImgAttributes.isValidUrl(src)) {
      return [Paint.image(src!)];
    }

    return [Paint.solid(DEFAULT_PLACEHOLDER_COLOR)];
  },

  // object-fitの適用
  applyObjectFit(config: FigmaNodeConfig, element: ImgElement): void {
    if (!config.fills || config.fills.length === 0) return;

    const objectFit = ImgAttributes.getObjectFit(
      element.attributes,
    ) as ObjectFit | null;

    if (!objectFit) return;

    const fill = config.fills[0];
    if (fill.type !== "IMAGE") return;

    fill.scaleMode = OBJECT_FIT_TO_SCALE_MODE[objectFit] || SCALE_MODE.FILL;
  },

  // スタイルの適用
  applyStyles(config: FigmaNodeConfig, element: ImgElement): void {
    // ボーダー
    const border = ImgAttributes.getBorder(element.attributes);
    if (border) {
      FigmaNode.setStrokes(config, [Paint.solid(border.color)], border.width);
    }

    // 角丸
    const borderRadius = ImgAttributes.getBorderRadius(element.attributes);
    if (borderRadius !== null) {
      FigmaNode.setCornerRadius(config, borderRadius);
    }
  },

  // FigmaNodeConfigへの変換
  toFigmaNode(element: ImgElement): FigmaNodeConfig {
    const config = FigmaNode.createRectangle("img");

    // 基本設定
    config.name = this.getNodeName(element);
    config.fills = this.createFills(element);

    // サイズ設定
    const { width, height } = ImgAttributes.parseSize(element.attributes);
    config.width = width;
    config.height = height;

    // スタイル適用
    this.applyObjectFit(config, element);
    this.applyStyles(config, element);

    return config;
  },

  // 汎用的なHTMLNodeからの変換（後方互換性のため）
  fromHTMLNode(node: unknown): ImgElement | null {
    if (!this.isImgElement(node)) {
      // HTMLNodeのような構造から変換を試みる
      if (
        node !== null &&
        typeof node === "object" &&
        "type" in node &&
        "tagName" in node &&
        "attributes" in node &&
        node.type === "element" &&
        node.tagName === "img" &&
        typeof node.attributes === "object" &&
        node.attributes !== null
      ) {
        return this.create(node.attributes as Record<string, string>);
      }
      return null;
    }
    return node;
  },

  // マッピング関数（mapperから呼ばれる）
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigmaWith(
      node,
      "img",
      this.isImgElement,
      this.create,
      (element) => this.toFigmaNode(element),
    );
  },
};
