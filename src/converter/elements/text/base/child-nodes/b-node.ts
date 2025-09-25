import type { BaseChildNode, ChildNodeContext, ChildNodeResult } from "./base";
import { BoldChildNode } from "./bold-node";

/**
 * B要素ノード型
 */
export type BChildNode = BaseChildNode & {
  kind: "b";
  content: string;
};

/**
 * BChildNodeのコンパニオンオブジェクト
 */
export const BChildNode = {
  create(content: string, styles?: Record<string, string>): BChildNode {
    return { kind: "b", content, styles };
  },

  from(content: string, styles?: Record<string, string>): BChildNode {
    return BChildNode.create(content, styles);
  },

  toFigmaNode(node: BChildNode, context: ChildNodeContext): ChildNodeResult {
    // BはBoldと同じ処理
    return BoldChildNode.toFigmaNode(
      BoldChildNode.create(node.content, node.styles),
      context,
    );
  },
};
