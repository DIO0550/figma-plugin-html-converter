import { FigmaNodeConfig } from "../../../../models/figma-node";
import { BlockquoteElement } from "../blockquote-element";
import type { BlockquoteElement as BlockquoteElementType } from "../blockquote-element";
import { ElementContextConverter } from "../../base/converters";
import { HTMLFrame } from "../../../../models/figma-node/factories/html-frame";
import { Styles } from "../../../../models/styles";

/**
 * blockquote要素をFigmaノードに変換
 */
export function toFigmaNode(element: BlockquoteElementType): FigmaNodeConfig {
  const frame = HTMLFrame.from("blockquote", element.attributes);
  let baseConfig = HTMLFrame.toFigmaNodeConfig(frame);

  // スタイルを適用
  if (element.attributes?.style) {
    const styles = Styles.parse(element.attributes.style);

    const backgroundColor = Styles.getBackgroundColor(styles);
    if (backgroundColor) {
      baseConfig = FigmaNodeConfig.applyBackgroundColor(
        baseConfig,
        backgroundColor,
      );
    }

    const padding = Styles.getPadding(styles);
    if (padding) {
      baseConfig = FigmaNodeConfig.applyPaddingStyles(baseConfig, padding);
    }

    baseConfig = FigmaNodeConfig.applyBorderStyles(
      baseConfig,
      Styles.extractBorderOptions(styles),
    );

    baseConfig = FigmaNodeConfig.applySizeStyles(
      baseConfig,
      Styles.extractSizeOptions(styles),
    );
  }

  // 子要素を変換
  const children: FigmaNodeConfig[] = [];
  if (element.children && element.children.length > 0) {
    const results = ElementContextConverter.convertAll(
      element.children,
      element.attributes?.style,
      "blockquote",
    );
    children.push(...results.map((result) => result.node as FigmaNodeConfig));
  }

  return {
    ...baseConfig,
    children,
  };
}

/**
 * ノードをFigmaノードにマッピング
 */
export function mapToFigma(node: unknown): FigmaNodeConfig | null {
  // blockquote要素かどうかをチェック
  if (BlockquoteElement.isBlockquoteElement(node)) {
    return toFigmaNode(node);
  }
  return null;
}

/**
 * blockquote要素のコンバーター
 * 後方互換性のためのエクスポート
 */
export const BlockquoteConverter = {
  toFigmaNode,
  mapToFigma,
};
