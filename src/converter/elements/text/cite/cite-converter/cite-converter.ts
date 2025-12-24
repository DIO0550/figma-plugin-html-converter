import type {
  FigmaNodeConfig,
  TextNodeConfig,
} from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import type { CiteElement } from "../cite-element";
import { CiteElement as CiteElementHelper } from "../cite-element";
import { buildNodeName } from "../../../../utils/node-name-builder";
import { HTMLNode } from "../../../../models/html-node/html-node";
import { Typography } from "../../styles/typography/typography";

/**
 * CiteConverterクラス
 * cite要素をFigmaのTEXTノードに変換します
 */
export const CiteConverter = {
  /**
   * cite要素をFigmaノードに変換
   */
  toFigmaNode(element: CiteElement): TextNodeConfig {
    const styles = element.attributes?.style
      ? Styles.parse(element.attributes.style)
      : Styles.empty();

    // ベースのテキストノード
    let config: TextNodeConfig = {
      type: "TEXT",
      name: buildNodeName(element),
      content: HTMLNode.extractTextFromNodes(element.children || []),
      style: {
        fontFamily: "Inter",
        fontSize: 16,
        fontWeight: 400,
        lineHeight: { unit: "PIXELS", value: 24 },
        letterSpacing: 0,
        textAlign: "LEFT",
        verticalAlign: "TOP",
      },
    };

    // Typographyを利用して統一的に適用
    config = Typography.applyToTextNode(config, styles, "cite");

    // cite要素のデフォルトスタイル（イタリック）を維持（スタイルで明示的に指定されていない場合）
    const rawStyles = element.attributes?.style || "";
    if (!rawStyles.includes("font-style") && config.style) {
      config = {
        ...config,
        style: {
          ...config.style,
          fontStyle: "italic",
        },
      };
    }

    return config;
  },

  /**
   * 汎用的なノードをcite要素としてFigmaノードにマッピング
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    if (!CiteElementHelper.isCiteElement(node)) {
      return null;
    }

    return this.toFigmaNode(node);
  },
};
