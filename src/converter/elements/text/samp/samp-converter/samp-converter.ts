import type {
  FigmaNodeConfig,
  TextNodeConfig,
} from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import type { SampElement } from "../samp-element";
import { SampElement as SampElementHelper } from "../samp-element";
import { buildNodeName } from "../../../../utils/node-name-builder";
import { HTMLNode } from "../../../../models/html-node/html-node";
import { Typography } from "../../styles/typography/typography";

/**
 * SampConverter
 * samp要素をFigmaのTEXTノードに変換します
 */
export const SampConverter = {
  /**
   * samp要素をFigmaノードに変換
   */
  toFigmaNode(element: SampElement): TextNodeConfig {
    const styles = element.attributes?.style
      ? Styles.parse(element.attributes.style)
      : Styles.empty();

    // ベースのテキストノード（モノスペースフォントがデフォルト）
    let config: TextNodeConfig = {
      type: "TEXT",
      name: buildNodeName(element),
      content: HTMLNode.extractTextFromNodes(element.children || []),
      style: {
        fontFamily: "monospace",
        fontSize: 14,
        fontWeight: 400,
        lineHeight: { unit: "PIXELS", value: 21 },
        letterSpacing: 0,
        textAlign: "LEFT",
        verticalAlign: "TOP",
      },
    };

    // Typographyを利用して統一的に適用
    config = Typography.applyToTextNode(config, styles, "samp");

    // samp要素のデフォルトフォントを維持（スタイルで明示的に指定されていない場合）
    if (!styles["font-family"] && config.style) {
      config = {
        ...config,
        style: {
          ...config.style,
          fontFamily: "monospace",
        },
      };
    }

    return config;
  },

  /**
   * 汎用的なノードをsamp要素としてFigmaノードにマッピング
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    if (!SampElementHelper.isSampElement(node)) {
      return null;
    }

    return this.toFigmaNode(node);
  },
};
