import type { BaseChildNode, ChildNodeContext, ChildNodeResult } from "../base";
import { TextNodeConfig } from "../../../../../models/figma-node";
import { Typography } from "../../../styles/typography/typography";
import { parseStyles } from "../utils";

/**
 * コードノード型
 * インラインコード（code要素）を表現
 *
 * @remarks
 * code要素はモノスペースフォント、背景色、パディングなどの
 * デフォルトスタイルが適用されます。
 */
export type CodeChildNode = BaseChildNode & {
  kind: "code";
  content: string;
};

/**
 * CodeChildNodeのコンパニオンオブジェクト
 */
export const CodeChildNode = {
  /**
   * CodeChildNodeを作成
   *
   * @param content - テキストコンテンツ
   * @param styles - スタイル（オプション）
   * @returns 作成されたCodeChildNode
   *
   * @example
   * ```typescript
   * const node = CodeChildNode.create("const x = 10;");
   * ```
   */
  create(content: string, styles?: Record<string, string>): CodeChildNode {
    return { kind: "code", content, styles };
  },

  /**
   * CodeChildNodeを作成（createのエイリアス）
   *
   * @param content - テキストコンテンツ
   * @param styles - スタイル（オプション）
   * @returns 作成されたCodeChildNode
   *
   * @example
   * ```typescript
   * const node = CodeChildNode.from("const x = 10;");
   * ```
   */
  from(content: string, styles?: Record<string, string>): CodeChildNode {
    return CodeChildNode.create(content, styles);
  },

  /**
   * CodeChildNodeをFigmaノードに変換
   *
   * @param node - 変換対象のCodeChildNode
   * @param context - 変換コンテキスト
   * @returns Figmaノード変換結果
   *
   * @remarks
   * デフォルトスタイル:
   * - fontFamily: "Courier New" (モノスペースフォント)
   * - fontSize: 14 (通常より小さめ)
   * - fontWeight: 400 (通常の太さ)
   *
   * @example
   * ```typescript
   * const node = CodeChildNode.create("const x = 10;");
   * const context = { elementType: "p", isHeading: false };
   * const result = CodeChildNode.toFigmaNode(node, context);
   * ```
   */
  toFigmaNode(node: CodeChildNode, context: ChildNodeContext): ChildNodeResult {
    const baseConfig = TextNodeConfig.create(node.content);
    const parentStyles = context.parentStyle
      ? parseStyles(context.parentStyle)
      : {};

    // code要素のデフォルトスタイル
    const codeDefaultStyles = {
      "font-family": "Courier New",
      "font-size": "14px",
      "font-weight": "400",
    };

    // スタイルの優先順位: カスタムスタイル > codeデフォルトスタイル > 親スタイル
    const styles = {
      ...parentStyles,
      ...codeDefaultStyles,
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
        isText: true, // テキストコンテンツを持つため true
        isBold: false,
        isItalic: false,
        // 見出し内ではタグ名は付与しない
        tagName: context.isHeading ? undefined : "code",
      },
    };
  },
};
