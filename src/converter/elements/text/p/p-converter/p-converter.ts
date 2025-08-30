import {
  FigmaNodeConfig,
  FigmaNode,
  TextNodeConfig,
} from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import type { PElement } from "../p-element";
import type { HTMLNode } from "../../../../models/html-node/html-node";

/**
 * p要素をFigmaノードに変換
 */
export function toFigmaNode(element: PElement): FigmaNodeConfig {
  let config = FigmaNode.createFrame("p");

  // HTML要素のデフォルト設定を適用
  config = FigmaNodeConfig.applyHtmlElementDefaults(
    config,
    "p",
    element.attributes,
  );

  // スタイルがある場合は解析して適用
  if (element.attributes?.style) {
    const styles = Styles.parse(element.attributes.style);

    // 背景色を適用
    const backgroundColor = Styles.getBackgroundColor(styles);
    if (backgroundColor) {
      config = FigmaNodeConfig.applyBackgroundColor(config, backgroundColor);
    }

    // パディングを適用
    const padding = Styles.getPadding(styles);
    if (padding) {
      config = FigmaNodeConfig.applyPaddingStyles(config, padding);
    }

    // ボーダースタイルを適用
    config = FigmaNodeConfig.applyBorderStyles(
      config,
      Styles.extractBorderOptions(styles),
    );

    // サイズスタイルを適用
    config = FigmaNodeConfig.applySizeStyles(
      config,
      Styles.extractSizeOptions(styles),
    );
  }

  // 子要素の処理
  if (element.children && element.children.length > 0) {
    config.children = processChildren(
      element.children,
      element.attributes?.style,
    ) as FigmaNodeConfig[];
  } else {
    config.children = [];
  }

  return config;
}

/**
 * 子要素を処理してFigmaノードに変換
 */
function processChildren(
  children: HTMLNode[],
  parentStyle?: string,
): (FigmaNodeConfig | TextNodeConfig)[] {
  const result: (FigmaNodeConfig | TextNodeConfig)[] = [];
  const parentStyles = parentStyle ? Styles.parse(parentStyle) : {};

  for (const child of children) {
    if (isTextNode(child)) {
      // テキストノードの処理
      const textConfig = createTextNode(child, parentStyles);
      result.push(textConfig);
    } else if (isElementNode(child)) {
      // インライン要素の処理
      const childElement = child as HTMLNode & { tagName: string };
      if (childElement.tagName === "strong" || childElement.tagName === "b") {
        const boldTextConfig = createBoldTextNode(childElement, parentStyles);
        result.push(boldTextConfig);
      } else if (
        childElement.tagName === "em" ||
        childElement.tagName === "i"
      ) {
        const italicTextConfig = createItalicTextNode(
          childElement,
          parentStyles,
        );
        result.push(italicTextConfig);
      } else {
        // その他の要素はテキストとして処理
        const textContent = extractTextContent(child as HTMLNode);
        if (textContent) {
          result.push(
            createTextNode(
              { type: "text", content: textContent },
              parentStyles,
            ),
          );
        }
      }
    }
  }

  return result;
}

/**
 * テキストノードを作成
 */
function createTextNode(
  node: { type: string; content: string },
  parentStyles: Record<string, string>,
): TextNodeConfig {
  const textConfig = TextNodeConfig.create(node.content);

  // フォントサイズの処理
  if (parentStyles["font-size"]) {
    const sizeValue = Styles.parseSize(parentStyles["font-size"]);
    if (typeof sizeValue === "number") {
      textConfig.style.fontSize = sizeValue;
      // line-heightが指定されていない場合は、フォントサイズに基づいて調整
      if (!parentStyles["line-height"]) {
        textConfig.style.lineHeight.value = sizeValue * 1.5;
      }
    }
  }

  // 行の高さの処理
  if (parentStyles["line-height"]) {
    const lineHeightValue = parentStyles["line-height"];
    // 数値のみの場合は倍率として扱う
    const numericValue = parseFloat(lineHeightValue);
    if (!isNaN(numericValue)) {
      textConfig.style.lineHeight.value =
        textConfig.style.fontSize * numericValue;
    } else {
      // px値などの単位付きの場合
      const sizeValue = Styles.parseSize(lineHeightValue);
      if (typeof sizeValue === "number") {
        textConfig.style.lineHeight.value = sizeValue;
      }
    }
  }

  // テキスト配置の処理
  if (parentStyles["text-align"]) {
    const textAlign = parentStyles["text-align"].toUpperCase();
    if (["LEFT", "CENTER", "RIGHT", "JUSTIFY"].includes(textAlign)) {
      textConfig.style.textAlign = textAlign;
    }
  }

  // カラーの処理
  if (parentStyles["color"]) {
    const color = Styles.parseColor(parentStyles["color"]);
    if (color) {
      textConfig.style.fills = [
        {
          type: "SOLID",
          color: {
            r: color.r,
            g: color.g,
            b: color.b,
            a: 1,
          },
        },
      ];
    }
  }

  return textConfig;
}

/**
 * 太字テキストノードを作成
 */
function createBoldTextNode(
  element: HTMLNode,
  parentStyles: Record<string, string>,
): TextNodeConfig {
  const textContent = extractTextContent(element);
  const textNode = createTextNode(
    { type: "text", content: textContent },
    parentStyles,
  );
  return TextNodeConfig.setFontWeight(textNode, 700);
}

/**
 * 斜体テキストノードを作成
 */
function createItalicTextNode(
  element: HTMLNode,
  parentStyles: Record<string, string>,
): TextNodeConfig {
  const textContent = extractTextContent(element);
  const textNode = createTextNode(
    { type: "text", content: textContent },
    parentStyles,
  );
  return TextNodeConfig.setFontStyle(textNode, "ITALIC");
}

/**
 * 要素からテキストコンテンツを抽出
 */
function extractTextContent(element: HTMLNode): string {
  if (!element.children || element.children.length === 0) {
    return "";
  }

  let text = "";
  for (const child of element.children) {
    if (isTextNode(child)) {
      text += child.content;
    } else if (isElementNode(child)) {
      text += extractTextContent(child);
    }
  }
  return text;
}

/**
 * テキストノードかどうかを判定
 */
function isTextNode(node: unknown): node is { type: string; content: string } {
  return (
    node !== null &&
    typeof node === "object" &&
    "type" in node &&
    node.type === "text" &&
    "content" in node &&
    typeof node.content === "string"
  );
}

/**
 * 要素ノードかどうかを判定
 */
function isElementNode(node: unknown): boolean {
  return (
    node !== null &&
    typeof node === "object" &&
    "type" in node &&
    node.type === "element" &&
    "tagName" in node &&
    typeof (node as { tagName: unknown }).tagName === "string"
  );
}

/**
 * ノードをFigmaノードにマッピング
 */
export function mapToFigma(node: unknown): FigmaNodeConfig | null {
  // p要素かどうかをチェック
  if (
    node !== null &&
    typeof node === "object" &&
    "type" in node &&
    "tagName" in node &&
    node.type === "element" &&
    node.tagName === "p"
  ) {
    const element = node as PElement;
    return toFigmaNode(element);
  }
  return null;
}

/**
 * p要素のコンバーター
 * 後方互換性のためのエクスポート
 */
export const PConverter = {
  toFigmaNode,
  mapToFigma,
};
