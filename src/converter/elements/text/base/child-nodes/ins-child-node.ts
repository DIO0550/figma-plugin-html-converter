import type { BaseChildNode, ChildNodeContext, ChildNodeResult } from "./base";
import { TextNodeConfig } from "../../../../models/figma-node";
import { Typography } from "../../styles/typography/typography";
import { parseStyles } from "./utils";

/**
 * Ins要素ノード型
 * 挿入済みテキスト（ins要素）を表現
 *
 * @remarks
 * ins要素は下線（underline）の
 * デフォルトスタイルが適用されます。
 */
export type InsChildNode = BaseChildNode & {
  kind: "ins";
  content: string;
};

/**
 * InsChildNodeのコンパニオンオブジェクト
 */
export const InsChildNode = {
  /**
   * InsChildNodeを作成
   *
   * @param content - テキストコンテンツ
   * @param styles - スタイル（オプション）
   * @returns 作成されたInsChildNode
   *
   * @example
   * ```typescript
   * const node = InsChildNode.create("挿入されたテキスト");
   * ```
   */
  create(content: string, styles?: Record<string, string>): InsChildNode {
    return { kind: "ins", content, styles };
  },

  /**
   * InsChildNodeを作成（createのエイリアス）
   *
   * @param content - テキストコンテンツ
   * @param styles - スタイル（オプション）
   * @returns 作成されたInsChildNode
   *
   * @example
   * ```typescript
   * const node = InsChildNode.from("挿入されたテキスト");
   * ```
   */
  from(content: string, styles?: Record<string, string>): InsChildNode {
    return InsChildNode.create(content, styles);
  },

  /**
   * InsChildNodeをFigmaノードに変換
   *
   * @param node - 変換対象のInsChildNode
   * @param context - 変換コンテキスト
   * @returns Figmaノード変換結果
   *
   * @remarks
   * デフォルトスタイル:
   * - textDecoration: "UNDERLINE" (下線)
   *
   * @example
   * ```typescript
   * const node = InsChildNode.create("挿入されたテキスト");
   * const context = { elementType: "p", isHeading: false };
   * const result = InsChildNode.toFigmaNode(node, context);
   * ```
   */
  toFigmaNode(node: InsChildNode, context: ChildNodeContext): ChildNodeResult {
    const baseConfig = TextNodeConfig.create(node.content);
    const parentStyles = context.parentStyle
      ? parseStyles(context.parentStyle)
      : {};

    // ins要素のデフォルトスタイル
    const insDefaultStyles = {
      "text-decoration": "underline",
    };

    // スタイルの優先順位: カスタムスタイル > insデフォルトスタイル > 親スタイル
    const styles = {
      ...parentStyles,
      ...insDefaultStyles,
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
        tagName: context.isHeading ? undefined : "ins",
      },
    };
  },
};
