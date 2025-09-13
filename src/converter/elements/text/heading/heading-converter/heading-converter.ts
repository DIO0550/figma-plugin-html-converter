import {
  FigmaNodeConfig,
  FigmaNode,
  TextNodeConfig,
} from "../../../../models/figma-node";
import { Styles } from "../../../../models/styles";
import { HTMLNode } from "../../../../models/html-node/html-node";
import { Typography } from "../../styles/typography/typography";
import type { H1Element } from "../h1/h1-element";
import type { H2Element } from "../h2/h2-element";
import type { H3Element } from "../h3/h3-element";
import type { H4Element } from "../h4/h4-element";
import type { H5Element } from "../h5/h5-element";
import type { H6Element } from "../h6/h6-element";

type HeadingElement =
  | H1Element
  | H2Element
  | H3Element
  | H4Element
  | H5Element
  | H6Element;

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/**
 * 見出し要素をFigmaノードに変換
 */
export function toFigmaNode(element: HeadingElement): FigmaNodeConfig {
  const level = element.tagName;
  let config = FigmaNode.createFrame(level);

  // HTML要素のデフォルト設定を適用
  config = FigmaNodeConfig.applyHtmlElementDefaults(
    config,
    level,
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
      level,
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
  headingLevel?: HeadingLevel,
): (FigmaNodeConfig | TextNodeConfig)[] {
  const result: (FigmaNodeConfig | TextNodeConfig)[] = [];
  const parentStyles = parentStyle ? Styles.parse(parentStyle) : {};

  for (const child of children) {
    if (HTMLNode.isTextNode(child)) {
      // テキストノードの処理
      const textConfig = createHeadingTextNode(
        child,
        parentStyles,
        headingLevel,
      );
      result.push(textConfig);
    } else if (HTMLNode.isElementNode(child)) {
      // インライン要素の処理
      const childElement = child as HTMLNode & { tagName: string };
      if (childElement.tagName === "strong" || childElement.tagName === "b") {
        const boldTextConfig = createBoldTextNode(
          childElement,
          parentStyles,
          headingLevel,
        );
        result.push(boldTextConfig);
      } else if (
        childElement.tagName === "em" ||
        childElement.tagName === "i"
      ) {
        const italicTextConfig = createItalicTextNode(
          childElement,
          parentStyles,
          headingLevel,
        );
        result.push(italicTextConfig);
      } else {
        // その他の要素はテキストとして処理
        const textContent = HTMLNode.extractTextContent(child as HTMLNode);
        if (textContent) {
          result.push(
            createHeadingTextNode(
              { type: "text", content: textContent },
              parentStyles,
              headingLevel,
            ),
          );
        }
      }
    }
  }

  return result;
}

/**
 * 見出し用テキストノードを作成
 */
function createHeadingTextNode(
  node: { type: string; content: string },
  parentStyles: Record<string, string>,
  headingLevel?: HeadingLevel,
): TextNodeConfig {
  const baseConfig = TextNodeConfig.create(node.content);
  // Typography統合オブジェクトを使用してスタイルを適用
  return Typography.applyToTextNode(baseConfig, parentStyles, headingLevel);
}

/**
 * 太字テキストノードを作成
 */
function createBoldTextNode(
  element: HTMLNode,
  parentStyles: Record<string, string>,
  headingLevel?: HeadingLevel,
): TextNodeConfig {
  const textContent = HTMLNode.extractTextContent(element);
  const textNode = createHeadingTextNode(
    { type: "text", content: textContent },
    parentStyles,
    headingLevel,
  );
  // 見出しは既に太字なので、そのまま返す
  return textNode;
}

/**
 * 斜体テキストノードを作成
 */
function createItalicTextNode(
  element: HTMLNode,
  parentStyles: Record<string, string>,
  headingLevel?: HeadingLevel,
): TextNodeConfig {
  const textContent = HTMLNode.extractTextContent(element);
  const textNode = createHeadingTextNode(
    { type: "text", content: textContent },
    parentStyles,
    headingLevel,
  );
  return TextNodeConfig.setFontStyle(textNode, "ITALIC");
}

/**
 * 見出し要素かどうかを判定
 */
function isHeadingElement(node: unknown): node is HeadingElement {
  if (!HTMLNode.isElementNode(node)) {
    return false;
  }
  const tagName = (node as { tagName: unknown }).tagName;
  return ["h1", "h2", "h3", "h4", "h5", "h6"].includes(tagName as string);
}

/**
 * ノードをFigmaノードにマッピング
 */
export function mapToFigma(node: unknown): FigmaNodeConfig | null {
  if (isHeadingElement(node)) {
    return toFigmaNode(node);
  }
  return null;
}

/**
 * 見出し要素のコンバーター
 * 後方互換性のためのエクスポート
 */
export const HeadingConverter = {
  toFigmaNode,
  mapToFigma,
};
