import type {
  FigmaNodeConfig,
  TextNodeConfig,
} from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import type { AbbrElement } from "../abbr-element";
import { AbbrElement as AbbrElementHelper } from "../abbr-element";
import { buildNodeName } from "../../../../utils/node-name-builder";
import { HTMLNode } from "../../../../models/html-node/html-node";
import { Typography } from "../../styles/typography/typography";

/**
 * AbbrConverter
 * abbr要素をFigmaのTEXTノードに変換します
 */
export const AbbrConverter = {
  /**
   * abbr要素をFigmaノードに変換
   */
  toFigmaNode(element: AbbrElement): TextNodeConfig {
    const styles = element.attributes?.style
      ? Styles.parse(element.attributes.style)
      : Styles.empty();

    // ノード名を構築（title属性がある場合は追加）
    let nodeName = buildNodeName(element);
    const title = AbbrElementHelper.getTitle(element);
    if (title) {
      nodeName = `${nodeName} [${title}]`;
    }

    // ベースのテキストノード（abbr要素のデフォルトは下線）
    let config: TextNodeConfig = {
      type: "TEXT",
      name: nodeName,
      content: HTMLNode.extractTextFromNodes(element.children || []),
      style: {
        fontFamily: "Inter",
        fontSize: 16,
        fontWeight: 400,
        lineHeight: { unit: "PIXELS", value: 24 },
        letterSpacing: 0,
        textAlign: "LEFT",
        verticalAlign: "TOP",
        textDecoration: "UNDERLINE",
      },
    };

    // Typographyを利用して統一的に適用（スタイル指定があれば上書きされる）
    config = Typography.applyToTextNode(config, styles, "abbr");

    return config;
  },

  /**
   * 汎用的なノードをabbr要素としてFigmaノードにマッピング
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    if (!AbbrElementHelper.isAbbrElement(node)) {
      return null;
    }

    return this.toFigmaNode(node);
  },
};
