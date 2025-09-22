import type { BaseChildNode, ChildNodeContext, ChildNodeResult } from "./base";
import { BoldChildNode } from "./bold-node";

/**
 * Strong要素ノード型
 */
export type StrongChildNode = BaseChildNode & {
  kind: "strong";
  content: string;
};

/**
 * StrongChildNodeのコンパニオンオブジェクト
 */
export const StrongChildNode = {
  create(content: string, styles?: Record<string, string>): StrongChildNode {
    return { kind: "strong", content, styles };
  },

  from(content: string, styles?: Record<string, string>): StrongChildNode {
    return StrongChildNode.create(content, styles);
  },

  toFigmaNode(
    node: StrongChildNode,
    context: ChildNodeContext,
  ): ChildNodeResult {
    // StrongはBoldと同じ処理
    return BoldChildNode.toFigmaNode(
      BoldChildNode.create(node.content, node.styles),
      context,
    );
  },
};
