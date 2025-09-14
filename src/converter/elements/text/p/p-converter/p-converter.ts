import {
  FigmaNodeConfig,
  FigmaNode,
  TextNodeConfig,
} from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import type { PElement } from "../p-element";
import { HTMLNode } from "../../../../models/html-node/html-node";
import { Typography } from "../../styles/typography/typography";

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
    if (HTMLNode.isTextNode(child)) {
      // テキストノードの処理
      const textConfig = createTextNode(child, parentStyles);
      result.push(textConfig);
    } else if (HTMLNode.isElementNode(child)) {
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
        const textContent = HTMLNode.extractTextContent(child as HTMLNode);
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
  const baseConfig = TextNodeConfig.create(node.content);
  // Typography統合オブジェクトを使用してスタイルを適用
  return Typography.applyToTextNode(baseConfig, parentStyles, "p");
}

/**
 * 太字テキストノードを作成
 */
function createBoldTextNode(
  element: HTMLNode,
  parentStyles: Record<string, string>,
): TextNodeConfig {
  const textContent = HTMLNode.extractTextContent(element);
  const baseConfig = TextNodeConfig.create(textContent);
  const styles = { ...parentStyles, "font-weight": "700" };
  return Typography.applyToTextNode(baseConfig, styles, "p");
}

/**
 * 斜体テキストノードを作成
 */
function createItalicTextNode(
  element: HTMLNode,
  parentStyles: Record<string, string>,
): TextNodeConfig {
  const textContent = HTMLNode.extractTextContent(element);
  const baseConfig = TextNodeConfig.create(textContent);
  const styles = { ...parentStyles, "font-style": "italic" };
  return Typography.applyToTextNode(baseConfig, styles, "p");
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
