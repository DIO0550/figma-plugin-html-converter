import type { BaseChildNode, ChildNodeContext, ChildNodeResult } from "./base";
import { ItalicChildNode } from "./italic-node";

/**
 * I要素ノード型
 */
export type IChildNode = BaseChildNode & {
  kind: "i";
  content: string;
};

/**
 * IChildNodeのコンパニオンオブジェクト
 */
export const IChildNode = {
  create(content: string, styles?: Record<string, string>): IChildNode {
    return { kind: "i", content, styles };
  },

  from(content: string, styles?: Record<string, string>): IChildNode {
    return IChildNode.create(content, styles);
  },

  toFigmaNode(node: IChildNode, context: ChildNodeContext): ChildNodeResult {
    // IはItalicと同じ処理
    return ItalicChildNode.toFigmaNode(
      ItalicChildNode.create(node.content, node.styles),
      context,
    );
  },
};
