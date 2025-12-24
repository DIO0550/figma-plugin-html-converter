import type {
  FigmaNodeConfig,
  TextNodeConfig,
} from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import type { QElement } from "../q-element";
import { QElement as QElementHelper } from "../q-element";
import { buildNodeName } from "../../../../utils/node-name-builder";
import { HTMLNode } from "../../../../models/html-node/html-node";
import { Typography } from "../../styles/typography/typography";

/**
 * QConverterクラス
 * q要素をFigmaのTEXTノードに変換します
 */
export const QConverter = {
  /**
   * q要素をFigmaノードに変換
   */
  toFigmaNode(element: QElement): TextNodeConfig {
    const styles = element.attributes?.style
      ? Styles.parse(element.attributes.style)
      : Styles.empty();

    // ノード名を構築（cite属性がある場合は追加）
    let nodeName = buildNodeName(element);
    const cite = QElementHelper.getCite(element);
    if (cite) {
      nodeName = `${nodeName} [${cite}]`;
    }

    // テキストコンテンツを取得し、引用符で囲む
    const textContent = HTMLNode.extractTextFromNodes(element.children || []);
    const quotedContent = `"${textContent}"`;

    // ベースのテキストノード
    let config: TextNodeConfig = {
      type: "TEXT",
      name: nodeName,
      content: quotedContent,
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
    config = Typography.applyToTextNode(config, styles, "q");

    return config;
  },

  /**
   * 汎用的なノードをq要素としてFigmaノードにマッピング
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    if (!QElementHelper.isQElement(node)) {
      return null;
    }

    return this.toFigmaNode(node);
  },
};
