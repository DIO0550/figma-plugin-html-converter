import type { UlElement } from "../ul-element";
import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import { HTML } from "../../../../models/html";

/**
 * ul要素をFigmaノードに変換
 */
export function toFigmaNode(element: UlElement): FigmaNodeConfig {
  let config = FigmaNode.createFrame("ul");

  // HTML要素のデフォルト設定を適用
  // attributes を適切な形式に変換
  const htmlAttributes: Record<string, unknown> = {};
  if (element.attributes) {
    if (element.attributes.id) {
      htmlAttributes.id = element.attributes.id;
      // IDが存在する場合は名前に含める
      config.name = `ul#${element.attributes.id}`;
    }
    if (element.attributes.className)
      htmlAttributes.class = element.attributes.className;
  }

  config = FigmaNodeConfig.applyHtmlElementDefaults(
    config,
    "ul",
    htmlAttributes,
  );

  // リストの基本レイアウト設定
  config.layoutMode = "VERTICAL";
  config.layoutSizingHorizontal = "HUG";
  config.layoutSizingVertical = "HUG";

  // デフォルトのリストスタイル
  config.paddingLeft = 40; // デフォルトのインデント
  config.paddingTop = 16;
  config.paddingBottom = 16;
  config.paddingRight = 0;
  config.itemSpacing = 8; // リストアイテム間のスペース
  config.children = []; // 子要素の初期化

  // スタイルがある場合は解析して適用
  if (element.attributes?.style) {
    // UlAttributesのstyleプロパティはgetter経由で常にstring
    const styleString = element.attributes.style;

    if (styleString) {
      const styles = Styles.parse(styleString);

      // 背景色を適用
      const backgroundColor = Styles.getBackgroundColor(styles);
      if (backgroundColor) {
        config = FigmaNodeConfig.applyBackgroundColor(config, backgroundColor);
      }

      // paddingショートハンドプロパティをチェック
      const padding = Styles.getPadding(styles);
      if (padding) {
        config.paddingTop = padding.top;
        config.paddingBottom = padding.bottom;
        config.paddingLeft = padding.left;
        config.paddingRight = padding.right;
      } else {
        // 個別のパディング値を適用
        const paddingLeft = Styles.getPaddingLeft(styles);
        if (
          paddingLeft !== undefined &&
          typeof paddingLeft === "number" &&
          isFinite(paddingLeft) &&
          paddingLeft >= 0
        ) {
          config.paddingLeft = paddingLeft;
        }

        const paddingTop = Styles.getPaddingTop(styles);
        if (
          paddingTop !== undefined &&
          typeof paddingTop === "number" &&
          isFinite(paddingTop) &&
          paddingTop >= 0
        ) {
          config.paddingTop = paddingTop;
        }

        const paddingBottom = Styles.getPaddingBottom(styles);
        if (
          paddingBottom !== undefined &&
          typeof paddingBottom === "number" &&
          isFinite(paddingBottom) &&
          paddingBottom >= 0
        ) {
          config.paddingBottom = paddingBottom;
        }

        const paddingRight = Styles.getPaddingRight(styles);
        if (
          paddingRight !== undefined &&
          typeof paddingRight === "number" &&
          isFinite(paddingRight) &&
          paddingRight >= 0
        ) {
          config.paddingRight = paddingRight;
        }
      }

      // ボーダースタイルを適用
      config = FigmaNodeConfig.applyBorderStyles(
        config,
        Styles.extractBorderOptions(styles),
      );

      // サイズスタイルを適用
      config = FigmaNodeConfig.applySizeStyles(
        config,
        Styles.extractSizeOptions(styles),
      );
    }
  }

  return config;
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
