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
import { MONOSPACE_FONT_CONFIG } from "../../../../constants/typography-constants";

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

    // ベースのテキストノード（samp要素のデフォルトはモノスペースフォント）
    let config: TextNodeConfig = {
      type: "TEXT",
      name: buildNodeName(element),
      content: HTMLNode.extractTextFromNodes(element.children || []),
      style: {
        fontFamily: MONOSPACE_FONT_CONFIG.fontFamily,
        fontSize: MONOSPACE_FONT_CONFIG.fontSize,
        fontWeight: 400,
        lineHeight: { unit: "PIXELS", value: MONOSPACE_FONT_CONFIG.lineHeight },
        letterSpacing: 0,
        textAlign: "LEFT",
        verticalAlign: "TOP",
      },
    };

    // Typographyを利用して統一的に適用（スタイル指定があれば上書きされる）
    config = Typography.applyToTextNode(config, styles, "samp");

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
