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

    // ベースのテキストノード（下線がデフォルト）
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

    // Typographyを利用して統一的に適用
    config = Typography.applyToTextNode(config, styles, "abbr");

    // abbr要素のデフォルト装飾を維持（スタイルで明示的に指定されていない場合）
    if (!styles["text-decoration"] && config.style) {
      config = {
        ...config,
        style: {
          ...config.style,
          textDecoration: "UNDERLINE",
        },
      };
    }

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
