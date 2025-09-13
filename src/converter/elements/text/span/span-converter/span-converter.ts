import { FigmaNodeConfig, TextNodeConfig } from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import type { SpanElement } from "../span-element";
import { SpanElement as SpanElementHelper } from "../span-element";
import { buildNodeName } from "../../../../utils/node-name-builder";
import { HTMLNode } from "../../../../models/html-node/html-node";
import { Typography } from "../../styles/typography/typography";
import { CSSColor } from "../../../../models/css-values/color";

/**
 * SpanConverterクラス
 * span要素をFigmaのTEXTノードに変換します
 */
export const SpanConverter = {
  /**
   * span要素をFigmaノードに変換
   */
  toFigmaNode(element: SpanElement): TextNodeConfig {
    // スタイルを解析
    const styles: Record<string, string> = element.attributes?.style
      ? (Styles.parse(element.attributes.style) as unknown as Record<string, string>)
      : {};

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

    // span固有の互換性調整
    // 1) font-weight: 数値は範囲外でもそのまま採用（旧実装互換）
    const fw = styles["font-weight"];
    if (fw && /^-?\d+(?:\.\d+)?$/.test(fw.trim())) {
      const n = parseFloat(fw);
      if (!Number.isNaN(n)) {
        config.style.fontWeight = n;
      }
    }
    // 2) font-style: italic は小文字で保持（旧実装互換）
    if (styles["font-style"] && /italic/i.test(styles["font-style"])) {
      config.style.fontStyle = "italic";
    }

    // 3) color: rgb()/rgba() など不正値は無視（旧実装互換）
    if (styles["color"]) {
      const c = CSSColor.parse(styles["color"]);
      if (!c) {
        // 不正な場合はfillsを外す
        if ("fills" in config.style) {
          delete (config.style as any).fills;
        }
      }
    }

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
