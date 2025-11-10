import {
  FigmaNodeConfig,
  TextNodeConfig,
  TextStyle,
} from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import { DelElement, type DelElement as DelElementType } from "../del-element";
import { buildNodeName } from "../../../../utils/node-name-builder";
import { HTMLNode } from "../../../../models/html-node/html-node";
import { applyTextStyles } from "../../common/text-style-applier";

/**
 * デフォルトスタイル定数
 */
const DEFAULT_FONT_SIZE = 16; // ブラウザデフォルトフォントサイズ
const DEFAULT_LINE_HEIGHT = 24; // デフォルト行の高さ

/**
 * DelConverterクラス
 * del要素をFigmaのTEXTノードに変換します
 */
export const DelConverter = {
  /**
   * del要素をFigmaノードに変換
   *
   * デフォルトスタイル:
   * - text-decoration: line-through
   *
   * @param element - 変換対象のdel要素
   * @returns Figmaノードの設定オブジェクト
   */
  toFigmaNode(element: DelElementType): TextNodeConfig {
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
      textDecoration: "STRIKETHROUGH",
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
    if (!DelElement.isDelElement(node)) {
      return null;
    }

    return this.toFigmaNode(node);
  },
};

/**
 * del要素からテキストを抽出する
 */
function extractTextFromElement(element: DelElementType): string {
  if (!element.children) {
    return "";
  }

  return HTMLNode.extractTextFromNodes(element.children);
}
