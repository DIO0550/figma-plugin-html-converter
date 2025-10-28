import type { UlElement } from "../ul-element";
import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import { HTML } from "../../../../models/html";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

// デフォルトのリストスタイル定数
const DEFAULT_LIST_INDENT = 40; // デフォルトのインデント
const DEFAULT_LIST_VERTICAL_PADDING = 16; // 上下のパディング
const DEFAULT_ITEM_SPACING = 8; // リストアイテム間のスペース

/**
 * パディング値のバリデーション
 */
const isValidPadding = (value: number): boolean =>
  isFinite(value) && !isNaN(value) && value >= 0;

/**
 * ul要素をFigmaノードに変換
 */
export function toFigmaNode(element: UlElement): FigmaNodeConfig {
  return toFigmaNodeWith(
    element,
    (el) => {
      // className/classをclassに変換してapplyHtmlElementDefaultsに渡す
      const attributesForDefaults: Record<string, unknown> = {};
      if (el.attributes) {
        if (el.attributes.id) {
          attributesForDefaults.id = el.attributes.id;
        }
        // className と class の両方をサポート
        const classValue = el.attributes.className || el.attributes.class;
        if (classValue) {
          attributesForDefaults.class = classValue;
        }
      }

      const config = FigmaNode.createFrame("ul");
      const result = FigmaNodeConfig.applyHtmlElementDefaults(
        config,
        "ul",
        attributesForDefaults,
      );

      // リストの基本レイアウト設定
      result.layoutMode = "VERTICAL";
      result.layoutSizingHorizontal = "HUG";
      result.layoutSizingVertical = "HUG";

      // デフォルトのリストスタイル
      result.paddingLeft = DEFAULT_LIST_INDENT;
      result.paddingTop = DEFAULT_LIST_VERTICAL_PADDING;
      result.paddingBottom = DEFAULT_LIST_VERTICAL_PADDING;
      result.paddingRight = 0;
      result.itemSpacing = DEFAULT_ITEM_SPACING;
      result.children = [];

      return result;
    },
    {
      applyCommonStyles: true,
      customStyleApplier: (config) => {
        // NaNやInfinityの値をデフォルトに戻す
        if (!isValidPadding(config.paddingLeft ?? 0)) {
          config.paddingLeft = DEFAULT_LIST_INDENT;
        }
        if (!isValidPadding(config.paddingTop ?? 0)) {
          config.paddingTop = DEFAULT_LIST_VERTICAL_PADDING;
        }
        if (!isValidPadding(config.paddingBottom ?? 0)) {
          config.paddingBottom = DEFAULT_LIST_VERTICAL_PADDING;
        }
        if (!isValidPadding(config.paddingRight ?? 0)) {
          config.paddingRight = 0;
        }
        return config;
      },
    },
  );
}

/**
 * HTML文字列をFigmaノードに変換
 */
export function mapToFigma(html: string): FigmaNodeConfig {
  // HTMLを解析してHTMLNodeを取得
  const htmlNode = HTML.toHTMLNode(HTML.from(html));

  // ul要素であることを確認
  if (htmlNode.type !== "element" || htmlNode.tagName !== "ul") {
    throw new Error(`Expected ul element, but got ${htmlNode.tagName}`);
  }

  // UlElementに変換
  const element: UlElement = {
    type: "element",
    tagName: "ul",
    attributes: htmlNode.attributes || {},
    children: htmlNode.children || [],
  };

  return toFigmaNode(element);
}

export class UlConverter {
  toFigmaNode(element: UlElement): FigmaNodeConfig {
    return toFigmaNode(element);
  }

  mapToFigma(html: string): FigmaNodeConfig {
    return mapToFigma(html);
  }
}
