import {
  FigmaNodeConfig,
  TextNodeConfig,
  TextStyle,
} from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import { AElement, type AElement as AElementType } from "../a-element";
import { buildNodeName } from "../../../../utils/node-name-builder";
import { HTMLNode } from "../../../../models/html-node/html-node";

/**
 * AConverterクラス
 * a要素をFigmaのTEXTノードに変換します
 */
export const AConverter = {
  /**
   * a要素をFigmaノードに変換
   */
  toFigmaNode(element: AElementType): TextNodeConfig {
    // HTMLリンクのデフォルトスタイル
    // 青色(#007AFF): HTML標準のリンク色を採用
    // 16px: ブラウザデフォルトフォントサイズを基準
    let textStyle: TextStyle = {
      fontFamily: "Inter",
      fontSize: 16,
      fontWeight: 400,
      lineHeight: {
        unit: "PIXELS",
        value: 24,
      },
      letterSpacing: 0,
      textAlign: "LEFT",
      verticalAlign: "TOP",
      textDecoration: "UNDERLINE",
      fills: [
        {
          type: "SOLID",
          color: {
            r: 0,
            g: 0.478,
            b: 1,
            a: 1,
          },
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

/**
 * テキストスタイルを適用
 */
function applyTextStyles(
  textStyle: TextStyle,
  styles: Record<string, string>,
): TextStyle {
  const updatedStyle = { ...textStyle };

  const fontSize = styles["font-size"];
  if (fontSize) {
    const size = parseFontSize(fontSize);
    if (size) {
      updatedStyle.fontSize = size;
    }
  }

  const fontWeight = styles["font-weight"];
  if (fontWeight) {
    const weight = parseFontWeight(fontWeight);
    if (weight) {
      updatedStyle.fontWeight = weight;
    }
  }

  const fontStyle = styles["font-style"];
  if (fontStyle === "italic") {
    updatedStyle.fontStyle = "italic";
  }

  const fontFamily = styles["font-family"];
  if (fontFamily) {
    const family = parseFontFamily(fontFamily);
    if (family) {
      updatedStyle.fontFamily = family;
    }
  }

  const color = styles["color"];
  if (color) {
    const rgb = parseColor(color);
    if (rgb) {
      updatedStyle.fills = [
        {
          type: "SOLID",
          color: {
            ...rgb,
            a: 1,
          },
        },
      ];
    }
  }

  const textDecoration = styles["text-decoration"];
  if (textDecoration) {
    if (textDecoration === "none") {
      updatedStyle.textDecoration = undefined;
    } else if (textDecoration === "underline") {
      updatedStyle.textDecoration = "UNDERLINE";
    } else if (textDecoration === "line-through") {
      updatedStyle.textDecoration = "STRIKETHROUGH";
    }
  }

  return updatedStyle;
}

/**
 * フォントサイズをパース
 */
function parseFontSize(value: string): number | null {
  const match = value.match(/^(\d+(?:\.\d+)?)(px|pt|rem|em)?$/);
  if (match) {
    const size = parseFloat(match[1]);
    const unit = match[2];

    switch (unit) {
      case "pt":
        return Math.round(size * 1.333);
      case "rem":
      case "em":
        return Math.round(size * 16);
      default:
        return Math.round(size);
    }
  }
  return null;
}

/**
 * フォントファミリーをパース
 */
function parseFontFamily(value: string): string | null {
  const families = value.split(",").map((f) => f.trim().replace(/["']/g, ""));
  return families[0] || null;
}

/**
 * カラーをパース
 */
function parseColor(value: string): { r: number; g: number; b: number } | null {
  if (value.startsWith("#")) {
    const hex = value.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16) / 255;
      const g = parseInt(hex[1] + hex[1], 16) / 255;
      const b = parseInt(hex[2] + hex[2], 16) / 255;
      return { r, g, b };
    } else if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      return { r, g, b };
    }
  }

  const rgbMatch = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]) / 255;
    const g = parseInt(rgbMatch[2]) / 255;
    const b = parseInt(rgbMatch[3]) / 255;
    return { r, g, b };
  }

  const namedColors: Record<string, { r: number; g: number; b: number }> = {
    red: { r: 1, g: 0, b: 0 },
    blue: { r: 0, g: 0, b: 1 },
    green: { r: 0, g: 0.5, b: 0 },
    black: { r: 0, g: 0, b: 0 },
    white: { r: 1, g: 1, b: 1 },
    gray: { r: 0.5, g: 0.5, b: 0.5 },
    yellow: { r: 1, g: 1, b: 0 },
  };

  if (value in namedColors) {
    return namedColors[value];
  }

  return null;
}

/**
 * font-weightをパース
 */
function parseFontWeight(weight: string): number | null {
  if (weight === "bold") {
    return 700;
  }
  if (weight === "normal") {
    return 400;
  }
  const numericWeight = parseInt(weight);
  if (!isNaN(numericWeight)) {
    return numericWeight;
  }
  return null;
}
