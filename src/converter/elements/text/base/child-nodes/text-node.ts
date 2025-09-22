import type { BaseChildNode, ChildNodeContext, ChildNodeResult } from "./base";
import { TextNodeConfig } from "../../../../models/figma-node";
import { Typography } from "../../styles/typography/typography";

/**
 * テキストノード型
 */
export type TextChildNode = BaseChildNode & {
  kind: "text";
  content: string;
};

/**
 * TextChildNodeのコンパニオンオブジェクト
 */
export const TextChildNode = {
  create(content: string, styles?: Record<string, string>): TextChildNode {
    return { kind: "text", content, styles };
  },

  from(content: string, styles?: Record<string, string>): TextChildNode {
    return TextChildNode.create(content, styles);
  },

  toFigmaNode(node: TextChildNode, context: ChildNodeContext): ChildNodeResult {
    const baseConfig = TextNodeConfig.create(node.content);
    const styles = {
      ...(context.parentStyle ? parseStyles(context.parentStyle) : {}),
      ...node.styles,
    };
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
