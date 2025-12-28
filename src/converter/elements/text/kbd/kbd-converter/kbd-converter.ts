import type {
  FigmaNodeConfig,
  TextNodeConfig,
} from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import type { KbdElement } from "../kbd-element";
import { KbdElement as KbdElementHelper } from "../kbd-element";
import { buildNodeName } from "../../../../utils/node-name-builder";
import { HTMLNode } from "../../../../models/html-node/html-node";
import { Typography } from "../../styles/typography/typography";
import { MONOSPACE_FONT_CONFIG } from "../../../../constants/typography-constants";

/**
 * KbdConverter
 * kbd要素をFigmaのTEXTノードに変換します
 */
export const KbdConverter = {
  /**
   * kbd要素をFigmaノードに変換
   */
  toFigmaNode(element: KbdElement): TextNodeConfig {
    const styles = element.attributes?.style
      ? Styles.parse(element.attributes.style)
      : Styles.empty();

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

    config = Typography.applyToTextNode(config, styles, "kbd");

    return config;
  },

  /**
   * 汎用的なノードをkbd要素としてFigmaノードにマッピング
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    if (!KbdElementHelper.isKbdElement(node)) {
      return null;
    }

    return this.toFigmaNode(node);
  },
};
