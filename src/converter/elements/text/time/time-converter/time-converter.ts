import type {
  FigmaNodeConfig,
  TextNodeConfig,
} from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import type { TimeElement } from "../time-element";
import { TimeElement as TimeElementHelper } from "../time-element";
import { buildNodeName } from "../../../../utils/node-name-builder";
import { HTMLNode } from "../../../../models/html-node/html-node";
import { Typography } from "../../styles/typography/typography";

/**
 * TimeConverterクラス
 * time要素をFigmaのTEXTノードに変換します
 */
export const TimeConverter = {
  /**
   * time要素をFigmaノードに変換
   */
  toFigmaNode(element: TimeElement): TextNodeConfig {
    const styles = element.attributes?.style
      ? Styles.parse(element.attributes.style)
      : Styles.empty();

    // ノード名を構築（datetime属性がある場合は追加）
    let nodeName = buildNodeName(element);
    const datetime = TimeElementHelper.getDatetime(element);
    if (datetime) {
      nodeName = `${nodeName} [${datetime}]`;
    }

    // ベースのテキストノード
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
      },
    };

    // Typographyを利用して統一的に適用
    config = Typography.applyToTextNode(config, styles, "time");

    return config;
  },

  /**
   * 汎用的なノードをtime要素としてFigmaノードにマッピング
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    if (!TimeElementHelper.isTimeElement(node)) {
      return null;
    }

    return this.toFigmaNode(node);
  },
};
