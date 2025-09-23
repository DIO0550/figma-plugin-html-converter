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
     * 見出し（h1-h6）内の斜体要素は、テキストスタイルの一部として
     * 処理されるため、個別のスタイルノードとして扱います。
     * これにより、見出しの階層構造を保ちながら斜体スタイルを適用できます。
     *
     * metadata.isText: false は、これが装飾的なスタイルノードであることを示し、
     * 純粋なテキストノードではなく、スタイル情報を持つノードであることを表します。
     */
    if (context.isHeading) {
      return {
        node: TextNodeConfig.setFontStyle(figmaNode, "ITALIC"),
        metadata: {
          isText: false, // スタイルノードであることを示す（純粋なテキストノードではない）
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
