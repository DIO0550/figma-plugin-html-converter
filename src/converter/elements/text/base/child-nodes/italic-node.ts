import type { BaseChildNode, ChildNodeContext, ChildNodeResult } from "./base";
import { TextNodeConfig } from "../../../../models/figma-node";
import { Typography } from "../../styles/typography/typography";
import { parseStyles } from "./utils";

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

    /**
     * 見出し要素内の斜体処理
     *
     * 見出し（h1-h6）内では太字等のスタイルがベースに含まれるため、
     * 斜体は明示的にフォントスタイルを"ITALIC"へ設定します。
     * これにより見出しの階層構造を保ちながら、期待どおりに斜体を適用します。
     */
    if (context.isHeading) {
      return {
        node: TextNodeConfig.setFontStyle(figmaNode, "ITALIC"),
        metadata: {
          isText: true, // テキストコンテンツを持つため true
          isBold: false,
          isItalic: true,
          tagName: "italic",
        },
      };
    }

    return {
      node: figmaNode,
      metadata: {
        isText: true, // テキストコンテンツを持つため true
        isBold: false,
        isItalic: true,
        tagName: "italic",
      },
    };
  },
};
