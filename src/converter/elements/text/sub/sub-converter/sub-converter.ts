import {
  FigmaNodeConfig,
  TextNodeConfig,
  TextStyle,
} from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import { SubElement, type SubElement as SubElementType } from "../sub-element";
import { buildNodeName } from "../../../../utils/node-name-builder";
import { HTMLNode } from "../../../../models/html-node/html-node";
import { applyTextStyles } from "../../common/text-style-applier";

/**
 * デフォルトスタイル定数
 */
const DEFAULT_FONT_SIZE = 16; // ブラウザデフォルトフォントサイズ
const DEFAULT_LINE_HEIGHT = 24; // デフォルト行の高さ
const SUBSCRIPT_SCALE = 0.75; // sub要素のフォントサイズ比率

/**
 * SubConverterクラス
 * sub要素をFigmaのTEXTノードに変換します
 */
export const SubConverter = {
  /**
   * sub要素をFigmaノードに変換
   *
   * デフォルトスタイル:
   * - font-size: 12px (親の75%)
   * - vertical-align: subscript
   *
   * @param element - 変換対象のsub要素
   * @returns Figmaノードの設定オブジェクト
   */
  toFigmaNode(element: SubElementType): TextNodeConfig {
    let textStyle: TextStyle = {
      fontFamily: "Inter",
      fontSize: DEFAULT_FONT_SIZE * SUBSCRIPT_SCALE,
      fontWeight: 400,
      lineHeight: {
        unit: "PIXELS",
        value: DEFAULT_LINE_HEIGHT * SUBSCRIPT_SCALE,
      },
      letterSpacing: 0,
      textAlign: "LEFT",
      verticalAlign: "SUBSCRIPT",
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
    if (!SubElement.isSubElement(node)) {
      return null;
    }

    return this.toFigmaNode(node);
  },
};

/**
 * sub要素からテキストを抽出する
 */
function extractTextFromElement(element: SubElementType): string {
  if (!element.children) {
    return "";
  }

  return HTMLNode.extractTextFromNodes(element.children);
}
