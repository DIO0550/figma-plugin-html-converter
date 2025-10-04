import { FigmaNodeConfig, TextNodeConfig } from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import type { SpanElement } from "../span-element";
import { SpanElement as SpanElementHelper } from "../span-element";
import { buildNodeName } from "../../../../utils/node-name-builder";
import { HTMLNode } from "../../../../models/html-node/html-node";
import { Typography } from "../../styles/typography/typography";

/**
 * SpanConverterクラス
 * span要素をFigmaのTEXTノードに変換します
 */
export const SpanConverter = {
  /**
   * span要素をFigmaノードに変換
   */
  toFigmaNode(element: SpanElement): TextNodeConfig {
    // スタイルを解析（ブランド型 Styles をそのまま使用）
    const styles = element.attributes?.style
      ? Styles.parse(element.attributes.style)
      : Styles.empty();

    // ベースのテキストノード（最小構成）
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

    // Typographyを利用して統一的に適用（タグはspan）
    config = Typography.applyToTextNode(config, styles, "span");

    return config;
  },

  /**
   * 汎用的なノードをspan要素としてFigmaノードにマッピング
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    // 型ガードを使用してspan要素かチェック
    if (!SpanElementHelper.isSpanElement(node)) {
      return null;
    }

    return this.toFigmaNode(node);
  },
};
