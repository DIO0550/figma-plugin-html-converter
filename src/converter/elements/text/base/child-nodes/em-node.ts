import type { BaseChildNode, ChildNodeContext, ChildNodeResult } from "./base";
import { ItalicChildNode } from "./italic-node";

/**
 * Em要素ノード型
 */
export type EmChildNode = BaseChildNode & {
  kind: "em";
  content: string;
};

/**
 * EmChildNodeのコンパニオンオブジェクト
 */
export const EmChildNode = {
  create(content: string, styles?: Record<string, string>): EmChildNode {
    return { kind: "em", content, styles };
  },

  from(content: string, styles?: Record<string, string>): EmChildNode {
    return EmChildNode.create(content, styles);
  },

  toFigmaNode(node: EmChildNode, context: ChildNodeContext): ChildNodeResult {
    // EmはItalicと同じ処理
    return ItalicChildNode.toFigmaNode(
      ItalicChildNode.create(node.content, node.styles),
      context,
    );
  },
};
