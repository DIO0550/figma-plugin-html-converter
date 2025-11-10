import {
  FigmaNodeConfig,
  TextNodeConfig,
  TextStyle,
} from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import { InsElement, type InsElement as InsElementType } from "../ins-element";
import { buildNodeName } from "../../../../utils/node-name-builder";
import { HTMLNode } from "../../../../models/html-node/html-node";
import { applyTextStyles } from "../../common/text-style-applier";

/**
 * デフォルトスタイル定数
 */
const DEFAULT_FONT_SIZE = 16; // ブラウザデフォルトフォントサイズ
const DEFAULT_LINE_HEIGHT = 24; // デフォルト行の高さ

/**
 * InsConverterクラス
 * ins要素をFigmaのTEXTノードに変換します
 */
export const InsConverter = {
  /**
   * ins要素をFigmaノードに変換
   *
   * デフォルトスタイル:
   * - text-decoration: underline
   *
   * @param element - 変換対象のins要素
   * @returns Figmaノードの設定オブジェクト
   */
  toFigmaNode(element: InsElementType): TextNodeConfig {
    let textStyle: TextStyle = {
      fontFamily: "Inter",
      fontSize: DEFAULT_FONT_SIZE,
      fontWeight: 400,
      lineHeight: {
        unit: "PIXELS",
        value: DEFAULT_LINE_HEIGHT,
      },
      letterSpacing: 0,
      textAlign: "LEFT",
      verticalAlign: "TOP",
      textDecoration: "UNDERLINE",
    };

    if (element.attributes?.style) {
      const styles = Styles.parse(element.attributes.style);
      textStyle = applyTextStyles(textStyle, styles);
    }

    const nodeName = buildNodeName(element);
    const textContent = extractTextFromElement(element);

    const config: TextNodeConfig = {
      type: "TEXT",
      name: nodeName,
      content: textContent,
      style: textStyle,
    };

    return config;
  },

  /**
   * ノードをFigmaノードにマッピング
   *
   * @param node - マッピング対象のノード（unknown型）
   * @returns 変換されたFigmaノード設定、または変換できない場合はnull
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    if (!InsElement.isInsElement(node)) {
      return null;
    }

    return this.toFigmaNode(node);
  },
};

/**
 * ins要素からテキストを抽出する
 */
function extractTextFromElement(element: InsElementType): string {
  if (!element.children) {
    return "";
  }

  return HTMLNode.extractTextFromNodes(element.children);
}
