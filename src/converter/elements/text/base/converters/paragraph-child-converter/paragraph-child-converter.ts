import {
  FigmaNodeConfig,
  TextNodeConfig,
} from "../../../../../models/figma-node";
import { Styles } from "../../../../../models/styles";
import { HTMLNode } from "../../../../../models/html-node/html-node";
import type { ChildNode, ChildNodeContext } from "../../child-nodes";
import { ChildNodeConverter } from "../../child-nodes";

/**
 * 段落要素の子要素変換結果の型
 */
export type ParagraphChildResult = {
  node: FigmaNodeConfig | TextNodeConfig;
  isText: boolean;
  isBold: boolean;
  isItalic: boolean;
};

/**
 * ParagraphChildResultのコンパニオンオブジェクト
 */
export const ParagraphChildResult = {
  /**
   * ParagraphChildResultを作成
   */
  create(
    node: FigmaNodeConfig | TextNodeConfig,
    metadata: { isText: boolean; isBold: boolean; isItalic: boolean },
  ): ParagraphChildResult {
    return {
      node,
      isText: metadata.isText,
      isBold: metadata.isBold,
      isItalic: metadata.isItalic,
    };
  },
};

/**
 * 段落要素の子要素コンバーターのコンパニオンオブジェクト
 */
export const ParagraphChildConverter = {
  /**
   * HTMLNodeをChildNodeに変換（段落用）
   */
  fromHTMLNode(
    node: HTMLNode,
    parentStyles?: Record<string, string>,
  ): ChildNode | null {
    // テキストノードの判定と内容取得
    if (HTMLNode.isText(node) || HTMLNode.isTextNode(node)) {
      const content =
        HTMLNode.getTextNodeContent(node) ||
        HTMLNode.getTextContent(node) ||
        "";
      if (content) {
        return ChildNodeConverter.from(undefined, content, parentStyles);
      }
    }

    if (!HTMLNode.isElementNode(node)) {
      return null;
    }

    const element = node as HTMLNode & { tagName?: string };
    const tagName = element.tagName?.toLowerCase();
    const textContent = HTMLNode.extractTextContent(node);

    if (!textContent) {
      return null;
    }

    // 段落内の要素マッピング
    return ChildNodeConverter.from(tagName, textContent, parentStyles);
  },

  /**
   * 段落の子要素を変換
   */
  convert(
    child: HTMLNode,
    parentStyle?: string,
    elementType?: string,
  ): ParagraphChildResult | null {
    const parentStyles = parentStyle ? Styles.parse(parentStyle) : {};
    const childNode = this.fromHTMLNode(child, parentStyles);

    if (!childNode) {
      return null;
    }

    const context: ChildNodeContext = {
      parentStyle,
      elementType: elementType || "p",
      isHeading: false,
    };

    const result = ChildNodeConverter.toFigmaNode(childNode, context);
    return ParagraphChildResult.create(result.node, result.metadata);
  },

  /**
   * 複数の子要素を一括変換
   */
  convertAll(
    children: HTMLNode[],
    parentStyle?: string,
    elementType?: string,
  ): ParagraphChildResult[] {
    const results: ParagraphChildResult[] = [];

    for (const child of children) {
      const result = this.convert(child, parentStyle, elementType);
      if (result) {
        results.push(result);
      }
    }

    return results;
  },
};
