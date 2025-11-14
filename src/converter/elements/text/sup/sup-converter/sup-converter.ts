import {
  FigmaNodeConfig,
  TextNodeConfig,
  TextStyle,
} from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import { SupElement, type SupElement as SupElementType } from "../sup-element";
import { buildNodeName } from "../../../../utils/node-name-builder";
import { HTMLNode } from "../../../../models/html-node/html-node";
import { applyTextStyles } from "../../common/text-style-applier";

/**
 * デフォルトスタイル定数
 */
const DEFAULT_FONT_SIZE = 16; // ブラウザデフォルトフォントサイズ
const DEFAULT_LINE_HEIGHT = 24; // デフォルト行の高さ
const SUPERSCRIPT_FONT_SIZE_RATIO = 0.75; // 上付き文字のフォントサイズ比率（75%）

/**
 * SupConverterクラス
 * sup要素をFigmaのTEXTノードに変換します
 */
export const SupConverter = {
  /**
   * sup要素をFigmaノードに変換
   *
   * デフォルトスタイル:
   * - font-size: 0.75em（親フォントサイズの75% = 12px）
   * - vertical-align: super（上付き配置）
   *
   * @param element - 変換対象のsup要素
   * @returns Figmaノードの設定オブジェクト
   */
  toFigmaNode(element: SupElementType): TextNodeConfig {
    const defaultFontSize = DEFAULT_FONT_SIZE * SUPERSCRIPT_FONT_SIZE_RATIO;

    let textStyle: TextStyle = {
      fontFamily: "Inter",
      fontSize: defaultFontSize,
      fontWeight: 400,
      lineHeight: {
        unit: "PIXELS",
        value: DEFAULT_LINE_HEIGHT,
      },
      letterSpacing: 0,
      textAlign: "LEFT",
      verticalAlign: "TOP",
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
    if (!SupElement.isSupElement(node)) {
      return null;
    }

    return this.toFigmaNode(node);
  },
};

/**
 * sup要素からテキストを抽出する
 */
function extractTextFromElement(element: SupElementType): string {
  if (!element.children) {
    return "";
  }

  return HTMLNode.extractTextFromNodes(element.children);
}
