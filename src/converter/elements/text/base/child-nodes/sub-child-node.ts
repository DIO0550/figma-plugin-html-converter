import type { BaseChildNode, ChildNodeContext, ChildNodeResult } from "./base";
import { TextNodeConfig } from "../../../../models/figma-node";
import { Typography } from "../../styles/typography/typography";
import { parseStyles } from "./utils";

/**
 * Sub要素ノード型
 * 下付き文字（sub要素）を表現
 *
 * @remarks
 * sub要素はフォントサイズ75%、vertical-align: subの
 * デフォルトスタイルが適用されます。
 *
 * 注意: vertical-align: subはFigmaの制約により直接実装できないため、
 * フォントサイズ縮小により下付き文字の視覚的効果を実現しています。
 */
export type SubChildNode = BaseChildNode & {
  kind: "sub";
  content: string;
};

/**
 * SubChildNodeのコンパニオンオブジェクト
 */
export const SubChildNode = {
  /**
   * SubChildNodeを作成
   *
   * @param content - テキストコンテンツ
   * @param styles - スタイル（オプション）
   * @returns 作成されたSubChildNode
   *
   * @example
   * ```typescript
   * const node = SubChildNode.create("2");
   * ```
   */
  create(content: string, styles?: Record<string, string>): SubChildNode {
    return { kind: "sub", content, styles };
  },

  /**
   * SubChildNodeを作成（createのエイリアス）
   *
   * @param content - テキストコンテンツ
   * @param styles - スタイル（オプション）
   * @returns 作成されたSubChildNode
   *
   * @example
   * ```typescript
   * const node = SubChildNode.from("2");
   * ```
   */
  from(content: string, styles?: Record<string, string>): SubChildNode {
    return SubChildNode.create(content, styles);
  },

  /**
   * SubChildNodeをFigmaノードに変換
   *
   * @param node - 変換対象のSubChildNode
   * @param context - 変換コンテキスト
   * @returns Figmaノード変換結果
   *
   * @remarks
   * デフォルトスタイル:
   * - font-size: 0.75em (親の75%)
   * - vertical-align: sub
   *
   * 注意: vertical-align: subはFigmaの制約により直接実装できないため、
   * フォントサイズ縮小により下付き文字の視覚的効果を実現しています。
   *
   * @example
   * ```typescript
   * const node = SubChildNode.create("2");
   * const context = { elementType: "p", isHeading: false };
   * const result = SubChildNode.toFigmaNode(node, context);
   * ```
   */
  toFigmaNode(node: SubChildNode, context: ChildNodeContext): ChildNodeResult {
    const baseConfig = TextNodeConfig.create(node.content);
    const parentStyles = context.parentStyle
      ? parseStyles(context.parentStyle)
      : {};

    // sub要素のデフォルトスタイル
    const subDefaultStyles = {
      "font-size": "0.75em",
      "vertical-align": "sub",
    };

    // スタイルの優先順位: カスタムスタイル > subデフォルトスタイル > 親スタイル
    const styles = {
      ...parentStyles,
      ...subDefaultStyles,
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
        tagName: context.isHeading ? undefined : "sub",
      },
    };
  },
};
