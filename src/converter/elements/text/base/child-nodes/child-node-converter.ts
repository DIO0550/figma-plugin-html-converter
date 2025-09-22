import type { ChildNode, ChildNodeContext, ChildNodeResult } from "./index";
import { TextChildNode } from "./text-node";
import { BoldChildNode } from "./bold-node";
import { ItalicChildNode } from "./italic-node";
import { StrongChildNode } from "./strong-node";
import { EmChildNode } from "./em-node";
import { BChildNode } from "./b-node";
import { IChildNode } from "./i-node";
import { OtherChildNode } from "./other-node";

/**
 * 統合ChildNodeコンバーター
 */
export const ChildNodeConverter = {
  /**
   * HTMLテキストからChildNodeを生成
   */
  from(
    tagName: string | undefined,
    content: string,
    styles?: Record<string, string>,
  ): ChildNode {
    if (!tagName) {
      return TextChildNode.from(content, styles);
    }

    const lowerTagName = tagName.toLowerCase();
    switch (lowerTagName) {
      case "b":
        return BChildNode.from(content, styles);
      case "i":
        return IChildNode.from(content, styles);
      case "strong":
        return StrongChildNode.from(content, styles);
      case "em":
        return EmChildNode.from(content, styles);
      case "bold":
        return BoldChildNode.from(content, styles);
      case "italic":
        return ItalicChildNode.from(content, styles);
      default:
        return OtherChildNode.from(lowerTagName, content, styles);
    }
  },

  /**
   * ChildNodeからFigmaノードに変換
   */
  toFigmaNode(node: ChildNode, context: ChildNodeContext): ChildNodeResult {
    switch (node.kind) {
      case "text":
        return TextChildNode.toFigmaNode(node, context);
      case "bold":
        return BoldChildNode.toFigmaNode(node, context);
      case "italic":
        return ItalicChildNode.toFigmaNode(node, context);
      case "strong":
        return StrongChildNode.toFigmaNode(node, context);
      case "em":
        return EmChildNode.toFigmaNode(node, context);
      case "b":
        return BChildNode.toFigmaNode(node, context);
      case "i":
        return IChildNode.toFigmaNode(node, context);
      case "other":
        return OtherChildNode.toFigmaNode(node, context);
      default: {
        const _exhaustive: never = node;
        throw new Error(`Unknown node kind: ${JSON.stringify(_exhaustive)}`);
      }
    }
  },
};
