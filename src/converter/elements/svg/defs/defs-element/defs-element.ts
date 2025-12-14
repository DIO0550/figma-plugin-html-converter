import type { FigmaNodeConfig } from "../../../../models/figma-node";
import type { DefsAttributes } from "../defs-attributes";
import type { SvgChildNode } from "../../group/group-element";

/**
 * SVG defs（定義）要素の型定義
 *
 * defs要素は直接描画されず、以下のような定義を含む:
 * - linearGradient, radialGradient: グラデーション定義
 * - pattern: パターン定義
 * - clipPath: クリッピングパス定義
 * - mask: マスク定義
 * - filter: フィルター定義
 * - symbol: シンボル定義（use要素で参照）
 */
export interface DefsElement {
  type: "element";
  tagName: "defs";
  attributes: DefsAttributes;
  children?: SvgChildNode[];
}

/**
 * DefsElementコンパニオンオブジェクト
 */
export const DefsElement = {
  /**
   * DefsElement型ガード
   *
   * @param node - 判定対象のノード
   * @returns nodeがDefsElementの場合true
   */
  isDefsElement(node: unknown): node is DefsElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "defs"
    );
  },

  /**
   * DefsElementファクトリーメソッド
   *
   * @param attributes - defs要素の属性（デフォルト: 空オブジェクト）
   * @param children - 子要素（定義要素）の配列
   * @returns 新しいDefsElementインスタンス
   */
  create(
    attributes: Partial<DefsAttributes> = {},
    children?: SvgChildNode[],
  ): DefsElement {
    return {
      type: "element",
      tagName: "defs",
      attributes: attributes as DefsAttributes,
      children,
    };
  },

  /**
   * id属性を取得
   *
   * @param element - 対象のDefsElement
   * @returns id属性の値、未設定の場合はundefined
   */
  getId(element: DefsElement): string | undefined {
    return element.attributes.id;
  },

  /**
   * defs要素の子要素（定義）を取得
   *
   * @param element - 対象のDefsElement
   * @returns 子要素の配列、子要素が存在しない場合は空配列
   */
  getDefinitions(element: DefsElement): SvgChildNode[] {
    return element.children ?? [];
  },

  /**
   * DefsElementをFigmaノード設定にマッピング
   *
   * defs要素は直接描画されないため、常にnullを返す。
   * 将来的には定義を保持し、参照時に解決する実装に拡張可能。
   *
   * @param _node - マッピング対象のノード（DefsElementの場合は無視される）
   * @returns 常にnull（defs要素は描画されないため）
   */
  mapToFigma(_node: unknown): FigmaNodeConfig | null {
    return null;
  },
};
