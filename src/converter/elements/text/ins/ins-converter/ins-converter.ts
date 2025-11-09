import {
  FigmaNodeConfig,
  TextNodeConfig,
  TextStyle,
} from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import { InsElement, type InsElement as InsElementType } from "../ins-element";
import { buildNodeName } from "../../../../utils/node-name-builder";
import { HTMLNode } from "../../../../models/html-node/html-node";
import { FontFamily } from "../../styles/typography/font-family/font-family";
import { FontSize } from "../../styles/typography/font-size/font-size";
import { FontWeight } from "../../styles/typography/font-weight/font-weight";
import { FontStyle } from "../../styles/typography/font-style/font-style";
import { TextColor } from "../../styles/typography/text-color/text-color";
import { TextDecoration } from "../../styles/decoration/text-decoration/text-decoration";

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

/**
 * テキストスタイルを適用
 */
function applyTextStyles(
  textStyle: TextStyle,
  styles: Record<string, string>,
): TextStyle {
  const updatedStyle = { ...textStyle };

  // フォントサイズの処理
  const fontSize = FontSize.extractStyle(styles);
  if (fontSize !== undefined) {
    updatedStyle.fontSize = fontSize;
  }

  // フォントウェイトの処理
  const fontWeight = FontWeight.extractStyle(styles);
  if (fontWeight !== undefined) {
    updatedStyle.fontWeight = fontWeight;
  }

  // フォントスタイルの処理
  const fontStyleValue = styles["font-style"];
  if (fontStyleValue) {
    const fontStyle = FontStyle.parse(fontStyleValue);
    if (fontStyle) {
      updatedStyle.fontStyle = FontStyle.toFigmaStyle(fontStyle);
    }
  }

  // フォントファミリーの処理
  const fontFamily = styles["font-family"];
  if (fontFamily) {
    const family = FontFamily.parse(fontFamily);
    if (family) {
      updatedStyle.fontFamily = family;
    }
  }

  // カラーの処理
  const color = styles["color"];
  if (color) {
    const textColor = TextColor.parse(color);
    if (textColor) {
      updatedStyle.fills = TextColor.toFills(textColor);
    }
  }

  // テキスト装飾の処理
  const textDecorationValue = styles["text-decoration"];
  if (textDecorationValue) {
    if (textDecorationValue === "none") {
      updatedStyle.textDecoration = undefined;
    } else {
      const textDecoration = TextDecoration.parse(textDecorationValue);
      if (textDecoration !== undefined) {
        updatedStyle.textDecoration = textDecoration;
      }
    }
  }

  return updatedStyle;
}
