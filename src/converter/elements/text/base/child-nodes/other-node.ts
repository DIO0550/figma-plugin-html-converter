import type { BaseChildNode, ChildNodeContext, ChildNodeResult } from "./base";
import { TextNodeConfig } from "../../../../models/figma-node";
import { Typography } from "../../styles/typography/typography";

/**
 * その他の要素ノード型
 */
export type OtherChildNode = BaseChildNode & {
  kind: "other";
  tagName: string;
  content: string;
};

/**
 * OtherChildNodeのコンパニオンオブジェクト
 */
export const OtherChildNode = {
  create(
    tagName: string,
    content: string,
    styles?: Record<string, string>,
  ): OtherChildNode {
    return { kind: "other", tagName, content, styles };
  },

  from(
    tagName: string,
    content: string,
    styles?: Record<string, string>,
  ): OtherChildNode {
    return OtherChildNode.create(tagName, content, styles);
  },

  toFigmaNode(
    node: OtherChildNode,
    context: ChildNodeContext,
  ): ChildNodeResult {
    const baseConfig = TextNodeConfig.create(node.content);
    const parentStyles = context.parentStyle
      ? parseStyles(context.parentStyle)
      : {};
    const styles = { ...parentStyles, ...node.styles };
    const figmaNode = Typography.applyToTextNode(
      baseConfig,
      styles,
      context.elementType,
    );

    return {
      node: figmaNode,
      metadata: {
        isText: true,
        isBold: false,
        isItalic: false,
        tagName: node.tagName,
      },
    };
  },
};

// ヘルパー関数
function parseStyles(styleString: string): Record<string, string> {
  try {
    return JSON.parse(styleString);
  } catch {
    return {};
  }
}
