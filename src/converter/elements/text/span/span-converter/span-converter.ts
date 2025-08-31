import {
  FigmaNodeConfig,
  TextNodeConfig,
  TextStyle,
} from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import type { SpanElement } from "../span-element";
import type { HTMLNode } from "../../../../models/html-node/html-node";
import { SpanElement as SpanElementHelper } from "../span-element";

/**
 * SpanConverterクラス
 * span要素をFigmaのTEXTノードに変換します
 */
export const SpanConverter = {
  /**
   * span要素をFigmaノードに変換
   */
  toFigmaNode(element: SpanElement): TextNodeConfig {
    // デフォルトのテキストスタイルを作成
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
    };

    // スタイルがある場合は解析して適用
    if (element.attributes?.style) {
      const styles = Styles.parse(element.attributes.style);
      textStyle = applyTextStyles(textStyle, styles);
    }

    // ベースのテキストノード設定を作成
    const config: TextNodeConfig = {
      type: "TEXT",
      name: buildNodeName(element),
      content: extractAllText(element),
      style: textStyle,
    };

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

/**
 * ノード名を構築
 */
function buildNodeName(element: SpanElement): string {
  let name = "span";

  if (element.attributes?.id) {
    name += `#${element.attributes.id}`;
  }

  if (element.attributes?.class) {
    const classes = element.attributes.class.split(" ").filter(Boolean);
    if (classes.length > 0) {
      name += `.${classes.join(".")}`;
    }
  }

  return name;
}

/**
 * 要素から全てのテキストを抽出
 */
function extractAllText(element: SpanElement): string {
  if (!element.children || element.children.length === 0) {
    return "";
  }

  const visited = new WeakSet<object>();
  return extractAllTextRecursive(element, visited);
}

/**
 * 再帰的にテキストを抽出（循環参照対策付き）
 */
function extractAllTextRecursive(
  element: SpanElement,
  visited: WeakSet<object>,
): string {
  // 循環参照のチェック
  if (visited.has(element)) {
    return "";
  }
  visited.add(element);

  if (!element.children || element.children.length === 0) {
    return "";
  }

  return element.children
    .filter((child) => child != null) // null/undefinedを除外
    .map((child) => extractTextFromNode(child, visited))
    .join("");
}

/**
 * ノードからテキストを再帰的に抽出
 */
function extractTextFromNode(
  node: HTMLNode,
  visited: WeakSet<object> = new WeakSet(),
): string {
  // null/undefinedチェック
  if (!node) {
    return "";
  }

  // 循環参照のチェック
  if (visited.has(node)) {
    return "";
  }
  visited.add(node);

  if (isTextNode(node)) {
    return node.textContent || "";
  }

  if (isElementNode(node) && node.children) {
    return node.children
      .filter((child) => child != null) // null/undefinedを除外
      .map((child) => extractTextFromNode(child, visited))
      .join("");
  }

  return "";
}

/**
 * テキストノードかどうかを判定
 */
function isTextNode(
  node: HTMLNode,
): node is HTMLNode & { textContent: string } {
  return node.type === "text" && "textContent" in node;
}

/**
 * 要素ノードかどうかを判定
 */
function isElementNode(
  node: HTMLNode,
): node is HTMLNode & { tagName: string; children?: HTMLNode[] } {
  return node.type === "element" && "tagName" in node;
}

/**
 * テキストスタイルを適用
 */
function applyTextStyles(
  textStyle: TextStyle,
  styles: Record<string, string>,
): TextStyle {
  const updatedStyle = { ...textStyle };

  // font-size
  const fontSize = styles["font-size"];
  if (fontSize) {
    const size = parseFontSize(fontSize);
    if (size) {
      updatedStyle.fontSize = size;
    }
  }

  // font-weight
  const fontWeight = styles["font-weight"];
  if (fontWeight) {
    const weight = parseFontWeight(fontWeight);
    if (weight) {
      updatedStyle.fontWeight = weight;
    }
  }

  // font-style
  const fontStyle = styles["font-style"];
  if (fontStyle === "italic") {
    updatedStyle.fontStyle = "italic";
  }

  // font-family
  const fontFamily = styles["font-family"];
  if (fontFamily) {
    const family = parseFontFamily(fontFamily);
    if (family) {
      updatedStyle.fontFamily = family;
    }
  }

  // color
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

  // text-decoration - TextStyleには存在しないのでスキップ
  // text-transform - TextStyleには存在しないのでスキップ

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

    // 単位に応じて変換
    switch (unit) {
      case "pt":
        return Math.round(size * 1.333); // pt to px
      case "rem":
      case "em":
        return Math.round(size * 16); // rem/em to px (assuming 16px base)
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
  // クォートを削除して最初のフォントファミリーを取得
  const families = value.split(",").map((f) => f.trim().replace(/["']/g, ""));
  return families[0] || null;
}

/**
 * カラーをパース
 */
function parseColor(value: string): { r: number; g: number; b: number } | null {
  // HEX形式
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

  // 名前付きカラー
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
