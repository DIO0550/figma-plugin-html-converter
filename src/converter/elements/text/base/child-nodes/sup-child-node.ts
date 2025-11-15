import type { BaseChildNode, ChildNodeContext, ChildNodeResult } from "./base";
import { TextNodeConfig } from "../../../../models/figma-node";
import { Typography } from "../../styles/typography/typography";
import { parseStyles } from "./utils";

/**
 * Sup要素ノード型
 * 上付き文字（sup要素）を表現
 *
 * @remarks
 * sup要素はフォントサイズ75%、vertical-align: superの
 * デフォルトスタイルが適用されます。
 *
 * 注意: vertical-align: superはFigmaの制約により直接実装できないため、
 * フォントサイズ縮小により上付き文字の視覚的効果を実現しています。
 */
export type SupChildNode = BaseChildNode & {
  kind: "sup";
  content: string;
};

/**
 * SupChildNodeのコンパニオンオブジェクト
 */
export const SupChildNode = {
  /**
   * SupChildNodeを作成
   *
   * @param content - テキストコンテンツ
   * @param styles - スタイル（オプション）
   * @returns 作成されたSupChildNode
   *
   * @example
   * ```typescript
   * const node = SupChildNode.create("2");
   * ```
   */
  create(content: string, styles?: Record<string, string>): SupChildNode {
    return { kind: "sup", content, styles };
  },

  /**
   * SupChildNodeを作成（createのエイリアス）
   *
   * @param content - テキストコンテンツ
   * @param styles - スタイル（オプション）
   * @returns 作成されたSupChildNode
   *
   * @example
   * ```typescript
   * const node = SupChildNode.from("2");
   * ```
   */
  from(content: string, styles?: Record<string, string>): SupChildNode {
    return SupChildNode.create(content, styles);
  },

  /**
   * SupChildNodeをFigmaノードに変換
   *
   * @param node - 変換対象のSupChildNode
   * @param context - 変換コンテキスト
   * @returns Figmaノード変換結果
   *
   * @remarks
   * デフォルトスタイル:
   * - font-size: 0.75em (親の75%)
   * - vertical-align: super
   *
   * 注意: vertical-align: superはFigmaの制約により直接実装できないため、
   * フォントサイズ縮小により上付き文字の視覚的効果を実現しています。
   *
   * @example
   * ```typescript
   * const node = SupChildNode.create("2");
   * const context = { elementType: "p", isHeading: false };
   * const result = SupChildNode.toFigmaNode(node, context);
   * ```
   */
  toFigmaNode(node: SupChildNode, context: ChildNodeContext): ChildNodeResult {
    const baseConfig = TextNodeConfig.create(node.content);
    const parentStyles = context.parentStyle
      ? parseStyles(context.parentStyle)
      : {};

    // sup要素のデフォルトスタイル
    const supDefaultStyles = {
      "font-size": "0.75em",
      "vertical-align": "super",
    };

    // スタイルの優先順位: カスタムスタイル > supデフォルトスタイル > 親スタイル
    const styles = {
      ...parentStyles,
      ...supDefaultStyles,
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
        tagName: context.isHeading ? undefined : "sup",
      },
    };
  },
};
