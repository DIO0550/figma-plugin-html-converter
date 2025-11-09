import {
  FigmaNodeConfig,
  TextNodeConfig,
  TextStyle,
} from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import { AElement, type AElement as AElementType } from "../a-element";
import { buildNodeName } from "../../../../utils/node-name-builder";
import { HTMLNode } from "../../../../models/html-node/html-node";
import { applyTextStyles } from "../../common/text-style-applier";

/**
 * デフォルトスタイル定数
 */
const DEFAULT_FONT_SIZE = 16; // ブラウザデフォルトフォントサイズ
const DEFAULT_LINE_HEIGHT = 24; // デフォルト行の高さ
const DEFAULT_LINK_COLOR = { r: 0, g: 0.478, b: 1, a: 1 }; // 青色(#007AFF): HTML標準のリンク色

/**
 * AConverterクラス
 * a要素をFigmaのTEXTノードに変換します
 */
export const AConverter = {
  /**
   * a要素をFigmaノードに変換
   */
  toFigmaNode(element: AElementType): TextNodeConfig {
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
      fills: [
        {
          type: "SOLID",
          color: DEFAULT_LINK_COLOR,
        },
      ],
    };

    if (element.attributes?.style) {
      const styles = Styles.parse(element.attributes.style);
      textStyle = applyTextStyles(textStyle, styles);
    }

    const href = AElement.getHref(element);
    const nodeName = href
      ? `${buildNodeName(element)} [${href}]`
      : buildNodeName(element);

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
   * 汎用的なノードをa要素としてFigmaノードにマッピング
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    if (!AElement.isAElement(node)) {
      return null;
    }

    return this.toFigmaNode(node);
  },
};

/**
 * a要素からテキストを抽出する
 */
function extractTextFromElement(element: AElementType): string {
  if (!element.children) {
    return "";
  }

  return HTMLNode.extractTextFromNodes(element.children);
}
