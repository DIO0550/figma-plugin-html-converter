import { FigmaNodeConfig } from "../../../../models/figma-node";
import type { PElement } from "../p-element";
import { PElement as PElementCompanion } from "../p-element";
import { ElementContextConverter } from "../../base/converters";
import { HTMLFrame } from "../../../../models/figma-node/factories/html-frame";
import { Styles } from "../../../../models/styles";
import { mapToFigmaWith } from "../../../../utils/element-utils";

/**
 * p要素をFigmaノードに変換
 */
export function toFigmaNode(element: PElement): FigmaNodeConfig {
  const frame = HTMLFrame.from("p", element.attributes);
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
      "p",
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
  return mapToFigmaWith(
    node,
    "p",
    PElementCompanion.isPElement,
    PElementCompanion.create,
    toFigmaNode,
  );
}

/**
 * p要素のコンバーター
 * 後方互換性のためのエクスポート
 */
export const PConverter = {
  toFigmaNode,
  mapToFigma,
};
