import type { BaseChildNode, ChildNodeContext, ChildNodeResult } from "./base";
import { TextNodeConfig } from "../../../../models/figma-node";
import { Typography } from "../../styles/typography/typography";

/**
 * 斜体ノード型
 */
export type ItalicChildNode = BaseChildNode & {
  kind: "italic";
  content: string;
};

/**
 * ItalicChildNodeのコンパニオンオブジェクト
 */
export const ItalicChildNode = {
  create(content: string, styles?: Record<string, string>): ItalicChildNode {
    return { kind: "italic", content, styles };
  },

  from(content: string, styles?: Record<string, string>): ItalicChildNode {
    return ItalicChildNode.create(content, styles);
  },

  toFigmaNode(
    node: ItalicChildNode,
    context: ChildNodeContext,
  ): ChildNodeResult {
    const baseConfig = TextNodeConfig.create(node.content);
    const parentStyles = context.parentStyle
      ? parseStyles(context.parentStyle)
      : {};
    const styles = { ...parentStyles, ...node.styles, "font-style": "italic" };
    const figmaNode = Typography.applyToTextNode(
      baseConfig,
      styles,
      context.elementType,
    );

    // 見出しの場合は特別な処理
    if (context.isHeading) {
      return {
        node: TextNodeConfig.setFontStyle(figmaNode, "ITALIC"),
        metadata: {
          isText: false,
          isBold: false,
          isItalic: true,
          tagName: "italic",
        },
      };
    }

    return {
      node: figmaNode,
      metadata: {
        isText: false,
        isBold: false,
        isItalic: true,
        tagName: "italic",
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
