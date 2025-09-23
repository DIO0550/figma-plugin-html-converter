import type { BaseChildNode, ChildNodeContext, ChildNodeResult } from "./base";
import { TextNodeConfig } from "../../../../models/figma-node";
import { Typography } from "../../styles/typography/typography";
import { parseStyles } from "./utils";

/**
 * 太字ノード型
 */
export type BoldChildNode = BaseChildNode & {
  kind: "bold";
  content: string;
};

/**
 * BoldChildNodeのコンパニオンオブジェクト
 */
export const BoldChildNode = {
  create(content: string, styles?: Record<string, string>): BoldChildNode {
    return { kind: "bold", content, styles };
  },

  from(content: string, styles?: Record<string, string>): BoldChildNode {
    return BoldChildNode.create(content, styles);
  },

  toFigmaNode(node: BoldChildNode, context: ChildNodeContext): ChildNodeResult {
    const baseConfig = TextNodeConfig.create(node.content);
    const parentStyles = context.parentStyle
      ? parseStyles(context.parentStyle)
      : {};
    const styles = { ...parentStyles, ...node.styles, "font-weight": "700" };
    const figmaNode = Typography.applyToTextNode(
      baseConfig,
      styles,
      context.elementType,
    );

    return {
      node: figmaNode,
      metadata: {
        isText: false,
        isBold: true,
        isItalic: false,
        tagName: context.isHeading ? undefined : "bold",
      },
    };
  },
};
