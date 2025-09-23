import {
  FigmaNodeConfig,
  TextNodeConfig,
} from "../../../../../models/figma-node";
import { Styles } from "../../../../../models/styles";
import { HTMLNode } from "../../../../../models/html-node/html-node";
import type { ChildNode, ChildNodeContext } from "../../child-nodes";
import { ChildNodeConverter } from "../../child-nodes";

/**
 * 見出し要素の子要素変換結果の型
 */
export type HeadingChildResult = {
  node: FigmaNodeConfig | TextNodeConfig;
  isText: boolean;
  isBold: boolean;
  isItalic: boolean;
};

/**
 * HeadingChildResultのコンパニオンオブジェクト
 */
export const HeadingChildResult = {
  /**
   * HeadingChildResultを作成
   */
  create(
    node: FigmaNodeConfig | TextNodeConfig,
    metadata: { isText: boolean; isBold: boolean; isItalic: boolean },
  ): HeadingChildResult {
    return {
      node,
      isText: metadata.isText,
      isBold: metadata.isBold,
      isItalic: metadata.isItalic,
    };
  },
};

/**
 * 見出し要素の子要素コンバーターのコンパニオンオブジェクト
 */
export const HeadingChildConverter = {
  /**
   * HTMLNodeをChildNodeに変換（見出し用）
   */
  fromHTMLNode(
    node: HTMLNode,
    parentStyles?: Record<string, string>,
  ): ChildNode | null {
    // テキストノードの判定と内容取得（新形式）
    if (HTMLNode.isText(node)) {
      const content = node.textContent || "";
      if (content) {
        return ChildNodeConverter.from(undefined, content, parentStyles);
      }
    }

    if (!HTMLNode.isElementNode(node)) {
      return null;
    }

    const element = node as HTMLNode & { tagName?: string };
    const tagName = element.tagName?.toLowerCase();
    const textContent = HTMLNode.extractText(node);

    if (!textContent) {
      return null;
    }

    // 見出し内の要素マッピング（見出しではstrong/bは無視される）
    switch (tagName) {
      case "strong":
      case "b":
        // 見出しは既に太字なので、通常のテキストとして扱う
        return ChildNodeConverter.from(undefined, textContent, parentStyles);
      default:
        return ChildNodeConverter.from(tagName, textContent, parentStyles);
    }
  },

  /**
   * 見出しの子要素を変換
   */
  convert(
    child: HTMLNode,
    parentStyle?: string,
    elementType?: string,
  ): HeadingChildResult | null {
    const parentStyles = parentStyle ? Styles.parse(parentStyle) : {};
    const childNode = this.fromHTMLNode(child, parentStyles);

    if (!childNode) {
      return null;
    }

    const context: ChildNodeContext = {
      parentStyle,
      elementType: elementType || "h1",
      isHeading: true,
    };

    const result = ChildNodeConverter.toFigmaNode(childNode, context);
    return HeadingChildResult.create(result.node, result.metadata);
  },

  /**
   * 複数の子要素を一括変換
   */
  convertAll(
    children: HTMLNode[],
    parentStyle?: string,
    elementType?: string,
  ): HeadingChildResult[] {
    const results: HeadingChildResult[] = [];

    for (const child of children) {
      const result = this.convert(child, parentStyle, elementType);
      if (result) {
        results.push(result);
      }
    }

    return results;
  },

  /**
   * 見出しレベルを取得
   */
  getHeadingLevel(elementType: string): number {
    const match = elementType.toLowerCase().match(/^h([1-6])$/);
    return match ? parseInt(match[1], 10) : 1;
  },
};
