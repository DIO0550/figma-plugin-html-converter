import type { BaseChildNode, ChildNodeContext, ChildNodeResult } from "./base";
import { TextNodeConfig } from "../../../../models/figma-node";
import { Typography } from "../../styles/typography/typography";
import { parseStyles } from "./utils";

/**
 * Del要素ノード型
 * 削除済みテキスト（del要素）を表現
 *
 * @remarks
 * del要素は取り消し線（line-through）の
 * デフォルトスタイルが適用されます。
 */
export type DelChildNode = BaseChildNode & {
  kind: "del";
  content: string;
};

/**
 * DelChildNodeのコンパニオンオブジェクト
 */
export const DelChildNode = {
  /**
   * DelChildNodeを作成
   *
   * @param content - テキストコンテンツ
   * @param styles - スタイル（オプション）
   * @returns 作成されたDelChildNode
   *
   * @example
   * ```typescript
   * const node = DelChildNode.create("削除されたテキスト");
   * ```
   */
  create(content: string, styles?: Record<string, string>): DelChildNode {
    return { kind: "del", content, styles };
  },

  /**
   * DelChildNodeを作成（createのエイリアス）
   *
   * @param content - テキストコンテンツ
   * @param styles - スタイル（オプション）
   * @returns 作成されたDelChildNode
   *
   * @example
   * ```typescript
   * const node = DelChildNode.from("削除されたテキスト");
   * ```
   */
  from(content: string, styles?: Record<string, string>): DelChildNode {
    return DelChildNode.create(content, styles);
  },

  /**
   * DelChildNodeをFigmaノードに変換
   *
   * @param node - 変換対象のDelChildNode
   * @param context - 変換コンテキスト
   * @returns Figmaノード変換結果
   *
   * @remarks
   * デフォルトスタイル:
   * - textDecoration: "STRIKETHROUGH" (取り消し線)
   *
   * @example
   * ```typescript
   * const node = DelChildNode.create("削除されたテキスト");
   * const context = { elementType: "p", isHeading: false };
   * const result = DelChildNode.toFigmaNode(node, context);
   * ```
   */
  toFigmaNode(node: DelChildNode, context: ChildNodeContext): ChildNodeResult {
    const baseConfig = TextNodeConfig.create(node.content);
    const parentStyles = context.parentStyle
      ? parseStyles(context.parentStyle)
      : {};

    // del要素のデフォルトスタイル
    const delDefaultStyles = {
      "text-decoration": "line-through",
    };

    // スタイルの優先順位: カスタムスタイル > delデフォルトスタイル > 親スタイル
    const styles = {
      ...parentStyles,
      ...delDefaultStyles,
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
        tagName: context.isHeading ? undefined : "del",
      },
    };
  },
};
